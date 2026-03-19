import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { YoutubeTranscript } from "youtube-transcript";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function getYouTubeMeta(videoId: string) {
  // YouTube oEmbed gives title + author without API key
  const res = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  if (!res.ok) return { title: "未知视频", author: "未知作者", thumbnailUrl: "" };
  const data = await res.json();
  return {
    title: data.title as string,
    author: data.author_name as string,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

async function getTranscript(videoId: string): Promise<string> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
    return segments.map((s) => s.text).join(" ").slice(0, 12000); // cap at ~3k tokens
  } catch {
    try {
      // fallback: try without lang
      const segments = await YoutubeTranscript.fetchTranscript(videoId);
      return segments.map((s) => s.text).join(" ").slice(0, 12000);
    } catch {
      return "";
    }
  }
}

const SYSTEM_PROMPT = `你是一位专业的英文科技内容分析师，擅长将英文 YouTube 视频内容精炼成结构化的中文学习笔记。
你的输出必须是严格的 JSON，不要有任何 markdown 代码块包裹，不要有任何额外文字。`;

const USER_PROMPT = (title: string, author: string, transcript: string) => `
分析以下 YouTube 视频，输出结构化 JSON。

视频标题: ${title}
作者: ${author}
字幕内容（可能不完整）:
${transcript || "（无字幕，请根据视频标题和作者进行推断）"}

请输出以下 JSON 结构（所有字段必须填写，不可为空数组）：
{
  "cn": {
    "overview": "2-3句话的中文概述，说明视频核心内容",
    "timeline": [
      { "time": "00:00", "text": "中文说明该段内容" }
    ],
    "keyConcepts": [
      { "title": "核心概念名", "desc": "一句话解释" }
    ],
    "summaryBullets": ["要点1", "要点2", "要点3"],
    "closing": "一段结语，指导观众下一步行动"
  },
  "pro": {
    "overview": {
      "en": "2-sentence English overview",
      "cn": "对应的中文翻译"
    },
    "timeline": [
      { "time": "00:00", "en": "English description", "cn": "中文说明" }
    ],
    "deepDive": [
      { "label": "主题标签", "text": "深度解析内容" }
    ],
    "coreTakeaways": [
      { "en": "Key insight in English", "cn": "中文对照" }
    ],
    "keywords": [
      { "word": "Term", "en": "English definition", "cn": "中文解释" }
    ],
    "phraseDrill": [
      { "en": "Notable English phrase from video", "cn": "中文翻译" }
    ],
    "reflection": {
      "questions": ["反思问题1", "反思问题2"],
      "finalNote": { "en": "Final insight in English", "cn": "中文结语" }
    }
  }
}`;

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "请提供 YouTube 链接" }, { status: 400 });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return NextResponse.json({ error: "无法识别 YouTube 链接，请检查格式" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "服务端未配置 OpenAI API Key" }, { status: 500 });
  }

  // Parallel: fetch meta + transcript
  const [meta, transcript] = await Promise.all([
    getYouTubeMeta(videoId),
    getTranscript(videoId),
  ]);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT(meta.title, meta.author, transcript) },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let analysis;
  try {
    analysis = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "AI 解析结果格式异常，请重试" }, { status: 500 });
  }

  return NextResponse.json({
    videoId,
    title: meta.title,
    author: meta.author,
    thumbnailUrl: meta.thumbnailUrl,
    hasTranscript: transcript.length > 0,
    analysis,
  });
}
