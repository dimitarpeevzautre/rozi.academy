import re
import json

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract bootstrap json string
match = re.search(r"window\['bootstrap'\]\s*=\s*JSON\.parse\('((?:[^'\\]|\\.)*)'\);", content)
if match:
    raw_json = match.group(1)
    # unescape json
    unescaped = raw_json.encode().decode('unicode_escape')
    data = json.loads(unescaped)
    print("Found bootstrap data!")
    print("Keys:", data.keys())
    # Let's inspect page data
    if 'page' in data:
        page = data['page']
        print("Page keys:", page.keys())
        if 'A' in page and isinstance(page['A'], dict):
            print("page['A'] keys:", page['A'].keys())
            sections = page['A'].get('A', [])
            print(f"Number of sections: {len(sections)}")
            for idx, sec in enumerate(sections):
                name = sec.get('B', f'Section {idx}')
                elements = sec.get('E', [])
                print(f"Section {idx}: {name} with {len(elements)} elements")
else:
    print("Bootstrap not matched")
