import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

function extractVideoId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) return match[1]
  }
  return null
}

function parseVtt(vtt: string): string {
  return vtt
    .split('\n')
    .filter(line => {
      if (!line.trim()) return false
      if (line.startsWith('WEBVTT') || line.startsWith('Kind:') || line.startsWith('Language:')) return false
      if (/^\d{2}:\d{2}/.test(line)) return false
      if (line.includes('<c>') || line.includes('><')) return false
      return true
    })
    .filter((line, i, arr) => line !== arr[i - 1])
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Channel 1: YouTube ANDROID client — fetches player data to get caption track URLs
async function fetchViaAndroidClient(videoId: string): Promise<string> {
  const clientVersion = '20.10.38'
  try {
    const playerRes = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `com.google.android.youtube/${clientVersion} (Linux; U; Android 14)`,
      },
      body: JSON.stringify({
        context: { client: { clientName: 'ANDROID', clientVersion } },
        videoId,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!playerRes.ok) { console.error('android client player fetch failed:', playerRes.status); return '' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerData: any = await playerRes.json()
    const tracks: any[] = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
    if (!tracks || tracks.length === 0) { console.error('android client: no caption tracks'); return '' }

    // Prefer English, fallback to first
    const track = tracks.find((t: any) => t.languageCode?.startsWith('en')) || tracks[0]
    console.log(`android client: using track lang=${track.languageCode}`)

    const captionRes = await fetch(track.baseUrl, {
      headers: { 'User-Agent': `com.google.android.youtube/${clientVersion} (Linux; U; Android 14)` },
      signal: AbortSignal.timeout(10000),
    })
    if (!captionRes.ok) { console.error('android client: caption fetch failed:', captionRes.status); return '' }
    const xml = await captionRes.text()

    const lines: string[] = []
    const re = /<p\s+t="(\d+)"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g
    let m: RegExpExecArray | null
    while ((m = re.exec(xml)) !== null) {
      const tMs = parseInt(m[1])
      const text = m[2]
        .replace(/<s[^>]*>/g, '').replace(/<\/s>/g, '').replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .trim()
      if (text) lines.push(`[${formatTime(tMs)}] ${text}`)
    }
    console.log(`android client: parsed ${lines.length} lines`)
    return lines.join('\n').slice(0, 30000)
  } catch (e) {
    console.error('android client error:', e)
  }
  return ''
}

// Channel 1b: youtube-transcript npm package (fallback)
async function fetchViaYoutubeTranscript(videoId: string): Promise<string> {
  const langs = ['en', 'zh-Hans', 'zh-Hant', 'zh', undefined]
  for (const lang of langs) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, lang ? { lang } : {})
      if (items && items.length > 0) {
        const maxOffset = items.reduce((max, i) => Math.max(max, i.offset), 0)
        const divisor = maxOffset > 7200 ? 1000 : 1
        return items.map(i => `[${formatTime(i.offset / divisor)}] ${i.text}`).join('\n').slice(0, 30000)
      }
    } catch (e) {
      console.error(`youtube-transcript error (lang=${lang}):`, e)
    }
  }
  return ''
}

// Channel 2: parse ytInitialPlayerResponse to get caption track URL
async function fetchViaPageParse(videoId: string): Promise<string> {
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    })
    if (!pageRes.ok) { console.error('page parse: page fetch failed', pageRes.status); return '' }
    const html = await pageRes.text()

    // Extract ytInitialPlayerResponse JSON using brace counting (handles large nested JSON)
    const markerIdx = html.indexOf('ytInitialPlayerResponse')
    if (markerIdx === -1) { console.error('page parse: ytInitialPlayerResponse not found'); return '' }
    const jsonStart = html.indexOf('{', markerIdx)
    if (jsonStart === -1) { console.error('page parse: opening brace not found'); return '' }
    let depth = 0, jsonEnd = -1
    for (let i = jsonStart; i < html.length; i++) {
      if (html[i] === '{') depth++
      else if (html[i] === '}') { depth--; if (depth === 0) { jsonEnd = i; break } }
    }
    if (jsonEnd === -1) { console.error('page parse: could not find closing brace'); return '' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerData: any = JSON.parse(html.slice(jsonStart, jsonEnd + 1))
    const captionTracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
    if (!captionTracks || captionTracks.length === 0) {
      console.error('page parse: no caption tracks found')
      return ''
    }

    // Prefer English, fall back to first available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const track = captionTracks.find((t: any) => t.languageCode?.startsWith('en')) || captionTracks[0]
    const trackUrl = track.baseUrl + '&fmt=json3'
    console.log(`page parse: using track lang=${track.languageCode}, url=${trackUrl.slice(0, 80)}...`)

    const captionRes = await fetch(trackUrl, { signal: AbortSignal.timeout(10000) })
    if (!captionRes.ok) { console.error('page parse: caption fetch failed', captionRes.status); return '' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await captionRes.json()

    const events: any[] = data?.events || []
    return events
      .filter((e: any) => e.segs && e.tStartMs !== undefined)
      .map((e: any) => {
        const text = (e.segs as any[]).map((s: any) => s.utf8 || '').join('').replace(/\n/g, ' ').trim()
        return `[${formatTime(e.tStartMs / 1000)}] ${text}`
      })
      .filter((line: string) => !line.endsWith('] '))
      .join('\n')
      .slice(0, 30000)
  } catch (e) {
    console.error('page parse error:', e)
  }
  return ''
}

// Channel 3: yt-dlp (local dev fallback, not available on Vercel)
async function fetchViaYtDlp(videoId: string): Promise<string> {
  const tmpDir = os.tmpdir()
  const tmpBase = path.join(tmpDir, `yt_${videoId}`)
  try {
    execSync(
      `yt-dlp --skip-download --write-auto-sub --sub-lang en --sub-format vtt -o "${tmpBase}" "https://www.youtube.com/watch?v=${videoId}" --quiet`,
      { timeout: 30000 }
    )
    const vttPath = `${tmpBase}.en.vtt`
    if (fs.existsSync(vttPath)) {
      const vtt = fs.readFileSync(vttPath, 'utf-8')
      fs.unlinkSync(vttPath)
      return parseVtt(vtt).slice(0, 30000)
    }
  } catch (e) {
    console.error('yt-dlp error:', e)
  }
  return ''
}

async function fetchTranscript(videoId: string): Promise<string> {
  // Channel 1: ANDROID client (most reliable)
  const result1 = await fetchViaAndroidClient(videoId)
  if (result1) { console.log('transcript: channel 1 (android) success'); return result1 }

  // Channel 2: parse ytInitialPlayerResponse caption tracks
  const result2 = await fetchViaPageParse(videoId)
  if (result2) { console.log('transcript: channel 2 (page parse) success'); return result2 }

  // Channel 3: youtube-transcript package
  const result3 = await fetchViaYoutubeTranscript(videoId)
  if (result3) { console.log('transcript: channel 3 (npm pkg) success'); return result3 }

  // Channel 4: yt-dlp (local dev only)
  const result4 = await fetchViaYtDlp(videoId)
  if (result4) { console.log('transcript: channel 4 (yt-dlp) success'); return result4 }

  console.log('transcript: all channels failed')
  return ''
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

    const videoId = extractVideoId(url)
    if (!videoId) return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })

    const [oembedData, transcriptText] = await Promise.all([
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(r => r.ok ? r.json() : {}) as Promise<{title?: string; author_name?: string}>,
      fetchTranscript(videoId),
    ])

    return NextResponse.json({
      videoId,
      title: oembedData.title || '',
      author: oembedData.author_name || '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      transcript: transcriptText,
      hasTranscript: transcriptText.length > 0,
      _debug_transcript_preview: transcriptText.slice(0, 300),
    })
  } catch (err) {
    console.error('Transcript error:', err)
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 })
  }
}
