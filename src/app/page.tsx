"use client";
import { useState } from "react";

// ============ ICONS ============
const Icons = {
  Play: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  PlayOutline: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  Search: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  XLogo: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  ChevronDown: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9" /></svg>,
  ChevronUp: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="18 15 12 9 6 15" /></svg>,
  Translate: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>,
  Book: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Check: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>,
  Close: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Share: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
  Quote: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H17.017V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 7.55228 5.0166 7V3H10.0166C11.6735 3 13.0166 4.34315 13.0166 6V15C13.0166 16.6569 11.6735 18 10.0166 18H8.0166V21H5.0166Z" /></svg>,
  User: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  History: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/></svg>,
  Bell: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Plus: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  PenTool: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  Loader: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>,
  AlertCircle: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
};

// ============ TYPES ============
interface VideoMeta {
  videoId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  hasTranscript: boolean;
  analysis: AnalysisResult;
}

interface AnalysisResult {
  cn: {
    overview: string;
    timeline: { time: string; text: string }[];
    keyConcepts: { title: string; desc: string }[];
    summaryBullets: string[];
    closing: string;
  };
  pro: {
    overview: { en: string; cn: string };
    timeline: { time: string; en: string; cn: string }[];
    deepDive: { label: string; text: string }[];
    coreTakeaways: { en: string; cn: string }[];
    keywords: { word: string; en: string; cn: string }[];
    phraseDrill: { en: string; cn: string }[];
    reflection: {
      questions: string[];
      finalNote: { en: string; cn: string };
    };
  };
}

// ============ STATIC DEMO DATA ============
const SAMPLE_X_UPDATES = [
  { id: 301, author: "Andrej Karpathy", handle: "@karpathy", avatar: "https://picsum.photos/seed/karpathy/80/80", date: "Dec 8", summary_cn: '不要把 LLM 视为实体，应视为"模拟器"。问"如果是某类人会怎么说"比问"你怎么看"更有效。', summary_en: "Don't treat LLMs as entities but as simulators.", original_text: "Don't think of LLMs as entities but as simulators. For example, when exploring a topic, don't ask 'What do you think about xyz?' There is no 'you'. Next time try: 'What would be a good group of people to explore xyz? What would they say?'", url: "https://x.com/karpathy" },
  { id: 302, author: "Yann LeCun", handle: "@ylecun", avatar: "https://picsum.photos/seed/ylecun/80/80", date: "2h ago", summary_cn: '生成式 AI 需向"世界模型"进化。目前 LLM 仅预测下一个 Token，缺乏对物理因果的理解。', summary_en: "Generative AI needs to evolve into World Models.", original_text: "Auto-Regressive LLMs are cool but they are not the destination. To reach human-level AI, we need systems that can reason, plan, and understand the physical world through World Models.", url: "https://x.com/ylecun" },
];

const SAMPLE_VIDEOS = [
  { id: 101, title: "AI Prompt Engineering in 2025", author: "Sander Schulhoff", date: "新发布", cover: "https://picsum.photos/seed/ai2025/600/400", duration: "1:32:15", videoId: "dOxUroR57xs" },
  { id: 102, title: "Next.js 14 Full Course 2025", author: "Web Dev Simplified", date: "5 小时前", cover: "https://picsum.photos/seed/next14/600/400", duration: "45:00", videoId: "" },
  { id: 103, title: "Understanding Quantum Computing", author: "Veritasium", date: "1 天前", cover: "https://picsum.photos/seed/quantum/600/400", duration: "18:20", videoId: "" },
  { id: 104, title: "Figma to Code Workflow", author: "DesignCourse", date: "2 天前", cover: "https://picsum.photos/seed/figma/600/400", duration: "24:10", videoId: "" },
];

const DAILY_PICKS = [
  { id: 201, title: "How the Economic Machine Works", author: "Ray Dalio", cover: "https://picsum.photos/seed/finance/600/400", videoId: "PHe0bXAIuk0" },
  { id: 202, title: "Visualizing Neural Networks", author: "3Blue1Brown", cover: "https://picsum.photos/seed/nn/600/400", videoId: "" },
  { id: 203, title: "The Future of AI Agents", author: "Lex Fridman", cover: "https://picsum.photos/seed/agent/600/400", videoId: "" },
];

// ============ TWEET CARD ============
function TweetCard({ data }: { data: typeof SAMPLE_X_UPDATES[0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-4 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition pointer-events-none">
        <Icons.XLogo className="w-16 h-16" />
      </div>
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-3">
          <img src={data.avatar} alt={data.author} className="w-9 h-9 rounded-full border border-slate-100" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{data.author}</h4>
            <span className="text-[10px] text-slate-400">{data.handle} · {data.date}</span>
          </div>
        </div>
        <a href={data.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-black transition">
          <Icons.XLogo className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="bg-slate-50/80 rounded-lg p-3 mb-3 border border-slate-100 z-10">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5 block">核心观点精炼</span>
        <p className="text-sm text-slate-700 font-medium leading-relaxed">{data.summary_cn}</p>
        {expanded && (
          <div className="pt-2 mt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block">Original</span>
            <p className="text-xs text-slate-500 leading-relaxed">{data.original_text}</p>
          </div>
        )}
      </div>
      <div className="z-10 mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
        <button onClick={() => setExpanded(v => !v)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition">
          {expanded ? <>收起 <Icons.ChevronUp className="w-3 h-3" /></> : <>展开原文 <Icons.ChevronDown className="w-3 h-3" /></>}
        </button>
      </div>
    </div>
  );
}

// ============ HEADER ============
function Header({ onViewChange }: { onViewChange: (v: string) => void }) {
  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-800 cursor-pointer group" onClick={() => onViewChange("home")}>
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition">
          <Icons.Play className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden md:inline">YouTube & X <span className="text-indigo-600">Assist</span></span>
        <span className="font-bold text-xl tracking-tight md:hidden">YT & X <span className="text-indigo-600">Assist</span></span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 hidden md:block">如何定制信息源？</button>
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer overflow-hidden border border-slate-200" onClick={() => onViewChange("profile")}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </div>
    </nav>
  );
}

// ============ DETAIL PAGE ============
function DetailPage({ video, onBack }: { video: VideoMeta; onBack: () => void }) {
  const [tab, setTab] = useState<"cn" | "pro">("cn");
  const [notionStatus, setNotionStatus] = useState<"idle" | "loading" | "success">("idle");
  const pro = video.analysis.pro;
  const cn = video.analysis.cn;

  const handleExportNotion = () => {
    if (notionStatus === "loading") return;
    setNotionStatus("loading");
    const md = `# ${video.title}\n*Author: ${video.author}*\n\n## 概述\n${cn.overview}\n\n## 核心要点\n${cn.summaryBullets.map(b => `- ${b}`).join("\n")}\n\n## 结语\n${cn.closing}`.trim();
    setTimeout(() => {
      navigator.clipboard.writeText(md).then(() => {
        setNotionStatus("success");
        setTimeout(() => setNotionStatus("idle"), 3000);
        alert("✅ 笔记已复制到剪贴板！\n请在 Notion 中使用 /markdown 块粘贴。");
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 fade-in">
      <Header onViewChange={onBack} />
      <main className="flex-1 max-w-6xl mx-auto px-4 pt-10 pb-12 w-full">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600">
            <span className="inline-block rotate-180"><Icons.ChevronDown className="w-4 h-4" /></span>返回首页
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleExportNotion} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold shadow-sm border transition-all ${notionStatus === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
              {notionStatus === "loading" ? <><div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /><span>同步中...</span></> : notionStatus === "success" ? <><Icons.Check className="w-4 h-4" /><span>已复制 Markdown</span></> : <><span>📋</span><span>导出到 Notion</span></>}
            </button>
          </div>
        </div>

        {/* Video hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-slate-900 relative">
              <img src={video.thumbnailUrl} className="w-full h-full object-cover opacity-80" alt={video.title} />
              <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition">
                  <Icons.Play className="w-7 h-7 text-white" />
                </div>
              </a>
            </div>
            <div className="p-6">
              <h1 className="text-xl font-bold text-slate-900 mb-2">{video.title}</h1>
              <p className="text-sm text-slate-500 mb-4">{video.author}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded"><Icons.Translate className="w-3 h-3" /> 双语对照</span>
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded"><Icons.Book className="w-3 h-3" /> 学习模式</span>
                {!video.hasTranscript && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded">⚠️ 基于标题推断</span>}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">学习建议</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex gap-2"><span className="text-indigo-600 font-bold">1.</span><span>没时间看完全片？先看「中文简版」快速获取核心结论。</span></li>
                <li className="flex gap-2"><span className="text-indigo-600 font-bold">2.</span><span>想提升专业英语？使用「中英加强版」对照原文关键词和句型。</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-200 p-1 rounded-lg flex font-medium text-sm mb-6 w-full md:w-96">
          <button onClick={() => setTab("cn")} className={`flex-1 py-2 rounded-md transition-all ${tab === "cn" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>中文简版 · 快速扫一遍</button>
          <button onClick={() => setTab("pro")} className={`flex-1 py-2 rounded-md transition-all ${tab === "pro" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>中英加强版 · 进阶学习</button>
        </div>

        {/* CN Tab */}
        {tab === "cn" && (
          <div className="space-y-6 fade-in">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-2 text-sm">📌 一句话概述</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{cn.overview}</p>
            </section>
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm">⏱ 时间线摘要</h3></div>
              <div className="divide-y divide-slate-50">
                {cn.timeline.map((seg, i) => (
                  <div key={i} className="p-4 pl-6 flex gap-4 hover:bg-slate-50 transition">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded mt-0.5 shrink-0">{seg.time}</span>
                    <p className="text-sm text-slate-600">{seg.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cn.keyConcepts.map((c, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h4 className="font-bold text-indigo-700 text-sm mb-1">{c.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </section>
            <section className="bg-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20" />
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-4">✅ 核心要点</h3>
                <ul className="space-y-3">
                  {cn.summaryBullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-100 leading-relaxed">
                      <span className="text-indigo-300 font-bold shrink-0">{i + 1}.</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <h3 className="font-bold text-indigo-800 text-sm mb-2">🎯 行动建议</h3>
              <p className="text-sm text-indigo-700 leading-relaxed">{cn.closing}</p>
            </section>
          </div>
        )}

        {/* PRO Tab */}
        {tab === "pro" && (
          <div className="space-y-6 fade-in">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-2">Overview · 整体概要</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-1">{pro.overview.en}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{pro.overview.cn}</p>
            </section>
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm">Timeline Summary</h3></div>
              <div className="divide-y divide-slate-50">
                {pro.timeline.map((seg, i) => (
                  <div key={i} className="p-4 pl-6 flex gap-4 hover:bg-slate-50 transition">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded mt-0.5 shrink-0">{seg.time}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-0.5">{seg.en}</h4>
                      <p className="text-xs text-slate-500">{seg.cn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20" />
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-4">Deep Dive · 深度拆解</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pro.deepDive.map((p, i) => (
                    <div key={i} className="bg-white/10 border border-white/10 rounded-lg p-3 hover:bg-white/15 transition">
                      <div className="text-xs font-bold text-indigo-200 mb-1">{p.label}</div>
                      <div className="text-xs text-slate-100 leading-relaxed">{p.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Core Takeaways · 核心要点</h3>
                <div className="space-y-3">
                  {pro.coreTakeaways.map((item, i) => (
                    <div key={i} className="border border-slate-100 rounded-lg p-3">
                      <p className="text-slate-900 text-sm font-semibold mb-1">{item.en}</p>
                      <p className="text-xs text-slate-500">{item.cn}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Keywords & Usage · 关键术语</h3>
                <div className="space-y-3">
                  {pro.keywords.map((kw, i) => (
                    <div key={i} className="border border-slate-100 rounded-lg p-3">
                      <span className="text-sm font-bold text-indigo-700">{kw.word}</span>
                      <p className="text-xs text-slate-500 mt-1">{kw.en}</p>
                      <p className="text-xs text-slate-600">{kw.cn}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Phrase Drill · 句型跟读</h3>
                <div className="space-y-3">
                  {pro.phraseDrill.map((p, i) => (
                    <div key={i} className="border border-slate-100 rounded-lg p-3">
                      <p className="text-xs font-medium text-slate-700 mb-1">"{p.en}"</p>
                      <p className="text-xs text-slate-500">{p.cn}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Reflection · 反思</h3>
                <ul className="space-y-2 mb-4">
                  {pro.reflection.questions.map((q, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-indigo-600 font-bold shrink-0">Q{i + 1}.</span>{q}</li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Final Note</p>
                  <p className="text-xs text-slate-500 italic mb-1">"{pro.reflection.finalNote.en}"</p>
                  <p className="text-xs text-slate-600">{pro.reflection.finalNote.cn}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <footer className="py-4 px-4 border-t border-slate-200 bg-white mt-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-500">YouTube & X Assist · 硅谷 AI 一手资讯助手</p>
        </div>
      </footer>
    </div>
  );
}

// ============ LOADING STATE ============
function AnalyzingState({ url }: { url: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 fade-in">
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
        <Icons.Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">AI 正在深度解析视频</h2>
        <p className="text-sm text-slate-500 max-w-md">正在获取字幕、提炼要点、生成双语笔记...</p>
        <p className="text-xs text-slate-400 mt-2 font-mono truncate max-w-xs">{url}</p>
      </div>
      <div className="flex gap-2">
        {["获取视频信息", "提取字幕", "AI 深度分析", "生成笔记"].map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            <span className="text-[10px] text-slate-400">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ HOME PAGE ============
function HomePage({
  onVideoAnalyzed,
}: {
  onVideoAnalyzed: (video: VideoMeta) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState("");
  const [showAllTweets, setShowAllTweets] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) { setError("请先粘贴 YouTube 链接"); return; }
    setError("");
    setLoading(true);
    setLoadingUrl(url);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "分析失败，请重试"); setLoading(false); return; }
      onVideoAnalyzed(data);
    } catch {
      setError("网络错误，请检查连接后重试");
      setLoading(false);
    }
  };

  if (loading) return <AnalyzingState url={loadingUrl} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onViewChange={() => {}} />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-200 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AI 实时解析 · 中英双语
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              硅谷 AI 内容<br />
              <span className="text-indigo-400">一键精读</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              粘贴任意 YouTube 链接，AI 立即生成中文解读、时间线摘要、英语学习笔记
            </p>
            <div className="flex gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                placeholder="粘贴 YouTube 链接，例如 https://youtube.com/watch?v=..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-sm transition"
              />
              <button
                onClick={handleAnalyze}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/30 transition hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                开始解析
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 justify-center mt-3 text-red-300 text-sm">
                <Icons.AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          {/* Subscription updates + tweets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Left: Videos */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">订阅更新</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">点击解析</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {SAMPLE_VIDEOS.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => item.videoId && (setUrl(`https://youtube.com/watch?v=${item.videoId}`), setTimeout(handleAnalyze, 50))}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer group flex flex-col overflow-hidden"
                  >
                    <div className="aspect-video relative bg-slate-100">
                      <img src={item.cover} className="w-full h-full object-cover" alt={item.title} />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">{item.duration}</span>
                      {i === 0 && <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">NEW</div>}
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.author}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                        <Icons.PlayOutline className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: X tweets */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Icons.XLogo className="w-4 h-4" /> 权威观点快讯
                </h3>
              </div>
              <div className="space-y-4">
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-indigo-700">为什么看这些？</span> AI 已聚合了相关大佬的最新推文，长短结合，信息才完整。
                  </p>
                </div>
                {(showAllTweets ? SAMPLE_X_UPDATES : SAMPLE_X_UPDATES.slice(0, 2)).map(t => (
                  <TweetCard key={t.id} data={t} />
                ))}
              </div>
              <button
                onClick={() => setShowAllTweets(v => !v)}
                className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
              >
                {showAllTweets ? <>收起 <Icons.ChevronUp className="w-3 h-3" /></> : <>查看更多推文 <Icons.ChevronDown className="w-3 h-3" /></>}
              </button>
            </div>
          </div>

          {/* Daily picks */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">今日精选 · 猜你喜欢</h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DAILY_PICKS.map(item => (
                <div
                  key={item.id}
                  onClick={() => { if (item.videoId) { setUrl(`https://youtube.com/watch?v=${item.videoId}`); setTimeout(handleAnalyze, 50); } }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer group overflow-hidden flex items-center md:block"
                >
                  <div className="w-1/3 md:w-full md:aspect-video bg-slate-100 relative shrink-0 h-24 md:h-auto">
                    <img src={item.cover} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" alt={item.title} />
                  </div>
                  <div className="p-3 md:p-4">
                    <h4 className="font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 px-4 border-t border-slate-200 bg-white mt-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-500">YouTube & X Assist · 硅谷 AI 一手资讯助手</p>
        </div>
      </footer>
    </div>
  );
}

// ============ APP ROOT ============
export default function App() {
  const [view, setView] = useState<"home" | "detail">("home");
  const [currentVideo, setCurrentVideo] = useState<VideoMeta | null>(null);

  const handleVideoAnalyzed = (video: VideoMeta) => {
    setCurrentVideo(video);
    setView("detail");
  };

  if (view === "detail" && currentVideo) {
    return <DetailPage video={currentVideo} onBack={() => setView("home")} />;
  }

  return <HomePage onVideoAnalyzed={handleVideoAnalyzed} />;
}
