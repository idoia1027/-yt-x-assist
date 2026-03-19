import json

analysis = {
    "overview_cn": "Sam Altman \u56de\u987e\u4e86 OpenAI \u7684\u5efa\u7acb\u8fc7\u7a0b\uff0c\u5f3a\u8c03\u6781\u7aef\u4fe1\u5ff5\u3001\u5355\u70b9\u805a\u7126\u4ee5\u53ca AI \u8fdb\u5c55\u7684\u590d\u5229\u6548\u5e94\u3002\u4ed6\u8ba4\u4e3a\u6211\u4eec\u6b63\u5904\u4e8e\u4e00\u6b21\u91cd\u5927\u6280\u672f\u5468\u671f\u4e2d\uff0c\u521b\u4e1a\u516c\u53f8\u5177\u5907\u7ed3\u6784\u6027\u4f18\u52bf\uff0c\u4f46\u6267\u884c\u4e0e\u5546\u4e1a\u672c\u8d28\u4f9d\u7136\u91cd\u8981\u3002",
    "overview_en": "Sam Altman reflects on building OpenAI, emphasizing extreme conviction, focus on one bet, and the compounding nature of AI progress. He argues we are in a major technological shift where startups have structural advantage, but execution discipline still matters.",
    "timeline": [
        {"time": "00:00", "en": "OpenAI committed early to AGI despite criticism and limited resources.", "cn": "OpenAI \u5728\u8d44\u6e90\u4e0d\u8db3\u3001\u88ab\u8d28\u7591\u7684\u60c5\u51b5\u4e0b\u4ecd\u575a\u5b9a\u538b\u6ce8 AGI\u3002"},
        {"time": "00:29", "en": "Extreme conviction on one bet is widely underestimated.", "cn": "\u201c\u5bf9\u5355\u4e00\u65b9\u5411\u7684\u6781\u7aef\u4fe1\u5ff5\u201d\u88ab\u5927\u591a\u6570\u4eba\u4e25\u91cd\u4f4e\u4f30\u3002"},
        {"time": "01:05", "en": "This is the best time yet to start a tech company.", "cn": "\u73b0\u5728\u662f\u8fc4\u4eca\u4e3a\u6b62\u6700\u597d\u7684\u521b\u4e1a\u65f6\u673a\u3002"},
        {"time": "01:35", "en": "Startups gain advantage during major technological shifts.", "cn": "\u5728\u6280\u672f\u8303\u5f0f\u8f6c\u53d8\u671f\uff0c\u521b\u4e1a\u516c\u53f8\u62e5\u6709\u4f18\u52bf\u3002"},
        {"time": "02:07", "en": "AI progress may compound toward superintelligence within years.", "cn": "AI \u8fdb\u5c55\u53ef\u80fd\u5728\u6570\u5e74\u5185\u590d\u5229\u900c\u8fd1\u8d85\u667a\u80fd\u3002"},
        {"time": "04:20", "en": "Abundant intelligence + abundant energy unlock everything.", "cn": "\u201c\u667a\u80fd+\u80fd\u6e90\u201d\u7684\u6781\u5927\u4e30\u5bcc\u5c06\u89e3\u9501\u51e0\u4e4e\u6240\u6709\u95ee\u9898\u3002"},
        {"time": "06:29", "en": "Peer groups are more important than mentorship alone.", "cn": "\u540c\u4f34\u7fa4\u4f53\u6bd4\u5355\u4e00\u5bfc\u5e08\u66f4\u5173\u952e\u3002"},
        {"time": "08:17", "en": "You can just try things—more often than people think.", "cn": "\u5f88\u591a\u4e8b\u60c5\u5176\u5b9e\u53ef\u4ee5\u76f4\u63a5\u53bb\u5c1d\u8bd5\u3002"},
        {"time": "14:10", "en": "Belief in scaling deep learning was considered heretical.", "cn": "\u201c\u89c4\u6a21\u5316\u6df1\u5ea6\u5b66\u4e60\u201d\u66fe\u88ab\u8ba4\u4e3a\u662f\u5f02\u7aef\u89c2\u70b9\u3002"},
        {"time": "19:29", "en": "Focus on one thing and push it relentlessly.", "cn": "\u805a\u7126\u4e00\u4e2a\u65b9\u5411\u5e76\u6301\u7eed\u63a8\u8fdb\u3002"},
        {"time": "22:59", "en": "Conviction should yield to data when evidence appears.", "cn": "\u4e00\u65e6\u6709\u6570\u636e\uff0c\u4fe1\u5ff5\u5fc5\u987b\u8ba9\u4f4d\u3002"},
        {"time": "27:24", "en": "Product-market fit only becomes clear after real usage.", "cn": "\u4ea7\u54c1\u4ef7\u5024\u53ea\u6709\u5728\u771f\u5b9e\u7528\u6237\u4e2d\u624d\u80fd\u9a8c\u8bc1\u3002"},
        {"time": "33:42", "en": "The world is still underestimating AI's impact.", "cn": "\u4e16\u754c\u4ecd\u4e25\u91cd\u4f4e\u4f30 AI \u7684\u5f71\u54cd\u3002"},
        {"time": "44:20", "en": "Speed and focus are the ultimate startup advantages now.", "cn": "\u901f\u5ea6\u4e0e\u4e13\u6ce8\u662f\u5f53\u524d\u521b\u4e1a\u7684\u6700\u5927\u4f18\u52bf\u3002"},
        {"time": "45:25", "en": "AI does not remove the need for real business fundamentals.", "cn": "AI \u4e0d\u4f1a\u6539\u53d8\u5546\u4e1a\u57fa\u672c\u89c4\u5f8b\u3002"}
    ],
    "key_concepts": [
        {"title": "Extreme Conviction / \u6781\u7aef\u4fe1\u5ff5", "desc": "\u5728\u7f3a\u4e4f\u6570\u636e\u3001\u88ab\u4e3b\u6d41\u53cd\u5bf9\u65f6\u4f9d\u7136\u6301\u7eed\u6295\u5165\u7684\u80fd\u529b\u3002\u8fd9\u662f early-stage \u521b\u4e1a\u6700\u7a00\u7f3a\u7684\u80fd\u529b\uff0c\u672c\u8d28\u662f\u5728\u4e0d\u786e\u5b9a\u6027\u6781\u9ad8\u9636\u6bb5\u505a\u51b3\u7b56\u7684\u80fd\u529b\u3002"},
        {"title": "Conviction vs Truth-seeking / \u4fe1\u5ff5 vs \u6c42\u771f", "desc": "\u524d\u671f\u9700\u8981 conviction\uff08\u6ca1\u6709\u6570\u636e\u65f6\uff09\uff0c\u4f46\u4e00\u65e6\u6570\u636e\u51fa\u73b0\uff0c\u5fc5\u987b\u8f6c\u5411 truth-seeking\u3002\u5f88\u591a\u4eba\u5931\u8d25\u5728\u4e8e\u628a conviction \u5ef6\u7eed\u5230\u6570\u636e\u5df2\u7ecf\u53cd\u8bc1\u4e4b\u540e\u3002"},
        {"title": "Startup Window / \u521b\u4e1a\u7a97\u53e3\u671f", "desc": "\u5728\u7a33\u5b9a\u65f6\u671f\uff0c\u5927\u516c\u53f8\u6709\u4f18\u52bf\uff1b\u5728\u8303\u5f0f\u53d8\u5316\u671f\uff0c\u5c0f\u516c\u53f8\u6709\u4f18\u52bf\u3002\u5f53\u524d AI \u5c31\u5c5e\u4e8e\u540e\u8005\u3002\u8fd9\u4e0d\u662f\u60c5\u7eea\u5224\u65ad\uff0c\u800c\u662f\u7ed3\u6784\u6027\u673a\u4f1a\u7a97\u53e3\u3002"}
    ],
    "core_takeaways": [
        {"en": "Extreme conviction is required before data exists.", "cn": "\u5728\u6ca1\u6709\u6570\u636e\u4e4b\u524d\uff0c\u9700\u8981\u6781\u7aef\u4fe1\u5ff5\u3002"},
        {"en": "Focus beats diversification in early-stage startups.", "cn": "\u65e9\u671f\u521b\u4e1a\u4e2d\uff0c\u805a\u7126\u4f18\u4e8e\u5206\u6563\u3002"},
        {"en": "Scaling what works is a universal strategy.", "cn": "\u5bf9\u6709\u6548\u8def\u5f84\u8fdb\u884c\u89c4\u6a21\u5316\u662f\u901a\u7528\u7b56\u7565\u3002"},
        {"en": "Peer groups shape outcomes more than mentors.", "cn": "\u540c\u4f34\u7fa4\u4f53\u6bd4\u5bfc\u5e08\u66f4\u5f71\u54cd\u7ed3\u679c\u3002"},
        {"en": "AI accelerates execution, not business fundamentals.", "cn": "AI \u52a0\u901f\u6267\u884c\uff0c\u4f46\u4e0d\u6539\u53d8\u5546\u4e1a\u672c\u8d28\u3002"}
    ],
    "keywords": [
        {"word": "Extreme conviction", "en": "Strong belief maintained in the absence of data.", "cn": "\u5728\u6ca1\u6709\u6570\u636e\u652f\u6301\u65f6\u4ecd\u575a\u6301\u7684\u5f3a\u4fe1\u5ff5\u3002"},
        {"word": "Scaling", "en": "Increasing system size to improve performance predictably.", "cn": "\u901a\u8fc7\u6269\u5927\u89c4\u6a21\u6765\u63d0\u5347\u6027\u80fd\u7684\u7b56\u7565\u3002"},
        {"word": "Peer group effect", "en": "Influence of surrounding individuals on behavior and ambition.", "cn": "\u5468\u56f4\u4eba\u5bf9\u884c\u4e3a\u548c\u76ee\u6807\u7684\u5f71\u54cd\u3002"},
        {"word": "Tech paradigm shift", "en": "Moments when new technologies reset competitive dynamics.", "cn": "\u6280\u672f\u8303\u5f0f\u53d8\u5316\u5e26\u6765\u7684\u7ade\u4e89\u683c\u5c40\u91cd\u7f6e\u3002"},
        {"word": "Product-market fit", "en": "Validation of product value through real users.", "cn": "\u901a\u8fc7\u771f\u5b9e\u7528\u6237\u9a8c\u8bc1\u4ea7\u54c1\u4ef7\u5024\u3002"}
    ],
    "phrase_drill": [
        {"en": "You can just try stuff.", "cn": "\u4f60\u5176\u5b9e\u53ef\u4ee5\u76f4\u63a5\u53bb\u8bd5\u3002"},
        {"en": "No one has all the answers.", "cn": "\u6ca1\u6709\u4eba\u638c\u63e1\u6240\u6709\u7b54\u6848\u3002"},
        {"en": "Conviction until data arrives.", "cn": "\u5728\u6570\u636e\u51fa\u73b0\u524d\u575a\u6301\u4fe1\u5ff5\u3002"},
        {"en": "Build something people actually want.", "cn": "\u505a\u771f\u6b63\u6709\u4eba\u9700\u8981\u7684\u4e1c\u897f\u3002"},
        {"en": "More is more.", "cn": "\u66f4\u591a\u5c31\u662f\u66f4\u591a\u3002"}
    ],
    "reflection_questions": [
        "\u4f60\u5f53\u524d\u505a\u7684\u4e8b\u60c5\uff0c\u662f\u201c\u591a\u70b9\u8bd5\u63a2\u201d\uff0c\u8fd8\u662f\u201c\u5355\u70b9\u6781\u7aef\u805a\u7126\u201d\uff1f",
        "\u4f60\u7684 conviction \u662f\u5426\u5df2\u7ecf\u88ab\u6570\u636e\u8bc1\u4f2a\u4f46\u4ecd\u5728\u575a\u6301\uff1f",
        "\u4f60\u6240\u5728\u7684 peer group\uff0c\u662f\u5728\u653e\u5927\u4f60\u7684 ambition \u8fd8\u662f\u9650\u5236\u5b83\uff1f"
    ],
    "closing_note": "\u6838\u5fc3\u4e0d\u662f AI\uff0c\u800c\u662f\u5982\u4f55\u5728\u4e0d\u786e\u5b9a\u4e2d\u884c\u52a8\uff1a\u65e9\u538b\u6ce8\u3001\u6df1\u805a\u7126\u3001\u5feb\u8fed\u4ee3\uff0c\u540c\u65f6\u59cb\u7ec8\u533a\u5206 demo \u548c\u771f\u6b63\u7684\u5546\u4e1a\u3002"
}

cache_path = "E:/claude/yt-x-assist/data/analyses.json"
with open(cache_path, "r", encoding="utf-8") as f:
    cache = json.load(f)
cache["xXCBz_8hM9w"] = analysis
with open(cache_path, "w", encoding="utf-8") as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print("Saved xXCBz_8hM9w. Total:", len(cache))
print("All keys:", list(cache.keys()))
