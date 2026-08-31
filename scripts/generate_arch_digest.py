#!/usr/bin/env python3
"""Generate a single-file HTML digest of all HeadConan architecture docs.

Reads every architecture-related markdown file, converts to HTML (python-markdown),
and assembles one self-contained Neubrutalist-styled reader with a grouped sidebar,
per-document anchor navigation, and full-text filter.

Output: docs/ARCHITECTURE_ZERO/ARCHITECTURE_DIGEST.html
"""

import html
import re
import pathlib

import markdown

ROOT = pathlib.Path(r"D:\github projects\HeadConan")
OUT = ROOT / "docs" / "ARCHITECTURE_ZERO" / "ARCHITECTURE_DIGEST.html"

GROUPS = [
    {
        "name": "产品定位 — Positioning & Vision",
        "accent": "yellow",
        "files": [
            ("POSITIONING.md — 官方定位（AI-native imagined world engine）", "docs/POSITIONING.md", True),
            ("VISION.md — 愿景与品牌（Imagination Runtime）", "docs/VISION.md", True),
        ],
    },
    {
        "name": "Architecture Zero — 核心交付",
        "accent": "red",
        "files": [
            ("ARCHITECTURE.md — 24 节实施就绪架构", "docs/ARCHITECTURE_ZERO/ARCHITECTURE.md", True),
            ("RESEARCH_LOG.md — 研究日志与证据表", "docs/ARCHITECTURE_ZERO/RESEARCH_LOG.md", False),
            ("ARCHITECTURE_MIGRATION.md — 代码迁移图", "docs/ARCHITECTURE_ZERO/ARCHITECTURE_MIGRATION.md", False),
            ("WORLD_MODEL_PHASE1.md — 最小世界模型反过度工程评审", "docs/WORLD_MODEL_PHASE1.md", True),
            ("ROUTING_PLAN.md — 路由系统严苛执行计划", "docs/ROUTING_PLAN.md", True),
        ],
    },
    {
        "name": "Architecture Zero — ADR 决策记录",
        "accent": "yellow",
        "files": [
            ("ADR-001 · 系统本质", "docs/adr/ADR-001-What-is-HeadConan.md", False),
            ("ADR-002 · 世界表示", "docs/adr/ADR-002-Core-World-Representation.md", False),
            ("ADR-003 · 状态模型", "docs/adr/ADR-003-State-Model.md", False),
            ("ADR-004 · 事件与因果", "docs/adr/ADR-004-Event-Causality-Model.md", False),
            ("ADR-005 · 知识/认知模型", "docs/adr/ADR-005-Knowledge-Epistemic-Model.md", False),
            ("ADR-006 · 角色架构", "docs/adr/ADR-006-Character-Architecture.md", False),
            ("ADR-007 · 主持人/玩家模型", "docs/adr/ADR-007-Host-Player-Model.md", False),
            ("ADR-008 · LLM 边界", "docs/adr/ADR-008-LLM-Boundary.md", False),
            ("ADR-009 · UI/运行时契约", "docs/adr/ADR-009-UI-Runtime-Contract.md", False),
            ("ADR-010 · 持久化与重放", "docs/adr/ADR-010-Persistence-Replay.md", False),
        ],
    },
    {
        "name": "早期架构（历史证据）",
        "accent": "blue",
        "files": [
            ("ARCHITECTURAL_ASSESSMENT", "docs/ARCHITECTURAL_ASSESSMENT.md", False),
            ("HEADCONAN_KERNEL", "docs/HEADCONAN_KERNEL.md", False),
            ("SYSTEM_ARCHITECTURE", "docs/SYSTEM_ARCHITECTURE.md", False),
            ("WORLD_RUNTIME", "docs/WORLD_RUNTIME.md", False),
            ("RUNTIME_LOOP", "docs/RUNTIME_LOOP.md", False),
            ("LAYOUT_ARCHITECTURE", "docs/LAYOUT_ARCHITECTURE.md", False),
            ("IMPLEMENTATION_ROADMAP", "docs/IMPLEMENTATION_ROADMAP.md", False),
            ("ARCHITECTURAL_DECISIONS", "docs/ARCHITECTURAL_DECISIONS.md", False),
            ("ARCHITECTURAL_EXPERIMENTS", "docs/ARCHITECTURAL_EXPERIMENTS.md", False),
            ("DO_NOT_BUILD_YET", "docs/DO_NOT_BUILD_YET.md", False),
            ("OPEN_QUESTIONS", "docs/OPEN_QUESTIONS.md", False),
        ],
    },
    {
        "name": "实验与垂直切片",
        "accent": "green",
        "files": [
            ("EXPERIMENTS — 架构实验日志", "EXPERIMENTS.md", False),
            ("P0_SLICE — 首段真实回路验收", "docs/P0_SLICE.md", False),
        ],
    },
]

MD = markdown.Markdown(
    extensions=["toc", "tables", "fenced_code", "attr_list", "sane_lists"],
    extension_configs={"toc": {"toc_depth": "1-4"}},
)


def md_to_html(text: str) -> str:
    MD.reset()
    return MD.convert(text)


def strip_first_h1(html_body: str) -> str:
    """Drop the very first <h1>…</h1> block — the doc-head already shows the title."""
    return re.sub(r"^\s*<h1[^>]*>.*?</h1>\s*", "", html_body, count=1, flags=re.S)


def extract_h2_titles(html_body: str) -> list[str]:
    return re.findall(r"<h2[^>]*>(.*?)</h2>", html_body, flags=re.S)


def clean_title(t: str) -> str:
    return re.sub(r"<[^>]+>", "", t).strip()


documents = []
for gi, group in enumerate(GROUPS):
    for title, rel, is_master in group["files"]:
        src = ROOT / rel
        raw = src.read_text(encoding="utf-8", errors="replace")
        body = md_to_html(raw)
        body = strip_first_h1(body)
        docs = {"gi": gi, "title": title, "rel": rel, "body": body, "is_master": is_master}
        if is_master:
            docs["subs"] = [clean_title(t) for t in extract_h2_titles(body)]
        documents.append(docs)

# ---------------- sidebar nav ----------------
nav_html = []
for gi, group in enumerate(GROUPS):
    nav_html.append(
        f'<div class="nav-group nav-{group["accent"]}">'
        f'<div class="nav-group-title">{html.escape(group["name"])}</div><ul>'
    )
    for doc in documents:
        if doc["gi"] != gi:
            continue
        label = html.escape(doc["title"])
        nav_html.append(f'<li><a href="#sec-{id(doc)}" data-target="{id(doc)}">{label}</a>')
        if doc.get("subs"):
            nav_html.append('<ul class="nav-subs">')
            for s in doc["subs"]:
                nav_html.append(f'<li><a href="#sec-{id(doc)}" data-target="{id(doc)}" data-sub="{html.escape(s)}">{html.escape(s)}</a></li>')
            nav_html.append("</ul>")
        nav_html.append("</li>")
    nav_html.append("</ul></div>")

# ---------------- content sections ----------------
content_html = []
for doc in documents:
    content_html.append(f'<section class="doc" id="sec-{id(doc)}" data-title="{html.escape(doc["title"])}">')
    content_html.append(f'<div class="doc-head"><span class="doc-badge badge-{GROUPS[doc["gi"]]["accent"]}">ARCHITECTURE FILE</span><h1>{html.escape(doc["title"])}</h1><p class="doc-path">{html.escape(doc["rel"])}</p></div>')
    content_html.append(doc["body"])
    content_html.append('</section>')

def json_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


INDEX_JSON = (
    "["
    + ",".join(
        '{"id":%d,"title":%s,"rel":%s,"group":%s}'
        % (
            id(d),
            json_str(d["title"]),
            json_str(d["rel"]),
            json_str(GROUPS[d["gi"]]["name"]),
        )
        for d in documents
    )
    + "]"
)


CSS = """
:root{--paper:#F4EFE6;--ink:#16140F;--yellow:#FFD839;--red:#FF4B33;--blue:#2B57FF;--green:#8CFF4D;--white:#fff;--muted:#6b675f}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--paper);color:var(--ink);font:16px/1.65 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
a{color:inherit}
.wrap{display:grid;grid-template-columns:320px 1fr;min-height:100vh}
nav.side{border-right:4px solid var(--ink);background:var(--white);padding:18px 14px;position:sticky;top:0;height:100vh;overflow-y:auto}
.brand{font:700 22px/1 Impact,'Arial Black',sans-serif;text-transform:uppercase;border:3px solid var(--ink);box-shadow:4px 4px 0 var(--ink);padding:10px 12px;background:var(--yellow);margin-bottom:14px}
.brand small{display:block;font:12px/1.4 ui-monospace,monospace;text-transform:none;color:var(--ink)}
#q{width:100%;border:3px solid var(--ink);padding:9px 10px;font-size:13px;background:var(--paper);margin-bottom:12px}
.nav-group{margin-bottom:14px}
.nav-group-title{font:11px ui-monospace,monospace;font-weight:700;letter-spacing:.12em;padding:4px 8px;border:2px solid var(--ink);margin-bottom:6px;background:var(--yellow)}
.nav-blue .nav-group-title{background:var(--blue);color:#fff}
.nav-green .nav-group-title{background:var(--green)}
.nav ul{list-style:none}
.nav li a{display:block;padding:5px 8px;font-size:13px;font-weight:600;text-decoration:none;border-left:3px solid transparent}
.nav li a:hover{background:var(--paper)}
.nav li a.active{border-left-color:var(--ink);background:var(--yellow)}
.nav .nav-subs{margin:2px 0 6px 14px}
.nav .nav-subs a{font-size:11.5px;font-weight:500;color:#4a463f;padding:3px 8px}
.nav .nav-subs a.active{background:var(--green)}
.hit{background:var(--red);color:#fff;padding:0 5px;font:11px ui-monospace,monospace;font-weight:700}
main{max-width:980px;padding:34px 40px 120px}
.doc{border:3px solid var(--ink);box-shadow:6px 6px 0 var(--ink);background:var(--white);padding:26px 30px;margin-bottom:38px}
.doc-head{border-bottom:3px solid var(--ink);padding-bottom:12px;margin-bottom:20px}
.doc-badge{display:inline-block;font:11px ui-monospace,monospace;font-weight:700;letter-spacing:.1em;border:2px solid var(--ink);padding:2px 8px;margin-bottom:8px}
.badge-red{background:var(--red);color:#fff}
.badge-yellow{background:var(--yellow)}
.badge-blue{background:var(--blue);color:#fff}
.badge-green{background:var(--green)}
.doc h1{font:600 26px/1.15 Impact,'Arial Black',sans-serif;text-transform:uppercase}
.doc-path{font:11px ui-monospace,monospace;color:var(--muted);margin-top:4px}
.doc h2{font:600 21px/1.2 Impact,'Arial Black',sans-serif;text-transform:uppercase;border-bottom:2px solid var(--ink);margin:30px 0 12px;padding-bottom:6px}
.doc h3{font-size:16px;font-weight:800;margin:22px 0 8px}
.doc h4{font-size:14px;font-weight:800;margin:18px 0 6px}
.doc p{margin:10px 0}
.doc ul,.doc ol{margin:8px 0 8px 22px}
.doc li{margin:4px 0}
.doc strong{font-weight:800}
.doc em{font-style:italic}
.doc code{font:12.5px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;background:var(--paper);border:1.5px solid var(--ink);padding:1px 5px}
.doc pre{background:var(--ink);color:var(--paper);padding:16px;margin:12px 0;overflow-x:auto;font:12.5px/1.5 ui-monospace,Consolas,monospace}
.doc pre code{background:none;border:none;color:inherit;padding:0}
.doc table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13px}
.doc th,.doc td{border:2px solid var(--ink);padding:7px 9px;text-align:left;vertical-align:top}
.doc th{background:var(--ink);color:var(--paper);font-weight:700}
.doc tr:nth-child(even) td{background:var(--paper)}
.doc blockquote{border-left:6px solid var(--red);background:var(--paper);padding:10px 14px;margin:12px 0}
.doc blockquote p{margin:4px 0}
.doc hr{border:none;border-top:3px dashed var(--ink);margin:24px 0}
.topbtn{position:fixed;right:22px;bottom:22px;border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);background:var(--yellow);font:700 13px ui-monospace,monospace;padding:9px 12px;cursor:pointer}
@media(max-width:900px){.wrap{grid-template-columns:1fr}nav.side{position:static;height:auto;max-height:46vh}main{padding:20px 14px}.doc{padding:18px}}
"""

JS = """
const index = __INDEX__;
const nav = document.querySelector('nav.side');
const sections = document.querySelectorAll('section.doc');
const q = document.getElementById('q');
let results = [];

function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function totalHits(t){return (t.match(/__HIT__/g)||[]).length;}

function renderResults(){
  const out = document.getElementById('results');
  if(!results.length){out.innerHTML='';return;}
  out.innerHTML = '<p class="hit">'+results.length+' 个文件命中</p><ul class="res-list">'+
    results.map(r=>'<li><button class="res" data-id="'+r.id+'">'+esc(r.group)+' — '+esc(r.title)+' <span class="hit">'+totalHits(r.html)+'</span></button></li>').join('')+'</ul>';
  out.querySelectorAll('.res').forEach(b=>b.onclick=()=>{
    const sec=document.getElementById('sec-'+b.dataset.id);
    sec.scrollIntoView({behavior:'smooth'}); highlight(b.dataset.id);
  });
}
function highlight(id){
  nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active', a.dataset.target===String(id) && !a.dataset.sub));
  document.querySelectorAll('a[data-sub]').forEach(a=>a.classList.remove('active'));
}
function doSearch(){
  const term=q.value.trim().toLowerCase();
  const out=document.getElementById('results');
  if(!term){results=[];out.innerHTML='';sections.forEach(s=>{s.style.display=''});return;}
  results=[];
  sections.forEach(sec=>{
    const txt=sec.innerText.toLowerCase();
    if(!txt.includes(term)){sec.style.display='none';return;}
    sec.style.display='';
    let html=sec.innerHTML;
    const re=new RegExp('('+term.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')+')','gi');
    html=html.replace(re,'<mark>\\\\$1</mark>');
    sec.innerHTML=html;
    results.push({id:sec.id.replace('sec-',''),title:sec.dataset.title,group:sec.dataset.group,html:html});
  });
  renderResults();
}
sections.forEach(s=>s.dataset.group=(document.querySelector('a[data-target="'+s.id.replace('sec-','')+'"]')||{}).closest('.nav-group').querySelector('.nav-group-title').textContent);
q.addEventListener('input',doSearch);
// scrollspy
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)highlight(e.target.id.replace('sec-',''))}),{rootMargin:'-30% 0px -60% 0px'});
sections.forEach(s=>spy.observe(s));
// sub-nav clicks
document.querySelectorAll('a[data-sub]').forEach(a=>a.addEventListener('click',()=>{
  const sec=document.getElementById('sec-'+a.dataset.target);
  const h2=[...sec.querySelectorAll('h2')].find(h=>h.textContent.trim()===a.dataset.sub);
  if(h2){h2.scrollIntoView({behavior:'smooth'});}
}));
"""

PAGE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HeadConan — 架构设计全量汇总（Architecture Zero）</title>
<style>__CSS__</style>
</head>
<body>
<div class="wrap">
<nav class="side" aria-label="文档目录">
  <div class="brand">HEADCONAN<small>Architecture Zero — 全量架构文档汇总</small></div>
  <input id="q" type="search" placeholder="搜索全部架构文档…（输入后高亮）" aria-label="搜索">
  <div id="results"></div>
  __NAV__
  <p style="font:11px ui-monospace,monospace;color:var(--muted);margin-top:10px">共 __COUNT__ 份文档 · 生成于 2026-08-29</p>
</nav>
<main>
  __CONTENT__
</main>
</div>
<button class="topbtn" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑ TOP</button>
<script>
const __INDEX__ = __INDEX_JSON__;
</script>
<script>__JS__</script>
</body>
</html>
"""

final_html = (
    PAGE.replace("__CSS__", CSS)
    .replace("__NAV__", "".join(nav_html))
    .replace("__CONTENT__", "".join(content_html))
    .replace("__INDEX__", INDEX_JSON)
    .replace("__INDEX_JSON__", INDEX_JSON)
    .replace("__JS__", JS)
    .replace("__COUNT__", str(len(documents)))
)

OUT.write_text(final_html, encoding="utf-8")
print(f"OK → {OUT}  ({OUT.stat().st_size/1024:.0f} KB, {len(documents)} docs)")
