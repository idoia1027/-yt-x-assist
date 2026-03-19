import json

cache_path = "E:/claude/yt-x-assist/data/analyses.json"
with open(cache_path, "r", encoding="utf-8") as f:
    cache = json.load(f)

if "test123" in cache:
    del cache["test123"]
    print("Deleted test123")
else:
    print("test123 not found")

with open(cache_path, "w", encoding="utf-8") as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)

print("Remaining keys:", list(cache.keys()))
print("Total:", len(cache))
