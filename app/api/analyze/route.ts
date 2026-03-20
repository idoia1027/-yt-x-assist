import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const CACHE_PATH = path.join(process.cwd(), 'data', 'analyses.json')

function readCache(): Record<string, unknown> {
  try { return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')) } catch { return {} }
}

function writeCache(cache: Record<string, unknown>): void {
  try {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true })
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8')
  } catch { /* read-only filesystem (e.g. Vercel prod) — fail silently */ }
}

const SYSTEM_PROMPT = `你是一名专业内容提炼分析师，专门为 "YouTube & X Assist" 提取高质量学习笔记。

你的任务是从输入的视频转录文本中，提炼出结构化信息，用于生成高质量的学习详情页。

你必须遵守以下标准：
1. 不捏造、不延展原文未出现的信息。
2. 中文表达简洁、自然、有学习笔记感。
3. 英文部分保持专业、流畅、准确。
4. 输出字段必须完整且顺序一致。
5. 如原文缺失对应信息，用 null 明确标注。
6. timeline 要完整覆盖全视频主要内容节点。

模块定义与底层逻辑：
- overview：中英各一段，概括主题、核心论点与实用价值
- timeline：8-15 个关键时间节点，覆盖全片脉络
- key_concepts：全篇中最有信息价值、值得展开的 3-5 个核心概念
- core_takeaways：3-5 条最高级核心观点（中英双语）
- keywords：5 个左右核心术语或专业词汇（中英释义）
- phrase_drill：3-4 个值得记忆的英文地道表达（附中文翻译）
- reflection_questions：2 个引导思考的反思问题
- closing_note：一句话结语/行动建议

输出严格按照以下 JSON 格式，不要输出任何其他文字：

{
  "overview_cn": "150字以内的中文总结，直白说明主题、亮点与实用价值",
  "overview_en": "A concise 2-3 sentence English summary of the core argument and significance",
  "timeline": [
    {"time": "00:00", "cn": "中文时间点总结", "en": "English timestamp description"}
  ],
  "key_concepts": [
    {"title": "概念名称", "desc": "50-80字的中文解释，有学习笔记感"}
  ],
  "core_takeaways": [
    {"en": "English core insight sentence", "cn": "对应的中文核心观点"}
  ],
  "keywords": [
    {"word": "English Term", "en": "English definition in context", "cn": "中文解释（结合视频语境）"}
  ],
  "phrase_drill": [
    {"en": "Original English phrase worth memorizing", "cn": "中文对照翻译"}
  ],
  "reflection_questions": ["中文反思问题1", "中文反思问题2"],
  "closing_note": "中文结语，一句话行动建议"
}

=== Few-shot 示例（帮助你理解期望的输出质量） ===

输入摘要：Prompt Engineering in 2025 讲述了提示工程从"技巧"演化为"人工社交智能"的过程。

示例输出：
{
  "overview_cn": "本期讲述提示工程如何演化为"人工社交智能"，强调通过示例和社交化提问提升模型稳定性。看完后你能改写自己常用的 Prompt，并开始沉淀个人示例库。",
  "overview_en": "This talk reframes prompt engineering as 'Artificial Social Intelligence' — communicating with models like collaborators to unlock more reliable outputs.",
  "timeline": [
    {"time": "00:00", "en": "Why prompt engineering still matters", "cn": "提示工程依然重要的原因"},
    {"time": "06:24", "en": "Artificial Social Intelligence as a new framing", "cn": "提示工程的新视角：人工社交智能"},
    {"time": "12:24", "en": "Few-shot prompting and the power of examples", "cn": "少样本示例的威力"},
    {"time": "25:03", "en": "Decomposition + self-critique", "cn": "任务拆解与自我校对"}
  ],
  "key_concepts": [
    {"title": "人工社交智能", "desc": "与其说是在"写提示"，不如说是在练习如何与一个强大但有偏好的合作者对话。"},
    {"title": "示例优先于规则", "desc": "很多任务是"说不清但看得懂"的，用示范样本往往比罗列规则更有效。"},
    {"title": "结构化输出", "desc": "用 JSON / 列表等结构，既方便机器解析，也方便后续复用和拼装。"}
  ],
  "core_takeaways": [
    {"en": "Prompt engineering = Artificial Social Intelligence", "cn": "提示工程本质上是一种"人工社交智能"。"},
    {"en": "Few-shot examples are the strongest lever for stability", "cn": "少样本示例是提升稳定性的最强杠杆。"}
  ],
  "keywords": [
    {"word": "Few-shot prompting", "en": "Teaching the model with a handful of examples instead of pure instructions", "cn": "少样本提示：用少量示范样本而不是纯说明文字来教模型做事"},
    {"word": "Self-critique", "en": "Letting the model review and improve its own answer", "cn": "自我审校：模型复盘自检机制"}
  ],
  "phrase_drill": [
    {"en": "Treat the model like a collaborator, not a vending machine.", "cn": "把模型当合作伙伴，而不是自动售货机。"}
  ],
  "reflection_questions": ["你有哪些任务可以用 Few-shot 重新设计？", "如何建立属于自己的 Prompt 示例库？"],
  "closing_note": "从今天开始，把你写得最满意的 3-5 个 Prompt 和对应示例单独存起来，作为个人 Prompt Library 的起点。"
}

=== 规则补充 ===
- timeline 数量根据视频长度调节：<15分钟给 4-6 个，15-60分钟给 6-10 个，>60分钟给 10-15 个
- 如果没有精确时间信息，按内容结构均匀分布估算时间点
- key_concepts 不是简单列术语，而是提炼"值得展开讲"的核心论点
- phrase_drill 优先选择视频中的原话、地道表达、有记忆点的句子
- 所有内容必须基于实际视频内容，不要编造`

export async function POST(req: NextRequest) {
  try {
    const { videoId, title, author, transcript } = await req.json()

    // Return cached result if available
    if (videoId) {
      const cache = readCache()
      if (cache[videoId]) {
        return NextResponse.json({ analysis: cache[videoId], cached: true })
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })

    const userMessage = transcript
      ? `请分析以下 YouTube 视频内容：\n\n标题：${title}\n作者：${author}\n\n字幕内容（格式为 [MM:SS] 文字，请直接使用这些时间戳填写 timeline 的 time 字段）：\n${transcript.slice(0, 30000)}`
      : `请基于以下视频信息进行分析（无字幕，请基于标题和作者推断主要内容）：\n\n标题：${title}\n作者：${author}\n\n注意：由于无法获取字幕，请在 overview_cn 开头注明"（基于标题分析，内容可能不完整）"，timeline 时间点用 "—" 占位。`

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
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim() || '{}'
    const analysis = JSON.parse(cleaned)

    // Save to cache
    if (videoId) {
      const cache = readCache()
      cache[videoId] = analysis
      writeCache(cache)
    }

    return NextResponse.json({ analysis })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Analyze error:', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
