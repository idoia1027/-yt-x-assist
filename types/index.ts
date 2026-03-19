export interface VideoItem {
  id: number | string
  title: string
  author: string
  date?: string
  cover: string
  duration?: string
  videoId?: string
  url?: string
}

export interface XTweet {
  id: number
  author: string
  handle: string
  avatar: string
  date: string
  summary_cn: string
  summary_en: string
  original_text: string
  url: string
  has_image: boolean
}

export interface AnalysisResult {
  overview_cn: string
  overview_en: string
  timeline: Array<{ time: string; cn: string; en: string }>
  key_concepts: Array<{ title: string; desc: string }>
  core_takeaways: Array<{ en: string; cn: string }>
  keywords: Array<{ word: string; en: string; cn: string }>
  phrase_drill: Array<{ en: string; cn: string }>
  reflection_questions: string[]
  closing_note: string
}

export interface TranscriptResult {
  videoId: string
  title: string
  author: string
  thumbnail: string
  transcript: string
  hasTranscript: boolean
}
