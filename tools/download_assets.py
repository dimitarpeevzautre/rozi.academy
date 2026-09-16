import os
import re
import urllib.parse
import urllib.request

BASE_URL = "https://rozi.academy/"
visited = set()
to_visit = set()

def normalize_url(url):
    clean = url.split('#')[0].split('?')[0]
    return clean

def save_file(rel_path, content):
    if rel_path.startswith('/'):
        rel_path = rel_path[1:]
    if not rel_path or rel_path == '/':
        rel_path = 'index.html'
    full_path = os.path.join(os.getcwd(), rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'wb') as f:
        f.write(content)
    print(f"Saved: {rel_path} ({len(content)} bytes)")

def download_url(rel_url):
    clean = normalize_url(rel_url)
    if not clean or clean.startswith('http://') or clean.startswith('https://') or clean.startswith('//') or clean.startswith('data:'):
        return None
    
    if clean.startswith('/'):
        clean = clean[1:]
    
    if clean in visited:
        return None
    visited.add(clean)
    
    full_url = urllib.parse.urljoin(BASE_URL, clean)
    req = urllib.request.Request(full_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            save_file(clean, data)
            return data
    except Exception as e:
        print(f"Failed {clean} ({full_url}): {e}")
        return None

# Parse index_original.html
with open('index_original.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Collect all possible assets
matches = re.findall(r'[\'"]([a-zA-Z0-9_\-\./]+\.(?:css|js|png|jpg|jpeg|svg|webp|woff|woff2|ttf|ico))[\'"]', html)
for m in matches:
    to_visit.add(m)

# Also regex for media/ and fonts/ and images/
extra = re.findall(r'(?:media|fonts|images)/[a-zA-Z0-9_\-\.]+', html)
for e in extra:
    to_visit.add(e)

print(f"Initial asset count to download: {len(to_visit)}")

# Process initial
queue = list(to_visit)
for item in queue:
    res = download_url(item)
    if res and (item.endswith('.css') or item.endswith('.js')):
        # Search for more urls inside css / js
        try:
            text = res.decode('utf-8', errors='ignore')
            found = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', text)
            for f in found:
                download_url(f)
            found2 = re.findall(r'[\'"]([a-zA-Z0-9_\-\./]+\.(?:css|js|png|jpg|jpeg|svg|webp|woff|woff2|ttf))[\'"]', text)
            for f2 in found2:
                if not f2.startswith('http'):
                    download_url(f2)
        except Exception as err:
            pass

print("Done downloading!")
