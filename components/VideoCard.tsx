'use client'
import React from 'react'
import { Icons } from './Icons'
import type { VideoItem } from '@/types'

interface VideoCardProps {
  item: VideoItem
  onClick: (item: VideoItem) => void
  showNew?: boolean
  grayscale?: boolean
}

export default function VideoCard({ item, onClick, showNew, grayscale }: VideoCardProps) {
  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer group flex flex-col overflow-hidden"
    >
      <div className="aspect-video relative bg-slate-100">
        <img
          src={item.cover}
          alt={item.title}
          className={`w-full h-full object-cover transition duration-500 ${grayscale ? 'grayscale group-hover:grayscale-0' : ''}`}
        />
        {item.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            {item.duration}
          </span>
        )}
        {showNew && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">
            NEW
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition text-sm">
            {item.title}
          </h4>
          <p className="text-xs text-slate-500">{item.author}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
          <span className="text-[10px] text-slate-400">{item.date}</span>
          <Icons.PlayOutline className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition" />
        </div>
      </div>
    </div>
  )
}
