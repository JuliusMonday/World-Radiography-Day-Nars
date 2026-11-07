"""Rebuild ../wrd-card-maker.html as one self-contained file.

Inlines into app.html:
  __QUESTIONS__  questions.js (question bank)
  __LOGO__       nars-logo.jpg
  __BG__         flyer-bg.jpg (clean 2160x2700 flyer background)

Run:  python src/build.py
"""
import base64, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "wrd-card-maker.html")


def read(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return f.read()


def data_url(name, mime):
    with open(os.path.join(HERE, name), "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode())


t = read("app.html")
for token in ("__QUESTIONS__", "__LOGO__", "__BG__"):
    assert t.count(token) == 1, token
t = t.replace("__QUESTIONS__", read("questions.js"))
t = t.replace("__LOGO__", data_url("nars-logo.jpg", "image/jpeg"))
t = t.replace("__BG__", data_url("flyer-bg.jpg", "image/jpeg"))
SITE = os.path.join(HERE, "..", "site")
os.makedirs(SITE, exist_ok=True)
for path in (OUT, os.path.join(SITE, "index.html")):  # site/ is the folder to upload to a host
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(t)
    print("wrote", os.path.normpath(path), len(t), "bytes")
