#!/usr/bin/env python3
"""Render any markdown doc as a self-contained Material Design 3 (MD3) review page.

Usage:  python scripts/generate_md3_review.py docs/WORLD_MODEL_PHASE1.md
Output: <input path with .html>  (e.g. docs/WORLD_MODEL_PHASE1.html)
"""

import pathlib
import re
import sys

import markdown

MD = markdown.Markdown(extensions=["toc", "tables", "fenced_code", "attr_list", "sane_lists"])

CSS = """
:root{
  --md-primary:#6750A4; --md-on-primary:#FFFFFF;
  --md-primary-container:#EADDFF; --md-on-primary-container:#21005D;
  --md-secondary:#625B71; --md-secondary-container:#E8DEF8; --md-on-secondary-container:#1D192B;
  --md-tertiary:#7D5260; --md-tertiary-container:#FFD8E4; --md-on-tertiary-container:#31111D;
  --md-error:#B3261E; --md-error-container:#F9DEDC;
  --md-surface:#FEF7FF; --md-surface-dim:#DED8E1; --md-surface-container-lowest:#FFFFFF;
  --md-surface-container:#F3EDF7; --md-surface-container-high:#ECE6F0; --md-surface-variant:#E7E0EC;
  --md-on-surface:#1D1B20; --md-on-surface-variant:#49454F; --md-outline:#79747E; --md-outline-variant:#CAC4D0;
  --md-inverse-surface:#322F35;
  --shadow-1:0 1px 2px rgba(0,0,0,.3),0 1px 3px 1px rgba(0,0,0,.15);
  --shadow-2:0 1px 2px rgba(0,0,0,.3),0 2px 6px 2px rgba(0,0,0,.15);
  --radius-card:16px; --radius-chip:8px; --radius-sheet:28px;
  --state-primary:color-mix(in srgb,var(--md-primary) 8%,transparent);
  --state-primary-strong:color-mix(in srgb,var(--md-primary) 12%,transparent);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:"Roboto",system-ui,-apple-system,"Segoe UI",sans-serif;
  background:var(--md-surface);color:var(--md-on-surface);
  line-height:1.6;font-size:16px;-webkit-font-smoothing:antialiased;
}
.wrap{max-width:960px;margin:0 auto;padding:0 20px 120px}
/* app bar */
.appbar{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--md-surface) 88%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--md-outline-variant)}
.appbar-inner{max-width:960px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.2px}
.brand-dot{width:30px;height:30px;border-radius:10px;background:var(--md-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
.chip{font:500 13px/1 Roboto,sans-serif;color:var(--md-on-surface-variant);text-decoration:none;border:1px solid var(--md-outline-variant);border-radius:var(--radius-chip);padding:8px 14px;background:var(--md-surface);transition:background .15s}
.chip:hover{background:var(--state-primary)}
.chip-active{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}
/* hero */
.hero{background:var(--md-surface-container);border-radius:var(--radius-sheet);padding:40px 32px;margin:28px 0 24px;box-shadow:var(--shadow-1)}
.hero .eyebrow{color:var(--md-primary);font:700 12px/1.6 Roboto,sans-serif;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px}
.hero h1{font:400 40px/1.2 Roboto,sans-serif;letter-spacing:-.5px;margin-bottom:10px}
.hero .lede{color:var(--md-on-surface-variant);font-size:16px;max-width:70ch}
/* sections as cards */
section.md-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-card);padding:30px 32px;margin:24px 0;box-shadow:var(--shadow-1)}
h2{font:400 26px/1.3 Roboto,sans-serif;letter-spacing:0;margin-bottom:6px;color:var(--md-on-surface)}
h2 .sec-no{display:inline-flex;min-width:30px;height:30px;border-radius:10px;background:var(--md-primary-container);color:var(--md-on-primary-container);align-items:center;justify-content:center;font-size:14px;font-weight:600;margin-right:12px;vertical-align:middle}
h3{font:500 19px/1.4 Roboto,sans-serif;color:var(--md-on-surface);margin:26px 0 10px}
h4{font:500 15px/1.4 Roboto,sans-serif;margin:20px 0 8px;color:var(--md-on-surface)}
p{margin:12px 0;color:var(--md-on-surface)}
strong{font-weight:600}
ul,ol{margin:10px 0;padding-left:24px}
li{margin:5px 0}
li::marker{color:var(--md-primary)}
code{font:500 13px/1.5 "Roboto Mono",ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-variant);border-radius:6px;padding:2px 6px;color:var(--md-on-surface)}
pre{background:var(--md-surface-container-high);border:1px solid var(--md-outline-variant);border-radius:12px;padding:18px 20px;overflow-x:auto;margin:14px 0}
pre code{background:none;padding:0;font:400 13px/1.6 "Roboto Mono",ui-monospace,monospace}
table{border-collapse:separate;border-spacing:0;width:100%;margin:16px 0;font-size:14px;overflow:hidden;border-radius:12px;border:1px solid var(--md-outline-variant)}
th,td{padding:12px 14px;text-align:left;vertical-align:top;border-bottom:1px solid var(--md-outline-variant)}
thead th{background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-weight:600}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover td{background:var(--state-primary)}
blockquote{background:var(--md-primary-container);border-radius:12px;padding:16px 20px;margin:16px 0;border-left:4px solid var(--md-primary)}
blockquote p{margin:4px 0;color:var(--md-on-primary-container)}
hr{border:none;border-top:1px solid var(--md-outline-variant);margin:28px 0}
/* verdict cards */
.verdict-card{border-radius:var(--radius-card);padding:22px 24px;margin:14px 0;border:1px solid var(--md-outline-variant)}
.verdict-now{background:var(--md-primary-container)}
.verdict-now .vt{color:var(--md-on-primary-container);font-weight:700;letter-spacing:.5px;text-transform:uppercase;font-size:12px}
.verdict-next{background:var(--md-secondary-container)}
.verdict-next .vt{color:var(--md-on-secondary-container);font-weight:700;letter-spacing:.5px;text-transform:uppercase;font-size:12px}
.verdict-no{background:var(--md-error-container)}
.verdict-no .vt{color:var(--md-error);font-weight:700;letter-spacing:.5px;text-transform:uppercase;font-size:12px}
/* FAB */
.fab{position:fixed;right:26px;bottom:26px;width:56px;height:56px;border-radius:16px;background:var(--md-primary-container);color:var(--md-on-primary-container);border:none;box-shadow:var(--shadow-2);font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:box-shadow .15s}
.fab:hover{box-shadow:0 3px 3px -1px rgba(0,0,0,.3),0 6px 12px 2px rgba(0,0,0,.2)}
@media(max-width:640px){.hero h1{font-size:32px}.hero{padding:28px 22px}section.md-card{padding:24px 20px}.chips{display:none}}
"""


def md_to_html(text: str) -> str:
    MD.reset()
    return MD.convert(text)


def extract_sections(body: str) -> list[tuple[str, str]]:
    """Split rendered body into (heading_text, inner_html) per top h2, for chips + ids."""
    parts = re.split(r"(<h2[^>]*>.*?</h2>)", body, flags=re.S)
    out = []
    cur_title = ""
    cur_buf = []
    for part in parts:
        m = re.match(r"<h2[^>]*>(.*?)</h2>", part, flags=re.S)
        if m:
            if cur_title:
                out.append((cur_title, "".join(cur_buf)))
            cur_title = re.sub(r"<[^>]+>", "", m.group(1)).strip()
            cur_buf = [part]
        else:
            cur_buf.append(part)
    if cur_title:
        out.append((cur_title, "".join(cur_buf)))
    return out


def slugify(title: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\u4e00-\u9fff]+", "-", title).strip("-").lower()
    return s or "sec"


def main(src: str) -> None:
    src_path = pathlib.Path(src).resolve()
    raw = src_path.read_text(encoding="utf-8", errors="replace")
    body = md_to_html(raw)
    # drop the first h1 (doc title) — hero renders it
    body = re.sub(r"^\s*<h1[^>]*>.*?</h1>\s*", "", body, count=1, flags=re.S)
    sections = extract_sections(body)

    chips = "".join(
        f'<a class="chip" href="#{slugify(t)}">{t.split(" — ")[0]}</a>' for t, _ in sections
    )
    cards = ""
    for i, (title, inner) in enumerate(sections, start=1):
        slug = slugify(title)
        # first two h2 headers inside the card get re-labeled with section numbers
        inner2 = inner
        cards += (
            f'<section class="md-card" id="{slug}">'
            f'<h2><span class="sec-no">{i:02d}</span>{title}</h2>{inner2}</section>'
        )

    page = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>World Model Phase 1 — MD3 Review</title>
<style>{CSS}</style>
</head>
<body>
<div class="appbar">
  <div class="appbar-inner">
    <div class="brand"><span class="brand-dot">H</span> HeadConan · World Model Phase 1</div>
    <div class="chips">{chips}</div>
  </div>
</div>
<div class="wrap">
  <header class="hero">
    <div class="eyebrow">Design Review · Anti-Overengineering</div>
    <h1>World Model Phase 1</h1>
    <p class="lede">从 10 分钟体验出发，反推最小世界模型——5 个概念，16 项不构建。设计评审（Material 3 风格审阅版）。</p>
  </header>
  {cards}
</div>
<button class="fab" onclick="window.scrollTo({{top:0,behavior:'smooth'}})" aria-label="返回顶部">↑</button>
</body>
</html>"""
    out = src_path.with_suffix(".html")
    out.write_text(page, encoding="utf-8")
    print(f"OK → {out}  ({out.stat().st_size/1024:.0f} KB, {len(sections)} sections)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "docs/WORLD_MODEL_PHASE1.md")
