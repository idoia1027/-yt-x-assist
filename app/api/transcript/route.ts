import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

export const runtime = 'edge'

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

function formatTime(ms: number): string {
  const secs = Math.floor(ms / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Channel 0: Supadata API — bypasses Vercel IP block
async function fetchViaSupadata(videoId: string): Promise<string> {
  const apiKey = process.env.SUPADATA_API_KEY
  if (!apiKey) return ''
  try {
    const res = await fetch(
      `https://api.supadata.ai/v1/transcript?url=https://www.youtube.com/watch?v=${videoId}`,
      { headers: { 'x-api-key': apiKey }, signal: AbortSignal.timeout(15000) }
    )
    if (!res.ok) { console.error('supadata error:', res.status); return '' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json()
    const content: any[] = data?.content
    if (!content?.length) return ''
    console.log(`supadata: got ${content.length} segments, lang=${data.lang}`)
    return content
      .map((s: any) => `[${formatTime(s.offset)}] ${s.text}`)
      .join('\n')
      .slice(0, 30000)
  } catch (e) {
    console.error('supadata error:', e)
  }
  return ''
}

// Channel 1: YouTube ANDROID client — most reliable, session-free caption URLs
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
    if (!playerRes.ok) { console.error('ch1: player fetch failed', playerRes.status); return '' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerData: any = await playerRes.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tracks: any[] = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
    if (!tracks || tracks.length === 0) { console.error('ch1: no caption tracks'); return '' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const track = tracks.find((t: any) => t.languageCode?.startsWith('en')) || tracks[0]
    console.log(`ch1: track lang=${track.languageCode}`)

    const captionRes = await fetch(track.baseUrl, {
      headers: { 'User-Agent': `com.google.android.youtube/${clientVersion} (Linux; U; Android 14)` },
      signal: AbortSignal.timeout(10000),
    })
    if (!captionRes.ok) { console.error('ch1: caption fetch failed', captionRes.status); return '' }
    const xml = await captionRes.text()
    if (!xml || xml.length < 50) { console.error('ch1: caption body empty'); return '' }

    const lines: string[] = []
    const re = /<p\s+t="(\d+)"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g
    let m: RegExpExecArray | null
    while ((m = re.exec(xml)) !== null) {
      const text = m[2]
        .replace(/<s[^>]*>/g, '').replace(/<\/s>/g, '').replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .trim()
      if (text) lines.push(`[${formatTime(parseInt(m[1]))}] ${text}`)
    }
    console.log(`ch1: parsed ${lines.length} lines`)
    return lines.join('\n').slice(0, 30000)
  } catch (e) {
    console.error('ch1 error:', e)
  }
  return ''
}

// Channel 2: parse ytInitialPlayerResponse from video page
async function fetchViaPageParse(videoId: string): Promise<string> {
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    })
    if (!pageRes.ok) { console.error('ch2: page fetch failed', pageRes.status); return '' }
    const html = await pageRes.text()

    const markerIdx = html.indexOf('ytInitialPlayerResponse')
    if (markerIdx === -1) { console.error('ch2: ytInitialPlayerResponse not found'); return '' }
    const jsonStart = html.indexOf('{', markerIdx)
    let depth = 0, jsonEnd = -1
    for (let i = jsonStart; i < html.length; i++) {
      if (html[i] === '{') depth++
      else if (html[i] === '}') { depth--; if (depth === 0) { jsonEnd = i; break } }
    }
    if (jsonEnd === -1) return ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerData: any = JSON.parse(html.slice(jsonStart, jsonEnd + 1))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tracks: any[] = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
    if (!tracks || tracks.length === 0) { console.error('ch2: no caption tracks'); return '' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const track = tracks.find((t: any) => t.languageCode?.startsWith('en')) || tracks[0]
    const captionRes = await fetch(track.baseUrl + '&fmt=json3', { signal: AbortSignal.timeout(10000) })
    if (!captionRes.ok) return ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await captionRes.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events: any[] = data?.events || []
    return events
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((e: any) => e.segs && e.tStartMs !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((e: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const text = (e.segs as any[]).map((s: any) => s.utf8 || '').join('').replace(/\n/g, ' ').trim()
        return `[${formatTime(e.tStartMs)}] ${text}`
      })
      .filter((line: string) => !line.endsWith('] '))
      .join('\n').slice(0, 30000)
  } catch (e) {
    console.error('ch2 error:', e)
  }
  return ''
}

// Channel 3: youtube-transcript npm package
async function fetchViaYoutubeTranscript(videoId: string): Promise<string> {
  const langs = ['en', 'zh-Hans', 'zh-Hant', 'zh', undefined]
  for (const lang of langs) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, lang ? { lang } : {})
      if (items && items.length > 0) {
        const maxOffset = items.reduce((max, i) => Math.max(max, i.offset), 0)
        const divisor = maxOffset > 7200 ? 1000 : 1
        return items.map(i => `[${formatTime(i.offset / divisor * 1000)}] ${i.text}`).join('\n').slice(0, 30000)
      }
    } catch (e) {
      console.error(`ch3 error (lang=${lang}):`, e)
    }
  }
  return ''
}

async function fetchTranscript(videoId: string): Promise<{ text: string; debug: string }> {
  const log: string[] = []

  const r0 = await fetchViaSupadata(videoId)
  log.push(`ch0(supadata):${r0 ? r0.length + 'c' : 'empty'}`)
  if (r0) return { text: r0, debug: log.join('|') }

  const r1 = await fetchViaAndroidClient(videoId)
  log.push(`ch1:${r1 ? r1.length + 'c' : 'empty'}`)
  if (r1) return { text: r1, debug: log.join('|') }

  const r2 = await fetchViaPageParse(videoId)
  log.push(`ch2:${r2 ? r2.length + 'c' : 'empty'}`)
  if (r2) return { text: r2, debug: log.join('|') }

  const r3 = await fetchViaYoutubeTranscript(videoId)
  log.push(`ch3:${r3 ? r3.length + 'c' : 'empty'}`)
  if (r3) return { text: r3, debug: log.join('|') }

  return { text: '', debug: log.join('|') }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

    const videoId = extractVideoId(url)
    if (!videoId) return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })

    const [oembedData, { text: transcriptText, debug: transcriptDebug }] = await Promise.all([
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
    })
  } catch (err) {
    console.error('Transcript error:', err)
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 })
  }
}
