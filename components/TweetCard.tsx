'use client'
import React, { useState } from 'react'
import { Icons } from './Icons'
import type { XTweet } from '@/types'

export default function TweetCard({ data }: { data: XTweet }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
      <div className="flex items-start gap-3 mb-3">
        <img src={data.avatar} alt={data.author} className="w-9 h-9 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-800 truncate">{data.author}</span>
            <span className="text-[10px] text-slate-400 shrink-0">{data.date}</span>
          </div>
          <span className="text-xs text-slate-400">{data.handle}</span>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mb-2">{data.summary_cn}</p>
      <p className="text-xs text-slate-500 italic leading-relaxed mb-3">{data.summary_en}</p>

      {expanded && (
        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100 mb-3">
          <p className="text-xs text-slate-600 leading-relaxed">{data.original_text}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-[11px] text-slate-400 hover:text-indigo-600 transition flex items-center gap-1"
        >
          {expanded ? (
            <><Icons.ChevronUp className="w-3 h-3" /> 收起原文</>
          ) : (
            <><Icons.ChevronDown className="w-3 h-3" /> 展开原文</>
          )}
        </button>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
        >
          <Icons.XLogo className="w-3 h-3" /> 查看原推
        </a>
      </div>
    </div>
  )
}
