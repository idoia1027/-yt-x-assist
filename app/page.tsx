"use client";
import { useState, useEffect } from "react";
import { resolveRole, canAnalyze, incrementUsage, type UserRole } from "@/lib/auth";
import type { AnalysisResult } from "@/types";

// ============ MOCK FLAG ============
const USE_MOCK = true;

// ============ ICONS ============
const Icons = {
  Play: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  PlayOutline: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  Search: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  XLogo: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  ChevronDown: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9" /></svg>,
  ChevronUp: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="18 15 12 9 6 15" /></svg>,
  Radar: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Translate: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>,
  Book: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Check: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>,
  Close: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Share: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  Download: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Quote: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H17.017V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 7.55228 5.0166 7V3H10.0166C11.6735 3 13.0166 4.34315 13.0166 6V15C13.0166 16.6569 11.6735 18 10.0166 18H8.0166V21H5.0166Z" /></svg>,
  Notion: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4 4c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm3 3v10h2V7H7zm4 0v10h2V7h-2zm4 0v10h2V7h-2z" /></svg>,
  User: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  History: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /></svg>,
  Bell: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
  Plus: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  PenTool: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>,
  X: (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
};

// ============ TYPES ============
interface VideoItem {
  id?: number;
  videoId?: string;
  title: string;
  author: string;
  cover: string;
  duration?: string;
  date?: string;
}

// ============ DATA ============
const SAMPLE_HOME = {
  x_updates: [
    { id: 301, author: "Andrej Karpathy", handle: "@karpathy", avatar: "https://picsum.photos/seed/karpathy/80/80", date: "Dec 8", summary_cn: "不要把 LLM 视为实体，应视为「模拟器」。问「如果是某类人会怎么说」比问「你怎么看」更有效。", summary_en: "Don't treat LLMs as entities but as simulators. Ask 'What would [group] say?' instead of 'What do you think?'.", original_text: "Don't think of LLMs as entities but as simulators. For example, when exploring a topic, don't ask 'What do you think about xyz?' There is no 'you'. Next time try: 'What would be a good group of people to explore xyz? What would they say?'", url: "https://x.com/karpathy", has_image: false },
    { id: 302, author: "Yann LeCun", handle: "@ylecun", avatar: "https://picsum.photos/seed/ylecun/80/80", date: "2h ago", summary_cn: "生成式 AI 需向「世界模型」进化。目前 LLM 仅预测下一个 Token，缺乏对物理因果的理解。", summary_en: "Generative AI needs to evolve into World Models. Current LLMs lack physical causality understanding.", original_text: "Auto-Regressive LLMs are cool but they are not the destination. To reach human-level AI, we need systems that can reason, plan, and understand the physical world through World Models.", url: "https://x.com/ylecun", has_image: false },
  ],
  more_x_updates: [] as {id:number,author:string,handle:string,avatar:string,date:string,summary_cn:string,summary_en:string,original_text:string,url:string,has_image:boolean}[],
  subs_updates: [
    { id: 101, videoId: "_BRhRh7mOX0", title: "AI Prompt Engineering in 2025", author: "Sander Schulhoff", date: "新发布", cover: "https://img.youtube.com/vi/_BRhRh7mOX0/hqdefault.jpg", duration: "1:32:15" },
    { id: 102, videoId: "xXCBz_8hM9w", title: "How to Build the Future", author: "Sam Altman", date: "3 天前", cover: "https://img.youtube.com/vi/xXCBz_8hM9w/hqdefault.jpg", duration: "47:20" },
    { id: 103, videoId: "LCEmiRjPEtQ", title: "Software Is Changing Again", author: "Andrej Karpathy", date: "1 周前", cover: "https://img.youtube.com/vi/LCEmiRjPEtQ/hqdefault.jpg", duration: "28:10" },
    { id: 104, videoId: "n1E9IZfvGMA", title: "Machines of Loving Grace", author: "Dario Amodei", date: "2 周前", cover: "https://img.youtube.com/vi/n1E9IZfvGMA/hqdefault.jpg", duration: "35:45" },
  ],
  daily_picks: [
    { id: 201, videoId: "hmtuvNfytjM", title: "GPT-5 and the Path to Superintelligence", author: "Sam Altman", cover: "https://img.youtube.com/vi/hmtuvNfytjM/hqdefault.jpg" },
    { id: 202, videoId: "PQU9o_5rHC4", title: "Building Claude Code", author: "Boris Cherny", cover: "https://img.youtube.com/vi/PQU9o_5rHC4/hqdefault.jpg" },
    { id: 203, videoId: "RNJCfif1dPY", title: "Execution Speed Is the New Moat", author: "Andrew Ng", cover: "https://img.youtube.com/vi/RNJCfif1dPY/hqdefault.jpg" },
  ],
};

const SAMPLE_USER_DATA = {
  user: { name: "Felix", days: 12, notes_count: 45 },
  history: [
    { id: 1, title: "AI Prompt Engineering in 2025", author: "Sander Schulhoff", date: "2小时前", cover: "https://picsum.photos/seed/ai2025/600/400" },
    { id: 2, title: "Financial Markets 101", author: "Ray Dalio", date: "昨天", cover: "https://picsum.photos/seed/finance/600/400" },
    { id: 3, title: "Next.js Full Course", author: "Web Dev Simplified", date: "3天前", cover: "https://picsum.photos/seed/tech/600/400" },
  ],
  notes: [
    { id: 1, title: "AI Prompt Engineering 笔记", video: "AI Prompt Engineering in 2025", date: "2024/02/20", snippet: "- Few-shot 真的很重要，尤其是处理复杂逻辑时。\n- Context context context! 永远不要忘记给背景。" },
  ],
  default_subscriptions: [
    { id: 101, name: "Sander Schulhoff", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sander", desc: "AI Research & Prompting" },
    { id: 102, name: "Web Dev Simplified", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Web", desc: "Frontend Development" },
  ],
};

const RECOMMENDED_CHANNELS = [
  { id: 201, name: "Lex Fridman", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lex", desc: "Deep Conversations" },
  { id: 202, name: "MKBHD", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MKBHD", desc: "Tech Reviews" },
  { id: 203, name: "3Blue1Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3B1B", desc: "Math Visualization" },
  { id: 204, name: "OpenAI", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OpenAI", desc: "Official AI Updates" },
];

const SAMPLE_DETAIL_PRO = {
  overview: {
    en: 'This talk explains why prompt engineering is not dead but has evolved into "Artificial Social Intelligence" — a way of talking to models that makes their reasoning more reliable.',
    cn: "本次内容强调：提示工程并没有过时，而是进化成一种「人工社交智能」——通过更符合人际沟通的方式与模型对话，让输出更稳定、更可控。",
  },
  timeline: [
    { time: "00:00", en: "Why prompt engineering still matters in 2025", cn: "为什么在 2025 年提示工程依然重要" },
    { time: "06:24", en: "Artificial Social Intelligence as a new framing", cn: "将提示工程视为「人工社交智能」" },
    { time: "12:24", en: "Few-shot prompting and the power of examples", cn: "少样本提示：示例比规则更重要" },
    { time: "25:03", en: "Decomposition + self-critique as a pattern", cn: "任务拆解 + 自我校对的组合拳" },
  ],
  deepDive: [
    { label: "Few-shot · 什么时候用", text: "当任务规则难以精确描述（例如「这类表达是否自然」、风格模仿），或者零样本输出不稳定时，用少量高质量示例给模型「示范」正确答案。" },
    { label: "Few-shot · 怎么选例子", text: "优先选择边界案例和反例，而不是随手挑 10 个普通样本。3–5 个有代表性的例子往往比 10 个普通例子更有效。" },
    { label: "Few-shot · 如何组织格式", text: "用结构化包裹，例如 JSON / XML：包含 input、ideal_output 和可选 rationale 字段，既方便维护，又能触发更稳定的思维链。" },
  ],
  english: {
    coreTakeaways: [
      { en: "Prompt engineering is effectively Artificial Social Intelligence.", cn: "提示工程本质上是一种「人工社交智能」。" },
      { en: "Few-shot examples are the single most powerful lever for accuracy.", cn: "少样本示例是提升准确率的最强杠杆。" },
      { en: "You can patch a bug — not a brain.", cn: "你可以修补代码漏洞，但很难「修补」人的思维方式。" },
    ],
    keywords: [
      { word: "Few-shot prompting", en: "Teaching the model with a handful of input–output examples instead of pure instructions.", cn: "少样本提示：用少量示范样本而不是纯说明文字来教模型做事。" },
      { word: "Decomposition", en: "Breaking a complex task into smaller steps that are easier to solve.", cn: "任务分解：把复杂任务拆成更容易解决的小步骤。" },
      { word: "Self-critique", en: "Letting the model review and improve its own answer.", cn: "自我批评：让模型先给出答案，再自己做一次审稿和改写。" },
    ],
  },
  phraseDrill: [
    { en: "Treat the model like a collaborator, not a vending machine.", cn: "把模型当合作伙伴，而不是自动售货机。" },
    { en: "Show, don't just tell, through high-quality examples.", cn: "别只下指令，要用高质量示例「做给它看」。" },
  ],
  reflection: {
    questions: [
      "如果只保留 3 个 Few-shot 示例，你会选哪几个？为什么？",
      "你现在在用的提示里，有没有可以改写成「人工社交对话」的地方？",
    ],
    finalNote: {
      en: "The real leverage is not in writing clever prompts once, but in building a small, reusable library of examples that encode how you think.",
      cn: "真正的杠杆不在于偶尔写出一个绝妙提示词，而在于沉淀一小套可复用的示例库，把「你的思维方式」固化进去。",
    },
  },
};

const SAMPLE_DETAIL_CN = {
  overview: "这期内容围绕「提示工程是否过时」展开，从提问方式、示例设计到结构化输出，给出了一套在大模型时代依然有效的实用框架。看完后，你应该能改写自己常用的 2–3 条 Prompt，并开始沉淀一个小型示例库。",
  timeline: [
    { time: "00:00", text: "提出核心问题：大模型时代，提示工程是否已经过时？" },
    { time: "06:24", text: "给出新视角：提示工程 = 人工社交智能，关键在于「如何和模型说话」。" },
    { time: "12:24", text: "通过案例说明 Few-shot 为什么能显著提升复杂任务的稳定性和准确率。" },
    { time: "25:03", text: "总结一套通用框架：任务拆解 + 自我校对，作为日常写 Prompt 的基础套路。" },
  ],
  keyConcepts: [
    { title: "人工社交智能", desc: "与其说是在「写提示」，不如说是在练习如何与一个强大但有偏好的合作者对话。" },
    { title: "示例优先于规则", desc: "很多任务是「说不清但看得懂」的，用示范样本往往比罗列规则更有效。" },
    { title: "结构化输出", desc: "用 JSON / 列表等结构，既方便机器解析，也方便你后续复用和拼装。" },
  ],
  summaryBullets: [
    "提示工程没有消失，而是进化成一套「沟通范式」：你如何提问，决定了模型如何「思考」。",
    "少样本示例是当前大模型下最稳、最实用的性能放大器，适合复杂判断类任务。",
    "一套可复用的 Prompt + 示例库，是你个人工作流里的「生产力资产」，值得花时间打磨。",
  ],
  closing: "如果这期视频你只能带走一个改变：从今天开始，把你写得最满意的 3–5 个 Prompt 和对应示例单独存起来，作为个人 Prompt Library 的起点。后续所有复杂任务，先翻一翻这套库，再决定怎么问模型。",
};

// ============ SUBSCRIPTION MODAL ============
function SubscriptionModal({ isOpen, onClose, mySubs, onSubscribe }: {
  isOpen: boolean;
  onClose: () => void;
  mySubs: typeof SAMPLE_USER_DATA.default_subscriptions;
  onSubscribe: (c: typeof RECOMMENDED_CHANNELS[0]) => void;
}) {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;
  const filtered = RECOMMENDED_CHANNELS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">发现新博主</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"><Icons.X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 pb-0">
          <div className="relative">
            <div className="absolute left-3 top-3 text-slate-400"><Icons.Search className="w-5 h-5" /></div>
            <input type="text" placeholder="搜索频道名称..." className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="p-5 h-[300px] overflow-y-auto">
          <div className="space-y-3">
            {filtered.map(channel => {
              const isSubbed = mySubs.some(s => s.id === channel.id);
              return (
                <div key={channel.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <img src={channel.avatar} className="w-10 h-10 rounded-full" alt={channel.name} />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{channel.name}</h4>
                      <p className="text-xs text-slate-500">{channel.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => onSubscribe(channel)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${isSubbed ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-black text-white hover:bg-slate-800'}`} disabled={isSubbed}>
                    {isSubbed ? '已订阅' : '订阅'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ NOTES CARD ============
function NotesCard({ data }: { data: { title: string; author: string; duration?: string; cover: string; summary: string[] } }) {
  return (
    <div className="w-[375px] bg-white text-slate-900 shadow-2xl relative overflow-hidden flex flex-col font-sans" style={{ aspectRatio: '9/16' }}>
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-600 to-violet-700" />
      <div className="absolute top-0 left-0 right-0 h-48 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
      <div className="relative z-10 px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-4 opacity-90">
          <div className="bg-white/20 backdrop-blur rounded px-2 py-0.5 text-[10px] text-white font-bold tracking-wider">YOUTUBE & X ASSIST</div>
          <div className="bg-green-400/20 backdrop-blur rounded px-2 py-0.5 text-[10px] text-green-100 font-bold tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />AI GENERATED</div>
        </div>
        <h1 className="text-2xl font-black text-white leading-tight mb-2 line-clamp-2">{data.title}</h1>
        <p className="text-indigo-100 text-xs font-medium flex items-center gap-2"><span>{data.author}</span><span className="w-1 h-1 bg-indigo-300 rounded-full" /><span>原长 {data.duration}</span></p>
      </div>
      <div className="flex-1 bg-slate-50 rounded-t-3xl relative z-20 -mt-2 px-6 pt-6 pb-6 flex flex-col">
        <div className="relative h-40 rounded-xl overflow-hidden shadow-sm mb-6 shrink-0">
          <img src={data.cover} className="w-full h-full object-cover" alt={data.title} />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="w-10 h-10 bg-white/30 backdrop-blur rounded-full flex items-center justify-center"><Icons.Play className="w-4 h-4 text-white" /></div>
          </div>
        </div>
        <div className="space-y-4 mb-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">CORE INSIGHTS</h3>
          {data.summary.map((point, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xl font-black text-indigo-200 leading-none mt-0.5 select-none">{i + 1}</span>
              <p className="text-sm text-slate-700 font-medium leading-relaxed border-b border-slate-100 pb-2">{point}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div><p className="text-[10px] text-slate-400 mb-0.5">扫码获取</p><p className="text-xs font-bold text-slate-800">原视频 + 双语对照笔记</p></div>
          <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[8px] text-center leading-none">QR CODE</div>
        </div>
      </div>
    </div>
  );
}

// ============ QUOTE CARD ============
function QuoteCard({ data }: { data: { title: string; author: string; duration?: string; cover: string; quote: { en: string; cn: string } } }) {
  return (
    <div className="w-[375px] bg-slate-900 text-white shadow-2xl relative overflow-hidden flex flex-col font-sans" style={{ aspectRatio: '9/16' }}>
      <div className="absolute inset-0 z-0">
        <img src={data.cover} className="w-full h-full object-cover opacity-40 grayscale" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/30" />
      </div>
      <div className="relative z-10 flex-1 flex flex-col p-8">
        <div className="flex justify-between items-start mb-auto">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md"><Icons.Quote className="w-4 h-4 text-white/80" /></div>
          <span className="text-[10px] font-mono text-white/40 tracking-widest border border-white/10 px-2 py-1 rounded-full uppercase">AI Insight #042</span>
        </div>
        <div className="my-8">
          <p className="text-2xl font-bold leading-relaxed text-white/95 mb-6">&ldquo;{data.quote.en}&rdquo;</p>
          <div className="w-12 h-0.5 bg-indigo-500 mb-6" />
          <p className="text-lg text-slate-300 font-light leading-relaxed">{data.quote.cn}</p>
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">S</div>
            <div><p className="text-sm font-bold text-white">{data.author}</p><p className="text-xs text-slate-400">@ YouTube · {data.duration}</p></div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
            <div className="flex flex-col"><span className="text-[10px] text-indigo-300 uppercase font-bold">Generated by</span><span className="text-xs font-bold text-white">YouTube & X Assist</span></div>
            <div className="w-8 h-8 bg-white text-slate-900 rounded flex items-center justify-center text-[6px]">QR</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SHARE MODAL ============
function ShareModal({ onClose, data }: { onClose: () => void; data: { title: string; author: string; duration?: string; cover: string; summary: string[]; quote: { en: string; cn: string } } }) {
  const [cardType, setCardType] = useState<'notes' | 'quote'>('notes');
  const [isGenerating, setIsGenerating] = useState(true);
  useEffect(() => {
    setIsGenerating(true);
    const t = setTimeout(() => setIsGenerating(false), 800);
    return () => clearTimeout(t);
  }, [cardType]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in">
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-800">生成分享卡片</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition"><Icons.Close className="w-5 h-5 text-slate-500" /></button>
          </div>
          <div className="space-y-4 mb-auto">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">卡片风格</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setCardType('notes')} className={`p-3 rounded-xl border text-left transition flex flex-col gap-2 ${cardType === 'notes' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center"><Icons.Check className="w-4 h-4" /></div>
                  <span className={`text-sm font-bold ${cardType === 'notes' ? 'text-indigo-900' : 'text-slate-700'}`}>深度笔记卡</span>
                  <span className="text-[10px] text-slate-500">适合小红书/朋友圈</span>
                </button>
                <button onClick={() => setCardType('quote')} className={`p-3 rounded-xl border text-left transition flex flex-col gap-2 ${cardType === 'quote' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center"><Icons.Quote className="w-4 h-4" /></div>
                  <span className={`text-sm font-bold ${cardType === 'quote' ? 'text-indigo-900' : 'text-slate-700'}`}>金句海报卡</span>
                  <span className="text-[10px] text-slate-500">适合 Story/Twitter</span>
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-blue-800 mb-1">💡 Aha Moment</h4>
              <p className="text-xs text-blue-700 leading-relaxed">只需粘贴链接，AI 即刻将 1 小时的视频浓缩为一张图。分享它，展示你走在硅谷最前沿。</p>
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition active:scale-95">
            <Icons.Download className="w-5 h-5" />保存图片到相册
          </button>
        </div>
        <div className="flex-1 bg-slate-200/50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-sm font-bold text-slate-500 animate-pulse">正在提炼核心精华...</span>
            </div>
          ) : (
            <div className="scale-[0.8] md:scale-95 transition-all origin-center drop-shadow-2xl">
              {cardType === 'notes' ? <NotesCard data={data} /> : <QuoteCard data={data} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ PROFILE PAGE ============
function ProfilePage({ onGoToDetail, data, mySubs, onSubscribe, onUnsubscribe }: {
  onGoToDetail: (item: VideoItem) => void;
  data: typeof SAMPLE_USER_DATA;
  mySubs: typeof SAMPLE_USER_DATA.default_subscriptions;
  onSubscribe: (c: typeof RECOMMENDED_CHANNELS[0]) => void;
  onUnsubscribe: (id: number) => void;
}) {
  const [activeTab, setActiveTab] = useState('history');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 fade-in">
      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mySubs={mySubs} onSubscribe={onSubscribe} />
      <div className="flex items-center gap-6 mb-10 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0 border-2 border-white shadow-md overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">{data.user.name}</h1>
          <p className="text-slate-500 text-sm mb-3">终身学习者 • 已坚持学习 {data.user.days} 天</p>
          <div className="flex gap-2">
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">PRO 会员</span>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{data.user.notes_count} 条笔记</span>
          </div>
        </div>
      </div>
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {[{ id: 'history', label: '学习记录', icon: Icons.History }, { id: 'subs', label: '我的订阅', icon: Icons.Bell }, { id: 'notes', label: '我的笔记', icon: Icons.PenTool }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
        ))}
      </div>
      <div className="min-h-[400px] slide-up">
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.history.map(item => (
              <div key={item.id} onClick={() => onGoToDetail(item)} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden group">
                <div className="aspect-video bg-slate-100 relative">
                  <img src={item.cover} className="w-full h-full object-cover" alt={item.title} />
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
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full hover:bg-slate-800 transition shadow-lg shadow-slate-200"><Icons.Plus className="w-3 h-3" /> 添加订阅</button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {mySubs.map(sub => (
                <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <img src={sub.avatar} className="w-12 h-12 rounded-full border border-slate-100" alt={sub.name} />
                    <div><h4 className="font-bold text-slate-800">{sub.name}</h4><p className="text-xs text-slate-500">{sub.desc}</p></div>
                  </div>
                  <button onClick={() => onUnsubscribe(sub.id)} className="text-xs text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded transition flex items-center gap-1">退订</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {data.notes.map(note => (
              <div key={note.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition cursor-pointer" onClick={() => onGoToDetail({ title: note.video, author: "Unknown", cover: "https://picsum.photos/seed/ai2025/600/400" })}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{note.title}</h4>
                    <p className="text-xs text-indigo-600 flex items-center gap-1 mt-1"><Icons.Play className="w-3 h-3" /> 源视频: {note.video}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">{note.date}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 font-mono leading-relaxed">{note.snippet}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ TWEET CARD ============
function TweetCard({ data }: { data: typeof SAMPLE_HOME.x_updates[0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-4 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition pointer-events-none"><Icons.XLogo className="w-16 h-16" /></div>
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-3">
          <img src={data.avatar} alt={data.author} className="w-9 h-9 rounded-full border border-slate-100" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
              {data.author}
              <span className="text-blue-500"><svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 16.17 4.83 12 3.41 13.41 9 19l12-12-1.41-1.41z" /></svg></span>
            </h4>
            <span className="text-[10px] text-slate-400">{data.handle} · {data.date}</span>
          </div>
        </div>
        <a href={data.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-black transition"><Icons.XLogo className="w-3.5 h-3.5" /></a>
      </div>
      <div className="bg-slate-50/80 rounded-lg p-3 mb-3 border border-slate-100 z-10">
        <div className="mb-2">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5 block">核心观点精炼</span>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{data.summary_cn}</p>
        </div>
        {expanded && (
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block">Original Summary</span>
            <p className="text-xs text-slate-500 leading-relaxed">{data.summary_en}</p>
          </div>
        )}
      </div>
      {expanded && (
        <div className="mb-3"><p className="text-xs text-slate-600 font-mono bg-white p-3 rounded border border-slate-100 whitespace-pre-line mb-3">{data.original_text}</p></div>
      )}
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
      <div className="flex items-center gap-2 text-slate-800 cursor-pointer group" onClick={() => onViewChange('home')}>
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition"><Icons.Play className="w-5 h-5" /></div>
        <span className="font-bold text-xl tracking-tight hidden md:inline">YouTube & X <span className="text-indigo-600">Assist</span></span>
        <span className="font-bold text-xl tracking-tight md:hidden">YT & X <span className="text-indigo-600">Assist</span></span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 hidden md:block">如何定制信息源？</button>
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer overflow-hidden border border-slate-200" onClick={() => onViewChange('profile')}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </div>
    </nav>
  );
}

// ============ ANALYSIS MAPPERS ============
function mapToPro(a: AnalysisResult): typeof SAMPLE_DETAIL_PRO {
  return {
    overview: { en: a.overview_en, cn: a.overview_cn },
    timeline: a.timeline,
    deepDive: a.key_concepts.map(k => ({ label: k.title, text: k.desc })),
    english: {
      coreTakeaways: a.core_takeaways,
      keywords: a.keywords.map(k => ({ word: k.word, en: k.en, cn: k.cn })),
    },
    phraseDrill: a.phrase_drill,
    reflection: {
      questions: a.reflection_questions,
      finalNote: { en: a.overview_en, cn: a.closing_note },
    },
  };
}

function mapToCn(a: AnalysisResult): typeof SAMPLE_DETAIL_CN {
  return {
    overview: a.overview_cn,
    timeline: a.timeline.map(t => ({ time: t.time, text: t.cn })),
    keyConcepts: a.key_concepts,
    summaryBullets: a.core_takeaways.map(t => t.cn),
    closing: a.closing_note,
  };
}

// ============ APP ROOT ============
export default function App() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [showAllTweets, setShowAllTweets] = useState(false);
  const [view, setView] = useState("home");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [detailTab, setDetailTab] = useState("cn");
  const [showShareModal, setShowShareModal] = useState(false);
  const [notionStatus, setNotionStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mySubs, setMySubs] = useState(SAMPLE_USER_DATA.default_subscriptions);
  const [role, setRole] = useState<UserRole>({ role: 'guest', dailyLimit: 0, canViewPro: true, usedToday: 0 });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { setRole(resolveRole()); }, []);

  const handleSubscribe = (channel: typeof RECOMMENDED_CHANNELS[0]) => setMySubs([...mySubs, channel]);
  const handleUnsubscribe = (id: number) => setMySubs(mySubs.filter(s => s.id !== id));

  const handleVideoClick = (item: VideoItem) => {
    setSelectedVideo(item);
    setAnalysisResult(null);
    setDetailTab("cn");
    setView("detail");
    if (item.videoId) {
      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: item.videoId }),
      })
        .then(r => r.json())
        .then(data => { if (data.analysis) setAnalysisResult(data.analysis as AnalysisResult); })
        .catch(() => {});
    }
  };

  const handleSubmit = async () => {
    if (!canAnalyze(role)) {
      setError(role.role === 'guest' ? "需要内测邀请码才能使用解析功能" : "今日解析次数已用完，明天再来～");
      return;
    }
    if (!url.trim()) { setError("请粘贴一个 YouTube / X 链接"); return; }
    setError("");
    setIsAnalyzing(true);
    try {
      // Step 1: 拿字幕和视频信息
      const tRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const tData = await tRes.json();
      if (!tRes.ok) { setError(tData.error || "获取视频信息失败"); setIsAnalyzing(false); return; }

      // 先跳转到详情页（loading 状态）
      setSelectedVideo({ title: tData.title || url, author: tData.author || "", cover: tData.thumbnail || "https://picsum.photos/seed/temp/600/400", duration: "" });
      setAnalysisResult(null);
      setDetailTab("cn");
      setView("detail");

      // Step 2: 调 Gemini 分析
      const aRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: tData.videoId, title: tData.title, author: tData.author, transcript: tData.transcript }),
      });
      const aData = await aRes.json();
      if (!aRes.ok) { setError(aData.error || "分析失败"); }
      else {
        setAnalysisResult(aData.analysis);
        incrementUsage();
        setRole(resolveRole());
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportNotion = () => {
    if (notionStatus === 'loading') return;
    setNotionStatus('loading');
    const pro = SAMPLE_DETAIL_PRO;
    const md = `# ${selectedVideo?.title}\n*Author: ${selectedVideo?.author} | Duration: ${selectedVideo?.duration}*\n\n## Overview\n${pro.overview.cn}\n\n## Timeline\n${pro.timeline.map(t => `- **${t.time}**: ${t.cn}`).join('\n')}\n\n## Core Insights\n${pro.english.coreTakeaways.map(t => `- ${t.cn}`).join('\n')}\n\n## Reflection\n${pro.reflection.finalNote.cn}`.trim();
    setTimeout(() => {
      navigator.clipboard.writeText(md).then(() => {
        setNotionStatus('success');
        setTimeout(() => setNotionStatus('idle'), 3000);
        alert("✅ 笔记已同步！\n\n（演示模式：内容已转换为 Markdown 格式并复制到剪贴板，请直接在 Notion 中粘贴）");
      });
    }, 1500);
  };

  const getShareData = () => ({
    title: selectedVideo?.title ?? '',
    author: selectedVideo?.author ?? '',
    duration: selectedVideo?.duration,
    cover: selectedVideo?.cover ?? '',
    summary: SAMPLE_DETAIL_PRO.english.coreTakeaways.map(t => t.cn),
    quote: SAMPLE_DETAIL_PRO.reflection.finalNote,
  });

  const tweets = showAllTweets ? [...SAMPLE_HOME.x_updates, ...SAMPLE_HOME.more_x_updates] : SAMPLE_HOME.x_updates;

  // ==== 详情页 ====
  if (view === "detail" && selectedVideo) {
    const pro = analysisResult ? mapToPro(analysisResult) : SAMPLE_DETAIL_PRO;
    const cnSimple = analysisResult ? mapToCn(analysisResult) : SAMPLE_DETAIL_CN;
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 relative fade-in">
        <Header onViewChange={setView} />
        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} data={getShareData()} />}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 pt-10 pb-12">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setView("home")} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600">
                <span className="inline-block rotate-180"><Icons.ChevronDown className="w-4 h-4" /></span>返回首页
              </button>
              <div className="flex items-center gap-3">
                <button onClick={handleExportNotion} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold shadow-sm border transition-all ${notionStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                  {notionStatus === 'loading' ? <><div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /><span>同步中...</span></> : notionStatus === 'success' ? <><Icons.Check className="w-4 h-4" /><span>已保存到 Notion</span></> : <><Icons.Notion className="w-4 h-4" /><span>保存到 Notion</span></>}
                </button>
                <button onClick={() => setShowShareModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0">
                  <Icons.Share className="w-4 h-4" /><span>生成分享卡片</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="aspect-video bg-slate-900 relative">
                  <img src={selectedVideo.cover} className="w-full h-full object-cover opacity-80" alt={selectedVideo.title} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"><Icons.Play className="w-7 h-7 text-white" /></div>
                  </div>
                </div>
                <div className="p-6">
                  <h1 className="text-xl font-bold text-slate-900 mb-2">{selectedVideo.title}</h1>
                  <p className="text-sm text-slate-500 mb-2">{selectedVideo.author}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded"><Icons.Translate className="w-3 h-3" /> 双语对照可用</span>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded"><Icons.Book className="w-3 h-3" /> 学习模式</span>
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
                {!isAnalyzing && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 cursor-pointer hover:shadow-md transition group" onClick={() => setShowShareModal(true)}>
                  <div className="flex items-center gap-2 mb-1"><Icons.Quote className="w-4 h-4 text-indigo-600" /><span className="text-xs font-bold text-indigo-900">今日金句</span></div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-3 italic">&ldquo;{pro.reflection.finalNote.cn}&rdquo;</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 group-hover:underline">点击生成精美海报 <Icons.Share className="w-3 h-3" /></div>
                </div>
                )}
              </div>
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-100 rounded-full" />
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800 mb-2">AI 正在深度解析视频内容</p>
                  <p className="text-sm text-slate-500">正在获取字幕并调用 AI 分析，通常需要 15–30 秒</p>
                </div>
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: `${i * 0.15}s`}} />
                  ))}
                </div>
              </div>
            ) : (
            <>
            <div className="bg-slate-200 p-1 rounded-lg flex font-medium text-sm mb-6 w-full md:w-96">
              <button onClick={() => setDetailTab("cn")} className={`flex-1 py-2 rounded-md transition-all ${detailTab === "cn" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>中文简版 · 快速扫一遍</button>
              <button onClick={() => setDetailTab("pro")} className={`flex-1 py-2 rounded-md transition-all ${detailTab === "pro" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>中英加强版 · 进阶学习</button>
            </div>

            {detailTab === "pro" ? (
              <div className="space-y-6 fade-in">
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Overview · 整体内容概要</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-1">{pro.overview.en}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{pro.overview.cn}</p>
                </section>
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm">时间线摘要 · Timeline Summary</h3></div>
                  <div className="divide-y divide-slate-50">
                    {pro.timeline.map(seg => (
                      <div key={seg.time} className="p-4 pl-6 flex gap-4 hover:bg-slate-50 transition">
                        <div className="mt-1"><span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{seg.time}</span></div>
                        <div><h4 className="font-bold text-slate-800 text-sm mb-0.5">{seg.en}</h4><p className="text-xs text-slate-500">{seg.cn}</p></div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20" />
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-4">Deep Dive · Few-shot 实战拆解</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pro.deepDive.map(point => (
                        <div key={point.label} className="bg-white/10 border border-white/10 rounded-lg p-3 hover:bg-white/15 transition">
                          <div className="text-xs font-bold text-indigo-200 mb-1">{point.label}</div>
                          <div className="text-xs text-slate-100 leading-relaxed">{point.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Core Takeaways · 核心要点</h3>
                    <div className="space-y-3">
                      {pro.english.coreTakeaways.map((item, i) => (
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
                      {pro.english.keywords.map(kw => (
                        <div key={kw.word} className="border border-slate-100 rounded-lg p-3">
                          <span className="text-sm font-bold text-indigo-700">{kw.word}</span>
                          <p className="text-xs text-slate-500 mb-1">{kw.en}</p>
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
                          <p className="text-xs text-slate-500 mb-1">{p.en}</p>
                          <p className="text-xs text-slate-600">{p.cn}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-2">Reflection · 反思问题</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                        {pro.reflection.questions.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                    </div>
                    <div className="pt-2 text-xs text-slate-600">
                      <p className="font-semibold mb-1">Final Note · 结语</p>
                      <p className="mb-1">{pro.reflection.finalNote.en}</p>
                      <p>{pro.reflection.finalNote.cn}</p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-6 fade-in">
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">整体内容概要</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{cnSimple.overview}</p>
                </section>
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm">时间线概要（中文简版）</h3></div>
                  <div className="divide-y divide-slate-50">
                    {cnSimple.timeline.map(seg => (
                      <div key={seg.time} className="p-4 flex gap-3">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded h-fit">{seg.time}</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{seg.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-3">重点概念速览</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cnSimple.keyConcepts.map(k => (
                      <div key={k.title} className="border border-slate-100 rounded-lg p-3 bg-slate-50/60">
                        <p className="text-xs font-bold text-slate-800 mb-1">{k.title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{k.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-3">三句话总结</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 mb-4">
                    {cnSimple.summaryBullets.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-xs text-slate-700 leading-relaxed"><p>{cnSimple.closing}</p></div>
                </section>
              </div>
            )}
            </>
            )}
          </div>
        </main>
        <footer className="py-4 px-4 md:px-8 border-t border-slate-200 bg-white mt-4">
          <div className="max-w-7xl mx-auto text-center"><p className="text-sm text-slate-500">idoiawang</p></div>
        </footer>
      </div>
    );
  }

  // ==== 个人中心 ====
  if (view === "profile") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header onViewChange={setView} />
        <main className="flex-1 relative">
          <div className="opacity-30 pointer-events-none select-none">
            <ProfilePage data={SAMPLE_USER_DATA} mySubs={mySubs} onGoToDetail={handleVideoClick} onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white border border-slate-200 rounded-2xl px-8 py-6 text-center shadow-lg">
              <p className="text-lg font-bold text-slate-600 mb-1">开发中，敬请期待</p>
              <p className="text-sm text-slate-400">个人中心功能即将上线</p>
            </div>
          </div>
        </main>
        <footer className="py-4 px-4 md:px-8 border-t border-slate-200 bg-white mt-4">
          <div className="max-w-7xl mx-auto text-center"><p className="text-sm text-slate-500">idoiawang</p></div>
        </footer>
      </div>
    );
  }

  // ==== 首页 ====
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onViewChange={setView} />
      <main className="flex-1 fade-in">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-12">
          <div className="text-center mb-10 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              跟上一手硅谷 AI，<span className="text-indigo-600 relative inline-block">
                拒绝信息差
                <svg className="absolute w-full h-2 bottom-0 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
              </span>
            </h1>
            <p className="text-base text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto">
              没时间看长视频？不知道关注谁？我们为你自动追踪权威动态，提供<span className="font-bold text-slate-700">原文精炼与高质量翻译</span>，支持定制信息源，不仅是资讯工具<span className="font-bold text-slate-700">更是你的双语认知提升助手</span>。
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 text-left">
              {[
                { icon: Icons.Check, bg: "bg-indigo-50", hover: "group-hover:bg-indigo-600", text: "text-indigo-600", title: "权威自动追踪", desc: "自动抓取 Google, OpenAI 等源头信息，告别二手转述。" },
                { icon: Icons.Translate, bg: "bg-orange-50", hover: "group-hover:bg-orange-500", text: "text-orange-600", title: "原文精炼+翻译", desc: "AI 智能总结提炼，保障原意不失真，省时高效。" },
                { icon: Icons.Radar, bg: "bg-blue-50", hover: "group-hover:bg-blue-600", text: "text-blue-600", title: "定制硅谷雷达", desc: "支持指定单视频源和自定义关注博主，定制你的专属情报流，指哪打哪。" },
                { icon: Icons.Book, bg: "bg-emerald-50", hover: "group-hover:bg-emerald-600", text: "text-emerald-600", title: "双语对照学习", desc: "不仅是看新闻，更是专业术语与英语能力的同步进阶。" },
              ].map((f, i) => {
                const isComingSoon = f.title === "定制硅谷雷达";
                return (
                  <div key={i} className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition relative ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md group'}`}>
                    <div className={`w-8 h-8 rounded-lg ${f.bg} ${f.text} flex items-center justify-center mb-3 ${isComingSoon ? '' : `${f.hover} group-hover:text-white`} transition`}><f.icon className="w-5 h-5" /></div>
                    <div className="text-xs font-bold text-slate-800 mb-1">{f.title}</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{f.desc}</p>
                    {isComingSoon && <div className="absolute inset-0 flex items-end justify-center pb-3 rounded-xl"><span className="text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">开发中，敬请期待</span></div>}
                  </div>
                );
              })}
            </div>
            <div className="relative max-w-xl mx-auto group mb-2">
              <div className="absolute inset-0 bg-indigo-200 rounded-2xl blur opacity-20 group-hover:opacity-40 transition" />
              <div className={`relative bg-white p-1.5 rounded-2xl shadow-xl border flex items-center ${role.role === 'guest' ? 'border-slate-100 opacity-70' : 'border-slate-200'}`}>
                <div className="pl-3 text-slate-400"><Icons.Search className="w-5 h-5" /></div>
                <input
                  type="text"
                  placeholder={role.role === 'guest' ? "需要邀请码才能使用解析功能…" : "粘贴 YouTube / X 链接…"}
                  className="flex-1 p-3 outline-none text-slate-700 text-base placeholder:text-slate-300 bg-transparent"
                  value={url}
                  disabled={role.role === 'guest'}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                {role.role === 'guest' ? (
                  <button disabled className="bg-slate-200 text-slate-400 px-5 py-2.5 rounded-xl font-medium text-sm cursor-not-allowed">需要邀请码</button>
                ) : !canAnalyze(role) ? (
                  <button disabled className="bg-slate-200 text-slate-400 px-5 py-2.5 rounded-xl font-medium text-sm cursor-not-allowed">次数已用完</button>
                ) : (
                  <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-200 text-sm">开始</button>
                )}
              </div>
            </div>
            {role.role === 'insider' && (
              <div className="text-center text-[10px] text-slate-400 mt-1">
                今日已用 {role.usedToday}/{role.dailyLimit} 次解析
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <span>我的雷达:</span>
              <div className="flex gap-1">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">@AndrejKarpathy</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">#LLM Agents</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">#World Models</span>
                <span className="border border-dashed border-slate-300 px-1.5 py-0.5 rounded text-slate-400 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition flex items-center gap-0.5">+</span>
              </div>
            </div>
            {error && <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 mt-2 inline-block">{error}</span>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Icons.Play className="w-4 h-4 text-red-600" /> 深度内容 · 视频精读
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {SAMPLE_HOME.subs_updates.map((item, i) => (
                  <div key={item.id} onClick={() => handleVideoClick(item)} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer group flex flex-col overflow-hidden">
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

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Icons.XLogo className="w-4 h-4" /> 权威观点快讯</h3>
                <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">开发中，敬请期待</span>
              </div>
              <div className="relative">
                <div className="space-y-4 opacity-30 pointer-events-none select-none">
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3">
                    <p className="text-xs text-slate-700 text-left leading-relaxed"><span className="font-bold text-indigo-700">为什么看这些？</span> AI 已基于你关注的"LLM 进阶"主题，聚合了相关大佬的最新碎碎念。长短结合，信息才完整。</p>
                  </div>
                  {tweets.map(t => <TweetCard key={t.id} data={t} />)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm">
                    <p className="text-sm font-bold text-slate-500">开发中，敬请期待</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">今日精选 · 猜你喜欢</h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_HOME.daily_picks.map(item => (
                <div key={item.id} onClick={() => handleVideoClick(item)} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer group overflow-hidden flex items-center md:block">
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
      <footer className="py-4 px-4 md:px-8 border-t border-slate-200 bg-white mt-4">
        <div className="max-w-7xl mx-auto text-center"><p className="text-sm text-slate-500">idoiawang</p></div>
      </footer>
    </div>
  );
}
