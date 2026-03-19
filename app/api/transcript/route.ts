import { NextRequest, NextResponse } from 'next/server'
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
      if (/^\d{2}:\d{2}/.test(line)) return false   // timestamp lines
      if (line.includes('<c>') || line.includes('><')) return false  // word-level timing lines
      return true
    })
    // deduplicate consecutive identical lines (VTT rolls text forward)
    .filter((line, i, arr) => line !== arr[i - 1])
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchTranscriptWithYtDlp(videoId: string): Promise<string> {
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

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

    const videoId = extractVideoId(url)
    if (!videoId) return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })

    const [oembedData, transcriptText] = await Promise.all([
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(r => r.ok ? r.json() : {}),
      fetchTranscriptWithYtDlp(videoId),
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
