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

// Channel 1: youtube-transcript npm package (works on Vercel)
async function fetchViaYoutubeTranscript(videoId: string): Promise<string> {
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' })
    if (items && items.length > 0) {
      // Detect ms vs seconds: if max offset > 7200, it's milliseconds
      const maxOffset = items.reduce((max, i) => Math.max(max, i.offset), 0)
      const divisor = maxOffset > 7200 ? 1000 : 1
      return items.map(i => `[${formatTime(i.offset / divisor)}] ${i.text}`).join('\n').slice(0, 30000)
    }
  } catch (e) {
    console.error('youtube-transcript error:', e)
  }
  return ''
}

// Channel 2: direct timedtext API (fallback)
async function fetchViaTimedtext(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://video.google.com/timedtext?lang=en&v=${videoId}`,
      { signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) return ''
    const xml = await res.text()
    const matches = Array.from(xml.matchAll(/<text\s+start="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g))
    if (matches.length === 0) return ''
    return matches
      .map(m => {
        const text = m[2].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]+>/g, '').trim()
        return `[${formatTime(parseFloat(m[1]))}] ${text}`
      })
      .join('\n')
      .slice(0, 30000)
  } catch (e) {
    console.error('timedtext error:', e)
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
  // Channel 1
  const result1 = await fetchViaYoutubeTranscript(videoId)
  if (result1) { console.log('transcript: channel 1 success'); return result1 }

  // Channel 2
  const result2 = await fetchViaTimedtext(videoId)
  if (result2) { console.log('transcript: channel 2 success'); return result2 }

  // Channel 3
  const result3 = await fetchViaYtDlp(videoId)
  if (result3) { console.log('transcript: channel 3 success'); return result3 }

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
