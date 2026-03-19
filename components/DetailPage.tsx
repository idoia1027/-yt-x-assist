'use client'
import React, { useState, useEffect } from 'react'
import { Icons } from './Icons'
import { MOCK_ANALYSIS } from '@/lib/data'
import type { VideoItem, AnalysisResult } from '@/types'

const USE_MOCK = true

interface DetailPageProps {
  item: VideoItem | null
  onBack: () => void
}

type TabId = 'cn' | 'en' | 'drill'

export default function DetailPage({ item, onBack }: DetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('cn')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const [videoMeta, setVideoMeta] = useState<{ title: string; author: string; thumbnail: string; videoId: string } | null>(null)
  const [step, setStep] = useState<'idle' | 'fetching' | 'analyzing' | 'done'>('idle')

  // If item already has a videoId or URL, auto-analyze
  useEffect(() => {
    if (item?.url) {
      handleAnalyzeUrl(item.url)
    } else if (item?.videoId) {
      handleAnalyzeUrl(`https://www.youtube.com/watch?v=${item.videoId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  async function handleAnalyzeUrl(url: string) {
    setLoading(true)
    setError('')
    setAnalysis(null)
    setStep('fetching')

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800))
      setStep('analyzing')
      await new Promise(r => setTimeout(r, 600))
      setVideoMeta({
        title: item?.title || 'Mock Video Title',
        author: item?.author || 'Mock Author',
        thumbnail: item?.cover || `https://img.youtube.com/vi/${item?.videoId || 'dQw4w9WgXcQ'}/hqdefault.jpg`,
        videoId: item?.videoId || 'dQw4w9WgXcQ',
      })
      setAnalysis(MOCK_ANALYSIS)
      setStep('done')
      setLoading(false)
      return
    }

    try {
      // Step 1: fetch transcript
      const transcriptRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const transcriptData = await transcriptRes.json()
      if (!transcriptRes.ok) throw new Error(transcriptData.error || 'Failed to fetch transcript')

      setVideoMeta({
        title: transcriptData.title || item?.title || 'Unknown',
        author: transcriptData.author || item?.author || 'Unknown',
        thumbnail: transcriptData.thumbnail,
        videoId: transcriptData.videoId,
      })

      setStep('analyzing')

      // Step 2: AI analysis
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: transcriptData.title || item?.title,
          author: transcriptData.author || item?.author,
          transcript: transcriptData.transcript,
        }),
      })
      const analyzeData = await analyzeRes.json()
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Failed to analyze')

      setAnalysis(analyzeData.analysis)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmitUrl() {
    if (!inputUrl.trim()) return
    handleAnalyzeUrl(inputUrl.trim())
  }

  const displayTitle = videoMeta?.title || item?.title || '视频分析'
  const displayAuthor = videoMeta?.author || item?.author || ''
  const displayThumb = videoMeta?.thumbnail || item?.cover || ''

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-6 group"
      >
        <Icons.ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
        返回首页
      </button>

      {/* URL Input (if no item or to analyze a new one) */}
      {!item && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Icons.Sparkles className="w-5 h-5 text-indigo-500" />
            AI 视频精读
          </h2>
          <p className="text-sm text-slate-500 mb-4">粘贴任意 YouTube 链接，AI 自动生成中文解读</p>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Icons.Link className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitUrl()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSubmitUrl}
              disabled={loading || !inputUrl.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition active:scale-95 flex items-center gap-2"
            >
              <Icons.Sparkles className="w-4 h-4" />
              {loading ? '分析中...' : '开始分析'}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <div className="text-center">
            <p className="font-bold text-slate-700 mb-1">
              {step === 'fetching' ? '正在获取视频字幕...' : '正在 AI 精读分析...'}
            </p>
            <p className="text-sm text-slate-400">
              {step === 'fetching' ? '连接 YouTube 数据源' : '让 GPT-4o 为你提炼核心内容'}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            {(['fetching', 'analyzing', 'done'] as const).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === 'fetching' && i === 0 ? 'w-8 bg-indigo-500' :
                  step === 'analyzing' && i <= 1 ? 'w-8 bg-indigo-500' :
                  step === 'done' ? 'w-8 bg-indigo-500' :
                  'w-4 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
          <Icons.AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-700 mb-1">分析失败</p>
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-red-400 mt-2">常见原因：视频无字幕、地区限制、或 API 配置问题</p>
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {analysis && !loading && (
        <div className="slide-up">
          {/* Video Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="md:flex">
              <div className="md:w-72 shrink-0 bg-slate-100">
                <img
                  src={displayThumb}
                  alt={displayTitle}
                  className="w-full h-full object-cover aspect-video md:aspect-auto md:h-full"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{displayTitle}</h1>
                  <p className="text-sm text-slate-500 mb-4">{displayAuthor}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.overview_cn}</p>
                </div>
                {videoMeta?.videoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${videoMeta.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    <Icons.PlayOutline className="w-4 h-4" /> 在 YouTube 观看原视频
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
            {([
              { id: 'cn' as TabId, label: '中文精读', icon: Icons.Book },
              { id: 'en' as TabId, label: '英语学习', icon: Icons.Translate },
              { id: 'drill' as TabId, label: '句型练习', icon: Icons.PenTool },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab: Chinese Reading */}
          {activeTab === 'cn' && (
            <div className="space-y-6 slide-up">
              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">📍 内容导航</h3>
                <div className="space-y-3">
                  {analysis.timeline.map((t, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shrink-0 mt-0.5">
                        {t.time}
                      </span>
                      <div>
                        <p className="text-sm text-slate-700">{t.cn}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Concepts */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">💡 核心概念</h3>
                <div className="grid gap-3">
                  {analysis.key_concepts.map((c, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 mb-0.5">{c.title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reflection */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-4">🧠 思考一下</h3>
                <div className="space-y-3 mb-4">
                  {analysis.reflection_questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-indigo-400 font-bold text-sm shrink-0">Q{i + 1}.</span>
                      <p className="text-sm text-slate-700">{q}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-indigo-100">
                  <p className="text-xs font-bold text-indigo-600 mb-1">行动建议</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.closing_note}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: English Learning */}
          {activeTab === 'en' && (
            <div className="space-y-6 slide-up">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">🎯 核心洞察</h3>
                <div className="space-y-4">
                  {analysis.core_takeaways.map((t, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm font-medium text-slate-800 mb-1">{t.en}</p>
                      <p className="text-xs text-slate-500">{t.cn}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">📚 专业词汇</h3>
                <div className="space-y-3">
                  {analysis.keywords.map((kw, i) => (
                    <div key={i} className="flex gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                      <div className="shrink-0 pt-0.5">
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">
                          {kw.word}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-0.5">{kw.en}</p>
                        <p className="text-xs text-slate-400">{kw.cn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">🗣️ 英文概述</h3>
                <p className="text-sm leading-relaxed text-slate-200">{analysis.overview_en}</p>
              </div>
            </div>
          )}

          {/* Tab: Phrase Drill */}
          {activeTab === 'drill' && (
            <div className="space-y-4 slide-up">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
                💬 以下是视频中值得记忆的英文表达，尝试用自己的话重新组织一句话。
              </div>
              {analysis.phrase_drill.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-medium text-slate-800 mb-2 leading-relaxed">
                        &ldquo;{p.en}&rdquo;
                      </p>
                      <p className="text-sm text-slate-500">{p.cn}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state — item passed but waiting */}
      {!loading && !analysis && !error && item && (
        <div className="text-center py-16 text-slate-400">
          <Icons.Sparkles className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">正在准备分析...</p>
        </div>
      )}
    </div>
  )
}
