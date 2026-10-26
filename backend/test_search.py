from ddgs import DDGS

print("Starting NEXA Web Search...")

results = DDGS().text(
    "latest AI news",
    region="in-en",
    max_results=5
)

print("\nSEARCH RESULTS:\n")

for i, result in enumerate(results, start=1):
    print(f"{i}. {result.get('title')}")
    print(f"   {result.get('href')}")
    print(f"   {result.get('body')}")
    print()