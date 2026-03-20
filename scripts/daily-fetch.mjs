/**
 * daily-fetch.mjs
 * 每天自动拉取 channels.json 里配置的 YouTube 频道新视频，
 * 通过 Supadata 获取字幕，Gemini 分析内容，写入 data/analyses.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ANALYSES_PATH = path.join(ROOT, 'data', 'analyses.json')
const CHANNELS_PATH = path.join(ROOT, 'data', 'channels.json')

const SUPADATA_KEY = process.env.SUPADATA_API_KEY
const GEMINI_KEY = process.env.OPENAI_API_KEY  // Gemini via OpenAI-compat endpoint

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) } catch { return null }
}

function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

function formatTime(ms) {
  const m = Math.floor(ms / 1000 / 60)
  const s = Math.floor(ms / 1000 % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// 从 YouTube RSS 拉频道最新视频（最多 15 条）
async function fetchChannelVideos(channelId) {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const xml = await res.text()

  const videos = []
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []
  for (const entry of entries) {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/)
    const authorMatch = entry.match(/<name>([^<]+)<\/name>/)
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/)
    if (!idMatch) continue
    videos.push({
      videoId: idMatch[1],
      title: titleMatch ? titleMatch[1] : '',
      author: authorMatch ? authorMatch[1] : '',
      publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
    })
  }
  return videos
}

// Supadata 拿字幕
async function fetchTranscript(videoId) {
  const res = await fetch(
    `https://api.supadata.ai/v1/transcript?url=https://www.youtube.com/watch?v=${videoId}`,
    { headers: { 'x-api-key': SUPADATA_KEY } }
  )
  if (!res.ok) return ''
  const data = await res.json()
  const content = data?.content
  if (!content?.length) return ''
  return content.map(s => `[${formatTime(s.offset)}] ${s.text}`).join('\n').slice(0, 30000)
}

// Gemini 分析
async function analyzeVideo({ videoId, title, author, transcript }) {
  const { OpenAI } = await import('openai')
  const client = new OpenAI({
    apiKey: GEMINI_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  })

  const userMessage = transcript
    ? `请分析以下 YouTube 视频内容：\n\n标题：${title}\n作者：${author}\n\n字幕内容（格式为 [MM:SS] 文字，请直接使用这些时间戳填写 timeline 的 time 字段）：\n${transcript}`
    : `请基于以下视频信息进行分析（无字幕）：\n\n标题：${title}\n作者：${author}`

  const SYSTEM_PROMPT = `你是一名专业内容提炼分析师，专门为 "YouTube & X Assist" 提取高质量学习笔记。

你的任务是从输入的视频转录文本中，提炼出结构化信息，用于生成高质量的学习详情页。

你必须遵守以下标准：
1. 不捏造、不延展原文未出现的信息。
2. 中文表达简洁、自然、有学习笔记感。
3. 英文部分保持专业、流畅、准确。
4. 输出字段必须完整且顺序一致。
5. 如原文缺失对应信息，用 null 明确标注。
6. timeline 要完整覆盖全视频主要内容节点。

输出严格按照以下 JSON 格式，不要输出任何其他文字：

{"overview_cn":"150字以内的中文总结","overview_en":"A concise 2-3 sentence English summary","timeline":[{"time":"00:00","cn":"中文时间点总结","en":"English timestamp description"}],"key_concepts":[{"title":"概念名称","desc":"50-80字的中文解释"}],"core_takeaways":[{"en":"English core insight","cn":"对应中文核心观点"}],"keywords":[{"word":"English Term","en":"English definition","cn":"中文解释"}],"phrase_drill":[{"en":"Original phrase","cn":"中文对照"}],"reflection_questions":["问题1","问题2"],"closing_note":"一句话行动建议"}

规则：timeline 数量根据视频长度调节：<15分钟给4-6个，15-60分钟给6-10个，>60分钟给10-15个。请直接使用字幕中的 [MM:SS] 时间戳填写 timeline 的 time 字段。`

  const completion = await client.chat.completions.create({
    model: 'models/gemini-2.5-flash',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.5,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content || '{}'
  return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim())
}

async function main() {
  if (!SUPADATA_KEY || !GEMINI_KEY) {
    console.error('Missing SUPADATA_API_KEY or OPENAI_API_KEY')
    process.exit(1)
  }

  const channels = readJSON(CHANNELS_PATH)
  const analyses = readJSON(ANALYSES_PATH) || {}

  let newCount = 0

  for (const channel of channels) {
    console.log(`\nFetching channel: ${channel.name} (${channel.channelId})`)
    let videos
    try {
      videos = await fetchChannelVideos(channel.channelId)
    } catch (e) {
      console.error(`  RSS error: ${e.message}`)
      continue
    }

    console.log(`  Found ${videos.length} videos, ${videos.filter(v => !analyses[v.videoId]).length} new`)

    for (const video of videos) {
      if (analyses[video.videoId]) {
        console.log(`  [skip] ${video.videoId} already analyzed`)
        continue
      }

      console.log(`  [new] ${video.videoId} — ${video.title}`)

      try {
        const transcript = await fetchTranscript(video.videoId)
        console.log(`    transcript: ${transcript.length} chars`)

        const analysis = await analyzeVideo({ ...video, transcript })
        analyses[video.videoId] = {
          ...analysis,
          title: video.title,
          author: video.author,
          thumbnail: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
          publishedAt: video.publishedAt,
        }
        newCount++
        console.log(`    analysis saved`)
      } catch (e) {
        console.error(`    error: ${e.message}`)
      }
    }
  }

  if (newCount > 0) {
    writeJSON(ANALYSES_PATH, analyses)
    console.log(`\nDone: ${newCount} new videos added`)
  } else {
    console.log('\nNo new videos found')
  }
}

main()
