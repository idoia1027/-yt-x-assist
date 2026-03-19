'use client'
import React, { useState } from 'react'
import { Icons } from './Icons'
import VideoCard from './VideoCard'
import TweetCard from './TweetCard'
import { SAMPLE_TWEETS, SAMPLE_SUBS, SAMPLE_DAILY_PICKS } from '@/lib/data'
import type { VideoItem } from '@/types'

interface HomePageProps {
  onVideoClick: (item: VideoItem) => void
  onAnalyzeClick: () => void
}

export default function HomePage({ onVideoClick, onAnalyzeClick }: HomePageProps) {
  const [showAllTweets, setShowAllTweets] = useState(false)
  const tweets = showAllTweets ? SAMPLE_TWEETS : SAMPLE_TWEETS.slice(0, 2)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 fade-in">
      {/* Hero CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 md:p-8 mb-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white" />
          <div className="absolute -bottom-4 right-24 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold mb-1">粘贴 YouTube 链接，秒获中文精读</h2>
            <p className="text-indigo-200 text-sm">AI 自动提炼核心观点 · 中英双语 · 词汇 + 句型练习</p>
          </div>
          <button
            onClick={onAnalyzeClick}
            className="shrink-0 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-900/20"
          >
            <Icons.Sparkles className="w-4 h-4" />
            立即分析视频
          </button>
        </div>
      </div>

      {/* Subscriptions + X Tweets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icons.Bell className="w-4 h-4" /> 订阅更新
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {SAMPLE_SUBS.length} 个新视频
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SAMPLE_SUBS.map((item, i) => (
              <VideoCard key={item.id} item={item} onClick={onVideoClick} showNew={i === 0} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icons.XLogo className="w-4 h-4" /> 权威观点快讯
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">语义关联推荐</span>
          </div>
          <div className="space-y-4">
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-indigo-700">为什么看这些？</span>{' '}
                AI 已基于你关注的"LLM 进阶"主题，聚合了相关大佬的最新动态。
              </p>
            </div>
            {tweets.map((t) => <TweetCard key={t.id} data={t} />)}
          </div>
          <button
            onClick={() => setShowAllTweets(v => !v)}
            className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center justify-center gap-2 group"
          >
            {showAllTweets
              ? <>收起 <Icons.ChevronUp className="w-3 h-3" /></>
              : <>查看订阅用户近 7 天推文 <Icons.ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition" /></>
            }
          </button>
        </div>
      </div>

      {/* Daily Picks */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">今日精选 · 猜你喜欢</h3>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_DAILY_PICKS.map((item) => (
            <VideoCard key={item.id} item={item} onClick={onVideoClick} grayscale />
          ))}
        </div>
      </div>
    </div>
  )
}
