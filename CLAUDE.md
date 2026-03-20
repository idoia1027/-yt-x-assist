# YT × X Assist 项目上下文

## 基本信息
- 产品：YouTube & X 学习内容聚合工具，面向内测用户（insider）
- 部署：https://yt-x-assist.vercel.app
- 仓库：https://github.com/idoia1027/-yt-x-assist
- 与用户沟通语言：**中文**

## 技术栈
- Next.js 14 App Router + TypeScript + Tailwind CSS
- AI 分析：Gemini 2.5 Flash，通过 OpenAI 兼容接口调用
  - baseURL: `https://generativelanguage.googleapis.com/v1beta/openai/`
  - model: `models/gemini-2.5-flash`
  - 环境变量名沿用 `OPENAI_API_KEY`（实际存的是 Gemini key）
- 字幕获取：Supadata API（主力，绕过 Vercel IP 封锁）
- 数据存储：`data/analyses.json`（静态文件，随 git 部署）

## 关键架构决策
- **Vercel 的 Lambda 和 Edge Runtime IP 均被 YouTube 封锁**，所有直接爬取 YouTube 字幕的方式在 Vercel 上全部失效。解决方案是使用 Supadata API（`SUPADATA_API_KEY` 环境变量）
- `app/api/transcript/route.ts` 使用 Edge Runtime（`export const runtime = 'edge'`），Channel 顺序：Supadata → ANDROID client → page parse → youtube-transcript npm pkg
- `app/api/analyze/route.ts` 缓存机制：先查 `data/analyses.json`，命中直接返回，不重复调 Gemini

## 权限系统（lib/auth.ts）
- 三档：`owner` / `insider` / `guest`
- Token 硬编码在 `lib/auth.ts` 的 `TOKEN_MAP` 里（不走环境变量）
- owner token：`idoiawang1027`，insider token：`insider001` ~ `insider030`（每人每天 2 次）
- URL 带 `?token=xxx` 自动存入 localStorage

## 内容池（data/analyses.json）
- 当前 16 条视频，已有字段：`overview_cn/en`, `timeline`, `key_concepts`, `core_takeaways`, `keywords`, `phrase_drill`, `reflection_questions`, `closing_note`, `publishedAt`, `title`, `author`, `thumbnail`
- **不能在 Vercel 运行时写入**（生产环境文件系统只读），只能通过本地脚本或 GitHub Action 更新后 push

## 自动化内容更新
- `data/channels.json`：配置要追踪的 YouTube 频道列表
- `.github/workflows/daily-fetch.yml`：每天北京时间 10:00 自动触发
- `scripts/daily-fetch.mjs`：RSS 拉新视频 → Supadata 字幕 → Gemini 分析 → 写入 analyses.json → git push
- GitHub Secrets 需配置：`SUPADATA_API_KEY`、`OPENAI_API_KEY`

## 首页动态逻辑（app/page.tsx）
- 从 `/api/videos` 接口获取视频列表，按 `publishedAt` 倒排（最新在前）
- 上方"深度内容"模块：初始展示 4 条，加载更多每次 +4
- 下方"今日精选"模块：初始展示 3 条，加载更多每次 +3
- 加载前降级展示 `SAMPLE_HOME` 静态数据（不影响交互）

## 关键文件索引
- `app/page.tsx` — 整个前端（单文件，use client）
- `app/api/transcript/route.ts` — 字幕获取（Edge Runtime，Supadata 优先）
- `app/api/analyze/route.ts` — Gemini 分析 + 缓存
- `app/api/videos/route.ts` — 返回按时间排序的视频列表
- `lib/auth.ts` — 权限系统（TOKEN_MAP 硬编码）
- `data/analyses.json` — 内容池（含 publishedAt/title/author/thumbnail）
- `data/channels.json` — 自动追踪的频道配置
- `scripts/daily-fetch.mjs` — 本地/CI 批量分析脚本

## 开发约束
- **改动要外科手术式**，不动无关功能
- X 推文模块、定制硅谷雷达、Profile 页面标注为"开发中"，暂不开发
- 已标注"开发中"的功能不要误改
- 新功能开发前先评估方案，确认后再执行

## 待办
- X 推文模块（待规划）
- 频道列表按需扩充（当前只有 Y Combinator）
