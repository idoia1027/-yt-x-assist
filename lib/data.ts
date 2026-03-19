import type { VideoItem, XTweet, AnalysisResult } from '@/types'

// ===== Mock 分析结果（跳过 API 调用用于本地预览） =====
export const MOCK_ANALYSIS: AnalysisResult = {
  overview_cn:
    "Andrej Karpathy 在本视频中系统讲解了大型语言模型（LLM）的完整训练流程，从原始互联网文本的预训练，到监督微调（SFT）、人类反馈强化学习（RLHF），再到最新的推理型模型（如 o1/o3）。视频以 GPT-4 为蓝本，深入拆解 Tokenizer、Transformer 结构与 Attention 机制，帮助观众建立对现代 AI 系统的完整认知。",
  overview_en:
    "Andrej Karpathy walks through the full lifecycle of large language models: pretraining on internet-scale text, supervised fine-tuning, reinforcement learning from human feedback (RLHF), and emerging reasoning models like o1/o3. Using GPT-4 as a reference, he unpacks tokenizers, transformer architecture, and attention mechanisms to give viewers a solid mental model of modern AI.",
  timeline: [
    { time: "0:00", cn: "开篇：什么是 LLM，为什么值得深度理解", en: "Intro: What are LLMs and why they matter" },
    { time: "12:30", cn: "Tokenizer 原理：文本如何变成数字序列", en: "Tokenizer deep dive: how text becomes token sequences" },
    { time: "38:00", cn: "Transformer 架构：Self-Attention 与多头注意力", en: "Transformer architecture: self-attention and multi-head attention" },
    { time: "1:15:00", cn: "预训练阶段：在万亿 Token 上学习「下一个词」", en: "Pretraining: learning next-token prediction at trillion-token scale" },
    { time: "2:00:00", cn: "监督微调（SFT）：让模型学会对话格式", en: "Supervised fine-tuning: teaching the model to follow instructions" },
    { time: "2:45:00", cn: "RLHF：用人类偏好信号对齐模型行为", en: "RLHF: aligning model behavior with human preference signals" },
    { time: "3:30:00", cn: "推理模型 o1/o3：让模型学会「慢思考」", en: "Reasoning models (o1/o3): training the model to think step-by-step" },
  ],
  key_concepts: [
    {
      title: "Tokenization（词元化）",
      desc: "LLM 不直接处理字符，而是将文本切分为 Token（子词单元）。Tokenizer 的设计直接影响模型对多语言、代码、数学的处理能力。",
    },
    {
      title: "Self-Attention（自注意力）",
      desc: "Transformer 的核心机制，让每个 Token 动态关注序列中其他 Token 的信息，从而捕捉长距离依赖关系。",
    },
    {
      title: "预训练 vs. 微调",
      desc: "预训练赋予模型广泛世界知识；微调（SFT + RLHF）将其塑造成有用、无害、诚实的助手。两个阶段缺一不可。",
    },
    {
      title: "RLHF（人类反馈强化学习）",
      desc: "通过训练奖励模型捕捉人类偏好，再用 PPO 等 RL 算法优化生成策略，使模型输出更符合人类期望。",
    },
    {
      title: "推理模型（Reasoning Models）",
      desc: "o1/o3 类模型在生成最终答案前会产生「思维链」（Chain-of-Thought），显著提升数学、编程等需要逐步推理的任务表现。",
    },
  ],
  core_takeaways: [
    {
      en: "LLMs are next-token predictors trained at massive scale — emergent capabilities arise from scale, not explicit programming.",
      cn: "LLM 本质是超大规模的「下一个 Token 预测器」，涌现能力来自规模，而非显式编程。",
    },
    {
      en: "The base model knows a lot; fine-tuning is about shaping behavior, not injecting knowledge.",
      cn: "基础模型已具备大量知识，微调是在塑造行为模式，而非注入新知识。",
    },
    {
      en: "Reasoning models trade inference-time compute for better accuracy by generating internal scratchpad thoughts.",
      cn: "推理模型用更多推理时算力换取更高精度，核心是生成内部「草稿思考」过程。",
    },
  ],
  keywords: [
    { word: "Tokenizer", en: "A module that converts raw text into integer token sequences for the model", cn: "分词器：将原始文本转换为整数 Token 序列的模块" },
    { word: "Transformer", en: "The dominant neural network architecture powering modern LLMs", cn: "Transformer：驱动现代 LLM 的主流神经网络架构" },
    { word: "RLHF", en: "Reinforcement Learning from Human Feedback — aligns model outputs with human preferences", cn: "人类反馈强化学习：用人类偏好信号对齐模型输出" },
    { word: "Chain-of-Thought", en: "A prompting / training technique that elicits step-by-step reasoning", cn: "思维链：引导模型逐步推理的提示/训练技巧" },
    { word: "Emergent ability", en: "Capabilities that appear unpredictably as model scale increases", cn: "涌现能力：随模型规模增大而突然出现的能力" },
  ],
  phrase_drill: [
    { en: "LLMs are best understood as simulators, not agents with fixed beliefs.", cn: "LLM 最好被理解为模拟器，而非持有固定信念的智能体。" },
    { en: "Scale is all you need — until it isn't.", cn: "规模就是一切——直到它不再是。" },
    { en: "The model doesn't know what it doesn't know.", cn: "模型不知道它不知道什么。" },
    { en: "Fine-tuning unlocks behavior; pretraining instills knowledge.", cn: "微调解锁行为模式；预训练灌注世界知识。" },
  ],
  reflection_questions: [
    "如果 LLM 只是在预测下一个 Token，它是否真的「理解」了语言？你怎么看？",
    "RLHF 依赖人类偏好标注，这会带来哪些偏见或局限性？",
    "推理模型的「思维链」和人类真正的推理过程有哪些本质区别？",
  ],
  closing_note:
    "尝试用本视频学到的视角重新审视你每天使用的 AI 工具：它正处于哪个训练阶段的产物？它的「错误」更像是预训练数据的问题，还是对齐失败？带着问题去用，收获会完全不同。",
}

// ===== X 推文数据 =====
export const SAMPLE_TWEETS: XTweet[] = [
  {
    id: 301,
    author: "Andrej Karpathy",
    handle: "@karpathy",
    avatar: "https://picsum.photos/seed/karpathy/80/80",
    date: "Dec 8",
    summary_cn: "不要把 LLM 视为实体，应视为模拟器。问「如果是某类人会怎么说」比问「你怎么看」更有效。",
    summary_en: "Don't treat LLMs as entities but as simulators. Ask 'What would [group] say?' instead of 'What do you think?'.",
    original_text: "Don't think of LLMs as entities but as simulators. When exploring a topic, try: 'What would be a good group of people to explore xyz? What would they say?'",
    url: "https://x.com/karpathy",
    has_image: false,
  },
  {
    id: 302,
    author: "Yann LeCun",
    handle: "@ylecun",
    avatar: "https://picsum.photos/seed/ylecun/80/80",
    date: "2h ago",
    summary_cn: "生成式 AI 需向世界模型进化。目前 LLM 仅预测下一个 Token，缺乏对物理因果的理解。",
    summary_en: "Generative AI needs to evolve into World Models. Current LLMs lack physical causality understanding.",
    original_text: "Auto-Regressive LLMs are cool but they are not the destination. To reach human-level AI, we need systems that can reason, plan, and understand the physical world through World Models.",
    url: "https://x.com/ylecun",
    has_image: false,
  },
  {
    id: 303,
    author: "Andrew Ng",
    handle: "@AndrewYNg",
    avatar: "https://picsum.photos/seed/andrewng/80/80",
    date: "5h ago",
    summary_cn: "执行速度是创业成功的最强预测因子。AI 编程助手让代码库成为可替换资产，软件工程从一锤定音变为可逆决策。",
    summary_en: "Execution speed is the strongest predictor of startup success. AI coding assistants turn codebases into disposable assets.",
    original_text: "The strongest predictor of startup success I've seen is speed of execution. With AI coding tools, rewriting an entire codebase is becoming a two-way door decision. Move fast and be responsible.",
    url: "https://x.com/AndrewYNg",
    has_image: false,
  },
]

// ===== 订阅更新（首页主区域，冷启动视频 1-4） =====
export const SAMPLE_SUBS: VideoItem[] = [
  {
    id: 'v-8fVHFt7Shf4',
    title: "Anthropic：用户为什么向 AI 寻求情感支持？",
    author: "Anthropic",
    date: "新发布",
    cover: "https://img.youtube.com/vi/8fVHFt7Shf4/maxresdefault.jpg",
    duration: "12:00",
    videoId: "8fVHFt7Shf4",
    url: "https://www.youtube.com/watch?v=8fVHFt7Shf4",
  },
  {
    id: 'v-6w0i2Wp0knM',
    title: "Gemini vs Claude vs GPT：谁才是 AI 设计之王？",
    author: "Claire Vo",
    date: "3 小时前",
    cover: "https://img.youtube.com/vi/6w0i2Wp0knM/maxresdefault.jpg",
    duration: "25:00",
    videoId: "6w0i2Wp0knM",
    url: "https://www.youtube.com/watch?v=6w0i2Wp0knM",
  },
  {
    id: 'v-7xTGNNLPyMI',
    title: "Deep Dive into LLMs like ChatGPT（Karpathy 4小时完整讲解）",
    author: "Andrej Karpathy",
    date: "1 天前",
    cover: "https://img.youtube.com/vi/7xTGNNLPyMI/maxresdefault.jpg",
    duration: "3:58:00",
    videoId: "7xTGNNLPyMI",
    url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
  },
  {
    id: 'v-RNJCfif1dPY',
    title: "Andrew Ng：AI 时代创业的第一法则是速度",
    author: "Andrew Ng",
    date: "2 天前",
    cover: "https://img.youtube.com/vi/RNJCfif1dPY/maxresdefault.jpg",
    duration: "43:00",
    videoId: "RNJCfif1dPY",
    url: "https://www.youtube.com/watch?v=RNJCfif1dPY",
  },
]

// ===== 今日精选（首页底部，冷启动视频 5-6 + 复用一个） =====
export const SAMPLE_DAILY_PICKS: VideoItem[] = [
  {
    id: 'v-jmHBMtpR36M',
    title: "Claude Code 产品负责人揭秘 AI 原生团队的工作方式",
    author: "Cat Wu · Anthropic",
    cover: "https://img.youtube.com/vi/jmHBMtpR36M/maxresdefault.jpg",
    videoId: "jmHBMtpR36M",
    url: "https://www.youtube.com/watch?v=jmHBMtpR36M",
  },
  {
    id: 'v-3x0jhpEj_6o',
    title: "OpenAI 内部视角：从单一神模型到千模型时代",
    author: "Sherman Woo · OpenAI",
    cover: "https://img.youtube.com/vi/3x0jhpEj_6o/maxresdefault.jpg",
    videoId: "3x0jhpEj_6o",
    url: "https://www.youtube.com/watch?v=3x0jhpEj_6o",
  },
  {
    id: 'v-7xTGNNLPyMI-pick',
    title: "Karpathy 讲 LLM：从预训练到强化学习全景",
    author: "Andrej Karpathy",
    cover: "https://img.youtube.com/vi/7xTGNNLPyMI/maxresdefault.jpg",
    videoId: "7xTGNNLPyMI",
    url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
  },
]

// ===== 个人中心 - 浏览历史 =====
export const SAMPLE_HISTORY: VideoItem[] = [
  {
    id: 'h-1',
    title: "Anthropic：用户为什么向 AI 寻求情感支持？",
    author: "Anthropic",
    date: "2小时前",
    cover: "https://img.youtube.com/vi/8fVHFt7Shf4/maxresdefault.jpg",
    videoId: "8fVHFt7Shf4",
    url: "https://www.youtube.com/watch?v=8fVHFt7Shf4",
  },
  {
    id: 'h-2',
    title: "Andrew Ng：AI 时代创业的第一法则是速度",
    author: "Andrew Ng",
    date: "昨天",
    cover: "https://img.youtube.com/vi/RNJCfif1dPY/maxresdefault.jpg",
    videoId: "RNJCfif1dPY",
    url: "https://www.youtube.com/watch?v=RNJCfif1dPY",
  },
  {
    id: 'h-3',
    title: "Gemini vs Claude vs GPT：谁才是 AI 设计之王？",
    author: "Claire Vo",
    date: "3天前",
    cover: "https://img.youtube.com/vi/6w0i2Wp0knM/maxresdefault.jpg",
    videoId: "6w0i2Wp0knM",
    url: "https://www.youtube.com/watch?v=6w0i2Wp0knM",
  },
]

// ===== 个人中心 - 默认订阅频道 =====
export const DEFAULT_SUBS = [
  { id: 101, name: "Anthropic", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anthropic", desc: "AI Safety & Claude" },
  { id: 102, name: "Andrej Karpathy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karpathy", desc: "Deep Learning & LLMs" },
  { id: 103, name: "Andrew Ng", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AndrewNg", desc: "AI Fund & Education" },
]

// ===== 推荐频道（个人中心 - 发现新博主） =====
export const RECOMMENDED_CHANNELS = [
  { id: 201, name: "Claire Vo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ClaireVo", desc: "AI Product & Design" },
  { id: 202, name: "OpenAI", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OpenAI", desc: "Official AI Updates" },
  { id: 203, name: "Lex Fridman", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lex", desc: "Deep Conversations" },
  { id: 204, name: "3Blue1Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3B1B", desc: "Math Visualization" },
]
