import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'analyses.json'), 'utf-8')
    const data: Record<string, Record<string, unknown>> = JSON.parse(raw)

    const videos = Object.entries(data)
      .map(([videoId, entry]) => ({
        videoId,
        title: (entry.title as string) || '',
        author: (entry.author as string) || '',
        thumbnail: (entry.thumbnail as string) || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: (entry.publishedAt as string) || '',
      }))
      .filter(v => v.title)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json(videos)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
