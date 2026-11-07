"""Rebuild the site into ../site (and a copy of the page at ../wrd-card-maker.html).

Inlines into app.html:
  __CHAPTERS__  ../lib/chapters.json (official chapter list, also used by the API)
  __MATCH__     ../lib/match.js (chapter matcher, also used by the API; "export" keywords removed)
  __LOGO__      nars-logo.jpg
  __BG__        flyer-bg.jpg (clean 2160x2700 flyer background)
Copies admin.html to site/admin.html and everything in public/ to site/.
The quiz questions are NOT in the page: they live in ../lib/questions.js and are served by the API.

Run:  python src/build.py
"""
import base64, json, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
OUT = os.path.join(ROOT, "wrd-card-maker.html")
SITE = os.path.join(ROOT, "site")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def data_url(name, mime):
    with open(os.path.join(HERE, name), "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode())


chapters = json.loads(read(os.path.join(ROOT, "lib", "chapters.json")))
assert len({c["code"] for c in chapters}) == len(chapters), "duplicate chapter codes"
match_js = re.sub(r"^export\s+", "", read(os.path.join(ROOT, "lib", "match.js")), flags=re.M)
assert "import " not in match_js and "export" not in match_js, "lib/match.js must stay import/export free once inlined"

t = read(os.path.join(HERE, "app.html"))
for tok in ("__CHAPTERS__", "__MATCH__", "__LOGO__", "__BG__"):
    assert t.count(tok) == 1, tok
assert "__QUESTIONS__" not in t, "the question bank must not be inlined into the page"
t = t.replace("__CHAPTERS__", json.dumps(chapters, ensure_ascii=False, separators=(",", ":")))
t = t.replace("__MATCH__", match_js)
t = t.replace("__LOGO__", data_url("nars-logo.jpg", "image/jpeg"))
t = t.replace("__BG__", data_url("flyer-bg.jpg", "image/jpeg"))

# Optional manual Cloudflare Web Analytics beacon. Not needed if Web Analytics is
# switched on in the Pages project (Cloudflare then injects it automatically).
token = os.environ.get("CF_BEACON_TOKEN", "").strip()
if token:
    beacon = ('<script defer type="module" src="https://static.cloudflareinsights.com/beacon.min.js" '
              "data-cf-beacon='{\"token\": \"%s\"}'></script>\n</body>" % token)
    t = t.replace("</body>", beacon, 1)

os.makedirs(SITE, exist_ok=True)
# Static files served next to the page (link preview image, icons, manifest)
PUBLIC = os.path.join(HERE, "public")
if os.path.isdir(PUBLIC):
    for name in os.listdir(PUBLIC):
        shutil.copy2(os.path.join(PUBLIC, name), os.path.join(SITE, name))
shutil.copy2(os.path.join(HERE, "admin.html"), os.path.join(SITE, "admin.html"))
for path in (OUT, os.path.join(SITE, "index.html")):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(t)
    print("wrote", os.path.normpath(path), len(t), "bytes")
print("wrote", os.path.normpath(os.path.join(SITE, "admin.html")))
