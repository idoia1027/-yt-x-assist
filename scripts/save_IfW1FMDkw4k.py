import json

analysis = {
    "overview_cn": "Pawe\u0142 Huryn \u4e0e Akash Casshyap \u5408\u4f5c\u5e26\u6765\u4e86\u4e00\u573a AI \u4ea7\u54c1\u7ba1\u7406\u5927\u5e08\u8bfe\uff0c\u5185\u5bb9\u6db5\u76d6\u9ad8\u9636\u63d0\u793a\u8bcd\u5de5\u7a0b\u3001PRD \u64b0\u5199\u3001\u6a21\u578b\u5fae\u8c03\u3001RAG \u67b6\u6784\u4ee5\u53ca\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u3002",
    "overview_en": "Pawe\u0142 Huryn joins Akash Casshyap to provide a masterclass on AI Product Management, covering advanced prompting, PRD development, fine-tuning, RAG architecture, and agentic workflows.",
    "timeline": [
        {"time": "00:01:31", "en": "Why AI PMs earn more: Combining business strategy with technical depth", "cn": "\u4e3a\u4ec0\u4e48 AI PM \u85aa\u8d44\u66f4\u9ad8\uff1a\u5546\u4e1a\u7b56\u7565\u4e0e\u6280\u672f\u6df1\u5ea6\u7684\u7ed3\u5408"},
        {"time": "00:03:06", "en": "Advanced Prompting: Context, personas, and step-by-step instructions", "cn": "\u9ad8\u9636\u63d0\u793a\u8bcd\uff1a\u63d0\u4f9b\u4e0a\u4e0b\u6587\u3001\u89d2\u8272\u8bbe\u5b9a\u53ca\u5206\u6b65\u6307\u4ee4"},
        {"time": "00:08:23", "en": "Prompt Hacks: Using financial rewards ($1,000) to improve LLM output", "cn": "\u63d0\u793a\u8bcd\u6280\u5de7\uff1a\u5229\u7528\u7ecf\u6d4e\u5956\u52b1\uff081,000 \u7f8e\u5143\uff09\u63d0\u5347 LLM \u8f93\u51fa\u8d28\u91cf"},
        {"time": "00:12:36", "en": "The AI PRD: Aligning AI initiatives with business strategy and guardrails", "cn": "AI PRD\uff1a\u5c06 AI \u4e3e\u63aa\u4e0e\u4e1a\u52a1\u6218\u7565\u53ca\u5b89\u5168\u62a4\u680f\u5bf9\u9f50"},
        {"time": "00:20:01", "en": "Fine-tuning vs. RAG: When to use internal weights vs. external data", "cn": "\u5fae\u8c03 vs. RAG\uff1a\u4f55\u65f6\u4f7f\u7528\u5185\u90e8\u6743\u91cd\uff0c\u4f55\u65f6\u4f7f\u7528\u5916\u90e8\u6570\u636e"},
        {"time": "00:24:29", "en": "Live Demo: Fine-tuning GPT-4o mini to adopt a specific brand voice (Yoda)", "cn": "\u73b0\u573a\u6f14\u793a\uff1a\u5fae\u8c03 GPT-4o mini \u4ee5\u91c7\u7528\u7279\u5b9a\u54c1\u724c\u8bed\u6c14\uff08\u5c24\u8fbe\u5927\u5e08\uff09"},
        {"time": "00:32:00", "en": "RAG Architecture: Using Pinecone vector stores and n8n for document indexing", "cn": "RAG \u67b6\u6784\uff1a\u4f7f\u7528 Pinecone \u5411\u91cf\u6570\u636e\u5e93\u548c n8n \u8fdb\u884c\u6587\u6863\u7d22\u5f15"},
        {"time": "00:49:25", "en": "Building a RAG-powered chatbot with n8n webhooks and Lovable", "cn": "\u5229\u7528 n8n Webhook \u548c Lovable \u6784\u5efa RAG \u9a71\u52a8\u7684\u804a\u5929\u673a\u5668\u4eba"},
        {"time": "00:54:21", "en": "Prompting for RAG: Instructing models to cite sources from retrieved chunks", "cn": "RAG \u63d0\u793a\u8bcd\uff1a\u6307\u4ee4\u6a21\u578b\u6839\u636e\u68c0\u7d22\u5230\u7684\u7247\u6bb5\u5f15\u7528\u6765\u6e90"},
        {"time": "01:07:23", "en": "MCP (Model Context Protocol): Standardizing how agents talk to systems like Figma and Jira", "cn": "MCP\uff08\u6a21\u578b\u4e0a\u4e0b\u6587\u534f\u8bae\uff09\uff1a\u6807\u51c6\u5316\u667a\u80fd\u4f53\u4e0e Figma\u3001Jira \u7b49\u7cfb\u7edf\u7684\u4ea4\u4e92"},
        {"time": "01:13:01", "en": "Live Demo: Using Claude and MCP to generate Jira stories from Figma designs", "cn": "\u73b0\u573a\u6f14\u793a\uff1a\u4f7f\u7528 Claude \u548c MCP \u6839\u636e Figma \u8bbe\u8ba1\u56fe\u751f\u6210 Jira \u7528\u6237\u6545\u4e8b"},
        {"time": "01:19:07", "en": "AI Agents: Building a 'Deep Market Researcher' that plans and delegates tasks", "cn": "AI \u667a\u80fd\u4f53\uff1a\u6784\u5efa\u4e00\u4e2a\u80fd\u591f\u89c4\u5212\u5e76\u5206\u53d1\u4efb\u52a1\u7684\u201c\u6df1\u5ea6\u5e02\u573a\u8c03\u7814\u5458\u201d"}
    ],
    "key_concepts": [
        {"title": "AI PM \u6280\u80fd\u91d1\u5b57\u5854", "desc": "AI \u4ea7\u54c1\u7ecf\u7406\u7684\u6280\u80fd\u5206\u4e3a\u56db\u4e2a\u5c42\u7ea7\uff1a1. \u9ad8\u9636\u63d0\u793a\u8bcd\uff1b2. AI \u4e13\u7528\u4ea7\u54c1\u9700\u6c42\u6587\u6863\uff1b3. \u6280\u672f\u67b6\u6784\u7406\u89e3\uff08\u5fae\u8c03\u4e0e RAG\uff09\uff1b4. \u667a\u80fd\u4f53\u534f\u8c03\u3002PM \u65e0\u9700\u5199\u4ee3\u7801\uff0c\u4f46\u5fc5\u987b\u7406\u89e3\u5982\u4f55\u901a\u8fc7\u5fae\u8c03\u964d\u4f4e Token \u6210\u672c\uff0c\u6216\u901a\u8fc7 RAG \u5904\u7406\u767e\u4e07\u7ea7\u6587\u6863\u3002"},
        {"title": "Fine-tuning vs. RAG \u7684\u6289\u62e9", "desc": "\u5fae\u8c03\u901a\u8fc7\u8c03\u6574\u6a21\u578b\u6743\u91cd\u6765\u5185\u5316\u77e5\u8bc6\u548c\u98ce\u683c\uff0c\u9002\u7528\u4e8e\u54c1\u724c\u8bed\u6c14\u6216\u964d\u4f4e\u957f Prompt \u6210\u672c\u3002RAG \u5c06\u6a21\u578b\u8fde\u63a5\u5230\u5916\u90e8\u5b9e\u65f6\u6570\u636e\u5e93\uff0c\u9002\u7528\u4e8e\u9700\u8981\u5f15\u7528\u6765\u6e90\u3001\u5904\u7406\u52a8\u6001\u4fe1\u606f\u6216\u6d77\u91cf\u6587\u6863\u7684\u573a\u666f\u3002\u4e24\u8005\u5e38\u7ed3\u5408\u4f7f\u7528\u4ee5\u6784\u5efa\u9ad8\u8d28\u91cf\u201c\u6570\u5b57\u5206\u8eab\u201d\u3002"},
        {"title": "Agent Orchestration with MCP / \u4f7f\u7528 MCP \u8fdb\u884c\u667a\u80fd\u4f53\u7f16\u6392", "desc": "\u6a21\u578b\u4e0a\u4e0b\u6587\u534f\u8bae\uff08MCP\uff09\u89e3\u51b3\u4e86\u667a\u80fd\u4f53\u4e0e\u5916\u90e8\u5de5\u5177\u96c6\u6210\u96be\u7684\u95ee\u9898\u3002\u901a\u8fc7 MCP\uff0c\u667a\u80fd\u4f53\u80fd\u81ea\u52a8\u7406\u89e3 Figma \u6216 Jira \u7684 API \u6743\u9650\u548c\u64cd\u4f5c\u65b9\u6cd5\uff0c\u5b9e\u73b0\u4ece\u8bbe\u8ba1\u56fe\u5230\u7528\u6237\u6545\u4e8b\u7684\u81ea\u52a8\u5316\u95ed\u73af\u3002"}
    ],
    "core_takeaways": [
        {"en": "AI PMs must move beyond basic prompting to building alignment via structured AI PRDs and technical evaluation metrics.", "cn": "AI PM \u5fc5\u987b\u8d85\u8d8a\u57fa\u7840\u63d0\u793a\u8bcd\uff0c\u8f6c\u5411\u901a\u8fc7\u7ed3\u6784\u5316\u7684 AI PRD \u548c\u6280\u672f\u8bc4\u4f30\u6307\u6807\u6765\u5efa\u7acb\u5171\u8bc6\u3002"},
        {"en": "RAG is essential for systems requiring citations and massive dataset access, while Fine-tuning is best for style and cost efficiency.", "cn": "RAG \u5bf9\u4e8e\u9700\u8981\u5f15\u7528\u548c\u8bbf\u95ee\u6d77\u91cf\u6570\u636e\u96c6\u7684\u7cfb\u7edf\u81f3\u5173\u91cd\u8981\uff0c\u800c\u5fae\u8c03\u6700\u9002\u5408\u98ce\u683c\u5b9a\u5236\u548c\u6210\u672c\u4f18\u5316\u3002"},
        {"en": "The role of the PM is evolving into an 'Agent Orchestrator' who defines workflows and success criteria for autonomous swarms.", "cn": "PM \u7684\u89d2\u8272\u6b63\u5728\u6f14\u53d8\u4e3a\u201c\u667a\u80fd\u4f53\u7f16\u6392\u8005\u201d\uff0c\u8d1f\u8d23\u5b9a\u4e49\u81ea\u4e3b\u96c6\u7fa4\u7684\u5de5\u4f5c\u6d41\u548c\u6210\u529f\u6807\u51c6\u3002"}
    ],
    "keywords": [
        {"word": "RAG (Retrieval-Augmented Generation)", "en": "A technique to give LLMs access to specific, up-to-date data without re-training.", "cn": "\u68c0\u7d22\u589e\u5f3a\u751f\u6210\uff1a\u4e00\u79cd\u65e0\u9700\u91cd\u65b0\u8bad\u7ec3\u5373\u53ef\u8ba9 LLM \u8bbf\u95ee\u7279\u5b9a\u6700\u65b0\u6570\u636e\u7684\u6280\u672f\u3002"},
        {"word": "Fine-tuning", "en": "The process of training a pre-trained model on a specialized dataset to adjust its parameters.", "cn": "\u5fae\u8c03\uff1a\u5728\u4e13\u95e8\u6570\u636e\u96c6\u4e0a\u8bad\u7ec3\u9884\u8bad\u7ec3\u6a21\u578b\u4ee5\u8c03\u6574\u5176\u53c2\u6570\u7684\u8fc7\u7a0b\u3002"},
        {"word": "MCP (Model Context Protocol)", "en": "An open standard that enables models to connect to data sources and tools seamlessly.", "cn": "\u6a21\u578b\u4e0a\u4e0b\u6587\u534f\u8bae\uff1a\u4e00\u79cd\u4f7f\u6a21\u578b\u80fd\u591f\u65e0\u7f1d\u8fde\u63a5\u5230\u6570\u636e\u6e90\u548c\u5de5\u5177\u7684\u5f00\u653e\u6807\u51c6\u3002"},
        {"word": "Vector Database", "en": "A database that stores information as numerical vectors for semantic search.", "cn": "\u5411\u91cf\u6570\u636e\u5e93\uff08\u5982 Pinecone\uff09\uff1a\u5c06\u4fe1\u606f\u5b58\u50a8\u4e3a\u6570\u5b57\u5411\u91cf\u4ee5\u8fdb\u884c\u8bed\u4e49\u641c\u7d22\u7684\u6570\u636e\u5e93\u3002"},
        {"word": "Agentic Workflow", "en": "A sequence of steps where an AI model plans, executes, and iterates using tools.", "cn": "\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\uff1aAI \u6a21\u578b\u5229\u7528\u5de5\u5177\u8fdb\u884c\u89c4\u5212\u3001\u6267\u884c\u548c\u8fed\u4ee3\u7684\u4e00\u7cfb\u5217\u6b65\u9aa4\u3002"}
    ],
    "phrase_drill": [
        {"en": "Don't build AI for AI's sake.", "cn": "\u4e0d\u8981\u4e3a\u4e86 AI \u800c\u505a AI\u3002"},
        {"en": "Perform this task on a champion level.", "cn": "\u4ee5\u9876\u7ea7\u6c34\u51c6\u5b8c\u6210\u6b64\u4efb\u52a1\uff08\u7528\u4e8e\u63d0\u793a\u8bcd\u5956\u52b1\u6280\u5de7\uff09\u3002"},
        {"en": "Combine business skills with technical knowledge.", "cn": "\u5c06\u5546\u4e1a\u6280\u80fd\u4e0e\u6280\u672f\u77e5\u8bc6\u76f8\u7ed3\u5408\u3002"}
    ],
    "reflection_questions": [
        "\u5728\u4f60\u7684\u4ea7\u54c1\u4e2d\uff0c\u54ea\u4e9b\u98ce\u683c\u5316\u7684\u8f93\u51fa\u53ef\u4ee5\u901a\u8fc7 Fine-tuning \u964d\u4f4e\u957f\u671f\u7684 Token \u6210\u672c\uff1f",
        "\u5982\u679c\u4f60\u6709\u767e\u4e07\u7ea7\u7528\u6237\u6587\u6863\uff0c\u4f60\u8be5\u5982\u4f55\u8bbe\u8ba1 RAG \u7684\u5206\u5757\uff08Chunking\uff09\u7b56\u7565\u4ee5\u4fdd\u8bc1\u641c\u7d22\u7cbe\u5ea6\uff1f"
    ],
    "closing_note": "AI PM \u5e02\u573a\u6b63\u5728\u5448\u6307\u6570\u7ea7\u589e\u957f\uff1b\u76ee\u6807\u662f\u6210\u4e3a\u5546\u4e1a\u6210\u679c\u4e0e\u6280\u672f\u53ef\u884c\u6027\u4e4b\u95f4\u7684\u201c\u6865\u6881\u201d\u3002"
}

cache_path = "E:/claude/yt-x-assist/data/analyses.json"
with open(cache_path, "r", encoding="utf-8") as f:
    cache = json.load(f)
cache["IfW1FMDkw4k"] = analysis
with open(cache_path, "w", encoding="utf-8") as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print("Saved IfW1FMDkw4k. Total:", len(cache))
