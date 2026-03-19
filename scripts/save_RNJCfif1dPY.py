import json

analysis = {
    "overview_cn": "\u5728\u65af\u5766\u798f\u521b\u4e1a\u5b66\u9662\u7684\u8fd9\u573a\u6f14\u8bb2\u4e2d\uff0cAI \u5148\u9a71\u5434\u6069\u8fbe\uff08Andrew Ng\uff09\u63a2\u8ba8\u4e86\u4e3a\u4ec0\u4e48\u6267\u884c\u901f\u5ea6\u662f\u521b\u4e1a\u6210\u529f\u7684\u7ec8\u6781\u9884\u6d4b\u6307\u6807\u3001\u5411\u667a\u80fd\u4f53 AI \u5de5\u4f5c\u6d41\u7684\u8f6c\u53d8\uff0c\u4ee5\u53ca AI \u5982\u4f55\u91cd\u5851\u5de5\u7a0b\u5e08\u548c\u4ea7\u54c1\u7ecf\u7406\u7684\u89d2\u8272\u3002",
    "overview_en": "In this Stanford Startup School lecture, AI pioneer Andrew Ng discusses why execution speed is the ultimate predictor of startup success, the shift toward agentic AI workflows, and how AI is transforming the roles of engineers and product managers.",
    "timeline": [
        {"time": "00:01:03", "en": "The AI Stack: Why the biggest opportunities are in the application layer", "cn": "AI \u6280\u672f\u6808\uff1a\u4e3a\u4ec0\u4e48\u6700\u5927\u7684\u673a\u4f1a\u5728\u5e94\u7528\u5c42"},
        {"time": "00:02:22", "en": "Agentic AI: Moving from zero-shot prompting to iterative workflows", "cn": "\u667a\u80fd\u4f53 AI\uff1a\u4ece\u96f6\u6837\u672c\u63d0\u793a\u8f6c\u5411\u8fed\u4ee3\u5de5\u4f5c\u6d41"},
        {"time": "00:04:53", "en": "Concrete Ideas vs. Vague Ideas: Why specificity buys you speed", "cn": "\u5177\u4f53\u60f3\u6cd5 vs. \u6a21\u7cca\u60f3\u6cd5\uff1a\u4e3a\u4ec0\u4e48\u660e\u786e\u6027\u53ef\u4ee5\u6362\u53d6\u901f\u5ea6"},
        {"time": "00:07:18", "en": "The Power of the 'Expert Gut' in rapid decision making", "cn": "\u4e13\u5bb6\u76f4\u89c9\u5728\u5feb\u901f\u51b3\u7b56\u4e2d\u7684\u5a01\u529b"},
        {"time": "00:09:57", "en": "Building Prototypes: 10x faster with AI coding assistants", "cn": "\u6784\u5efa\u539f\u578b\uff1a\u5229\u7528 AI \u7f16\u7a0b\u52a9\u624b\u5b9e\u73b0 10 \u500d\u589e\u901f"},
        {"time": "00:11:28", "en": "Move Fast and Be Responsible: The new engineering mantra", "cn": "\u5feb\u901f\u884c\u52a8\u4e14\u8d1f\u8d23\u4efb\uff1a\u65b0\u7684\u5de5\u7a0b\u51c6\u5219"},
        {"time": "00:13:26", "en": "One-Way vs. Two-Way Doors: Rethinking software architecture costs", "cn": "\u5355\u5411\u95e8 vs. \u53cc\u5411\u95e8\uff1a\u91cd\u65b0\u601d\u8003\u8f6f\u4ef6\u67b6\u6784\u6210\u672c"},
        {"time": "00:15:24", "en": "The Controversial Opinion: Everyone in every role should learn to code", "cn": "\u6709\u4e89\u8bae\u7684\u89c2\u70b9\uff1a\u6bcf\u4e2a\u804c\u4f4d\u7684\u6bcf\u4e2a\u4eba\u90fd\u5e94\u8be5\u5b66\u4e60\u7f16\u7a0b"},
        {"time": "00:17:23", "en": "The Shift in PM-to-Engineer Ratios: PMs as the new bottleneck", "cn": "PM \u4e0e\u5de5\u7a0b\u5e08\u6bd4\u4f8b\u7684\u8f6c\u53d8\uff1aPM \u6210\u4e3a\u65b0\u7684\u74f6\u9888"},
        {"time": "00:18:52", "en": "Product Feedback Portfolio: From expert gut to AB testing", "cn": "\u4ea7\u54c1\u53cd\u9988\u7ec4\u5408\uff1a\u4ece\u4e13\u5bb6\u76f4\u89c9\u5230 AB \u6d4b\u8bd5"},
        {"time": "00:23:00", "en": "The AI Building Blocks: Combinatorial innovation in AI startups", "cn": "AI \u79ef\u6728\uff1aAI \u521b\u4e1a\u4e2d\u7684\u7ec4\u5408\u5f0f\u521b\u65b0"},
        {"time": "00:28:12", "en": "Debunking Hype: Extinction risks and the 'Wiping Out Startups' narrative", "cn": "\u63ed\u7a7f\u7092\u4f5c\uff1a\u4eba\u7c7b\u706d\u7edd\u98ce\u9669\u4e0e\u201c\u6d88\u706d\u521b\u4e1a\u516c\u53f8\u201d\u7684\u53d9\u8ff0"}
    ],
    "key_concepts": [
        {"title": "Agentic AI Workflow / \u667a\u80fd\u4f53 AI \u5de5\u4f5c\u6d41", "desc": "\u5434\u6069\u8fbe\u5f3a\u8c03\uff0c\u4f20\u7edf\u7684 LLM \u4f7f\u7528\u65b9\u5f0f\uff08\u4e00\u6b21\u6027\u8f93\u51fa\uff09\u9650\u5236\u4e86\u6a21\u578b\u6f5c\u529b\u3002\u201c\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u201d\u6a21\u62df\u4eba\u7c7b\u7684\u5199\u4f5c\u8fc7\u7a0b\uff1a\u89c4\u5212\u3001\u641c\u7d22\u3001\u8349\u62df\u3001\u6279\u5224\u3001\u4fee\u8ba2\u3002\u8fd9\u79cd\u5faa\u73af\u867d\u7136\u901f\u5ea6\u8f83\u6162\uff0c\u4f46\u80fd\u663e\u8457\u63d0\u5347\u590d\u6742\u4efb\u52a1\u7684\u6210\u529f\u7387\u3002"},
        {"title": "The Application Layer Advantage / \u5e94\u7528\u5c42\u4f18\u52bf", "desc": "\u5c3d\u7ba1\u7b97\u529b\u548c\u57fa\u7840\u6a21\u578b\u516c\u53f8\u5438\u775b\u65e0\u6570\uff0c\u4f46\u5e94\u7528\u5c42\u5fc5\u987b\u4ea7\u751f\u8db3\u591f\u7684\u6536\u5165\u6765\u652f\u6491\u6574\u4e2a\u5e95\u5c42\u67b6\u6784\u3002\u5e94\u7528\u5c42\u62e5\u6709\u5927\u91cf\u201c\u7a7a\u767d\u5730\u5e26\u201d\uff0c\u521b\u4e1a\u8005\u53ef\u4ee5\u901a\u8fc7\u7ec4\u5408\u4e0d\u540c\u7684 AI \u79ef\u6728\u6784\u5efa\u72ec\u7279\u4ef7\u5024\u3002"},
        {"title": "One-Way vs. Two-Way Doors / \u51b3\u7b56\u7684\u5355\u53cc\u5411\u95e8", "desc": "\u7531\u4e8e AI \u7f16\u7a0b\u52a9\u624b\u5c06\u6784\u5efa\u6210\u672c\u964d\u4f4e\u4e8610 \u500d\u4ee5\u4e0a\uff0c\u8bb8\u591a\u66fe\u7ecf\u88ab\u89c6\u4e3a\u201c\u5355\u5411\u95e8\u201d\uff08\u4e0d\u53ef\u9006\uff09\u7684\u51b3\u7b56\u73b0\u5728\u53d8\u6210\u4e86\u201c\u53cc\u5411\u95e8\u201d\uff08\u53ef\u8f7b\u677e\u91cd\u505a\uff09\u3002\u8fd9\u610f\u5473\u7740\u521b\u4e1a\u8005\u53ef\u4ee5\u66f4\u5927\u80c6\u5730\u5b9e\u9a8c\u5e76\u5feb\u901f\u63a8\u7ffb\u91cd\u6765\u3002"}
    ],
    "core_takeaways": [
        {"en": "Execution speed is the strongest predictor of a startup's odds of success.", "cn": "\u6267\u884c\u901f\u5ea6\u662f\u9884\u6d4b\u521b\u4e1a\u6210\u529f\u7387\u7684\u6700\u5f3a\u6307\u6807\u3002"},
        {"en": "The bottleneck has shifted from engineering to product management and user feedback.", "cn": "\u74f6\u9888\u5df2\u4ece\u5de5\u7a0b\u5f00\u53d1\u8f6c\u79fb\u5230\u4e86\u4ea7\u54c1\u7ba1\u7406\u548c\u7528\u6237\u53cd\u9988\u3002"},
        {"en": "Vague ideas are usually right but useless; concrete ideas buy you the speed to be proven wrong quickly.", "cn": "\u6a21\u7cca\u7684\u60f3\u6cd5\u901a\u5e38\u662f\u5bf9\u7684\u4f46\u6ca1\u7528\uff1b\u5177\u4f53\u7684\u60f3\u6cd5\u80fd\u8ba9\u4f60\u83b7\u5f97\u5feb\u901f\u8bd5\u9519\u7684\u901f\u5ea6\u3002"}
    ],
    "keywords": [
        {"word": "Agentic AI", "en": "AI systems that use iterative loops to plan, critique, and improve their own output.", "cn": "\u667a\u80fd\u4f53 AI\uff1a\u4f7f\u7528\u8fed\u4ee3\u5faa\u73af\u6765\u89c4\u5212\u3001\u6279\u5224\u5e76\u6539\u8fdb\u81ea\u8eab\u8f93\u51fa\u7684 AI \u7cfb\u7edf\u3002"},
        {"word": "Concrete Idea", "en": "An idea specified in enough detail that an engineer can build it immediately.", "cn": "\u5177\u4f53\u60f3\u6cd5\uff1a\u7ec6\u8282\u660e\u786e\u5230\u8db3\u4ee5\u8ba9\u5de5\u7a0b\u5e08\u7acb\u5373\u7740\u624b\u6784\u5efa\u7684\u60f3\u6cd5\u3002"},
        {"word": "Two-Way Door", "en": "A decision that can be reversed or changed relatively cheaply if it proves wrong.", "cn": "\u53cc\u5411\u95e8\uff1a\u5982\u679c\u8bc1\u660e\u662f\u9519\u8bef\u7684\uff0c\u53ef\u4ee5\u4ee5\u8f83\u4f4e\u6210\u672c\u9006\u8f6c\u6216\u66f4\u6539\u7684\u51b3\u7b56\u3002"},
        {"word": "Product Overhang", "en": "The gap between existing technology capabilities and the actual products built to use them.", "cn": "\u4ea7\u54c1\u6ee9\u540e\uff1a\u73b0\u6709\u6280\u672f\u80fd\u529b\u4e0e\u5229\u7528\u8fd9\u4e9b\u80fd\u529b\u7684\u5b9e\u9645\u4ea7\u54c1\u4e4b\u95f4\u7684\u5dee\u8ddd\u3002"}
    ],
    "phrase_drill": [
        {"en": "Pivot on a dime.", "cn": "\u8fc5\u901f\u8f6c\u578b\uff08\u6307\u5728\u6781\u5c0f\u7a7a\u95f4/\u65f6\u95f4\u5185\u6539\u53d8\u65b9\u5411\uff09\u3002"},
        {"en": "Wander the idea maze.", "cn": "\u5728\u60f3\u6cd5\u8ff7\u5bab\u4e2d\u63a2\u7d22\uff08\u6307\u6df1\u5165\u601d\u8003\u5e76\u9a8c\u8bc1\u521b\u4e1a\u70b9\u5b50\uff09\u3002"},
        {"en": "Execution speed.", "cn": "\u6267\u884c\u901f\u5ea6\u3002"}
    ],
    "reflection_questions": [
        "\u4f60\u7684\u521b\u4e1a\u70b9\u5b50\u662f\u4e00\u4e2a\u8db3\u4ee5\u8ba9\u5de5\u7a0b\u5e08\u4e0b\u5348\u5c31\u5f00\u59cb\u52a8\u5de5\u7684\u201c\u5177\u4f53\u60f3\u6cd5\u201d\u5417\uff1f",
        "\u5728 AI \u8ba9\u7f16\u7a0b\u53d8\u5ec9\u4ef7\u7684\u65f6\u4ee3\uff0c\u4f60\u5982\u4f55\u901a\u8fc7\u201c\u4e13\u5bb6\u76f4\u89c9\u201d\u6765\u7f29\u77ed\u4ea7\u54c1\u53cd\u9988\u5468\u671f\uff1f"
    ],
    "closing_note": "\u4e0d\u8981\u5bb3\u6015 AI \u53d6\u4ee3\u5de5\u4f5c\uff0c\u8981\u5bb3\u6015\u90a3\u4e9b\u6bd4\u4f60\u66f4\u61c2\u5f97\u5229\u7528 AI \u6765\u6307\u6325\u8ba1\u7b97\u673a\u7684\u4eba\u3002"
}

cache_path = "E:/claude/yt-x-assist/data/analyses.json"
with open(cache_path, "r", encoding="utf-8") as f:
    cache = json.load(f)
cache["RNJCfif1dPY"] = analysis
with open(cache_path, "w", encoding="utf-8") as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print("Saved RNJCfif1dPY. Total:", len(cache))
