import base64, re, pathlib, sys
root = pathlib.Path(".")
src  = sys.argv[3] if len(sys.argv) > 3 else "index.html"
html = (root/src).read_text()
css  = (root/"stephub-ui.css").read_text()
js   = (root/"mock-data.js").read_text()

def data_uri(path):
    p = root/path
    mime = "image/png" if p.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()

# inline css + js
html = html.replace('<link rel="stylesheet" href="stephub-ui.css">', "<style>\n" + css + "\n</style>")
html = html.replace('<script src="mock-data.js"></script>', "<script>\n" + js + "\n</script>")

# inline every asset reference
missing = []
for m in sorted(set(re.findall(r'assets/[A-Za-z0-9_\-/]+\.(?:png|jpg)', html)), key=len, reverse=True):
    if (root / m).exists():
        html = html.replace(m, data_uri(m))
    else:
        missing.append(m)          # left as-is: the page falls back gracefully
if missing:
    print("  (not supplied yet, left as plain paths:", ", ".join(sorted(missing)) + ")")

out = pathlib.Path(sys.argv[1]); out.write_text(html)
print(out, round(len(html)/1024), "KB")

# artifact variant: body content only (the Artifact tool adds the page skeleton)
head_title = re.search(r"<title>(.*?)</title>", html, re.S).group(1)
style = re.search(r"<style>.*?</style>", html, re.S).group(0)
body  = re.search(r"<body>(.*)</body>", html, re.S).group(1)
art = pathlib.Path(sys.argv[2])
art.write_text(f"<title>{head_title}</title>\n{style}\n{body}")
print(art, round(art.stat().st_size/1024), "KB")
