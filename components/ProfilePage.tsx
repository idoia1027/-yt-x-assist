'use client'
import React, { useState } from 'react'
import { Icons } from './Icons'
import { SAMPLE_HISTORY, DEFAULT_SUBS, RECOMMENDED_CHANNELS } from '@/lib/data'
import type { VideoItem } from '@/types'

interface ProfilePageProps {
  onGoToDetail: (item: VideoItem) => void
}

export default function ProfilePage({ onGoToDetail }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'subs' | 'notes'>('history')
  const [mySubs, setMySubs] = useState(DEFAULT_SUBS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredChannels = RECOMMENDED_CHANNELS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 fade-in">
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">发现新博主</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
                <Icons.Close className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="relative mb-4">
                <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="搜索频道..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {filteredChannels.map(c => {
                  const subbed = mySubs.some(s => s.id === c.id)
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.desc}</p>
                      </div>
                      <button
                        onClick={() => subbed ? setMySubs(p => p.filter(s => s.id !== c.id)) : setMySubs(p => [...p, c])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${subbed ? 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        {subbed ? '已订阅' : '+ 订阅'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 mb-10 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0 border-2 border-white shadow-md overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Felix</h1>
          <p className="text-slate-500 text-sm mb-3">终身学习者 · 已坚持学习 12 天</p>
          <div className="flex gap-2">
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">PRO 会员</span>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">45 条笔记</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {([
          { id: 'history' as const, label: '学习记录', icon: Icons.History },
          { id: 'subs' as const, label: '我的订阅', icon: Icons.Bell },
          { id: 'notes' as const, label: '我的笔记', icon: Icons.PenTool },
        ]).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="min-h-[400px] slide-up">
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SAMPLE_HISTORY.map(item => (
              <div key={item.id} onClick={() => onGoToDetail(item)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden group">
                <div className="aspect-video bg-slate-100 relative">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                    <Icons.Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-indigo-600 transition">{item.title}</h4>
                  <div className="flex justify-between text-xs text-slate-500"><span>{item.author}</span><span>{item.date}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'subs' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">已订阅频道 ({mySubs.length})</h3>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                <Icons.Plus className="w-4 h-4" /> 发现新博主
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mySubs.map(sub => (
                <div key={sub.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <img src={sub.avatar} alt={sub.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{sub.name}</p>
                    <p className="text-xs text-slate-500">{sub.desc}</p>
                  </div>
                  <button onClick={() => setMySubs(p => p.filter(s => s.id !== sub.id))}
                    className="text-xs text-slate-400 hover:text-red-500 transition px-2 py-1 rounded hover:bg-red-50">取消</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">AI Prompt Engineering 笔记</h4>
                  <p className="text-xs text-slate-500">来自 · AI Prompt Engineering in 2025</p>
                </div>
                <span className="text-[10px] text-slate-400">2024/02/20</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                - Few-shot 真的很重要，尤其是处理复杂逻辑时。{'\n'}- Context! 永远不要忘记给背景。
              </p>
            </div>
            <div className="text-center py-8 text-slate-400 text-sm">
              <Icons.PenTool className="w-8 h-8 mx-auto mb-2 text-slate-200" />
              在视频详情页分析后即可保存笔记
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
