"""逐项目抓官网正文（用户 Chrome，展开折叠区；伯明翰选 China），存 /tmp/rv/aud/<id>.txt
可断点续跑：已抓到的跳过。用法：python audit.py [id_prefix ...]"""
import json
import os
import re
import sys
from playwright.sync_api import sync_playwright

OUT = "/tmp/rv/aud"
os.makedirs(OUT, exist_ok=True)
cand = json.load(open("/tmp/rv/cand.json"))
pref = tuple(sys.argv[1:])
todo = [p for p in cand if (not pref or p["id"].startswith(pref)) and not os.path.exists(f"{OUT}/{p['id']}.txt")]
if pref == ("REV",):
    todo = todo[::-1] if False else [p for p in cand if not os.path.exists(f"{OUT}/{p['id']}.txt")][::-1]
print("todo", len(todo))

EXPAND = """() => {
  document.querySelectorAll('details').forEach(d => d.open = true);
  document.querySelectorAll('[style*="display: none"], [hidden]').forEach(e => { e.style.display = 'block'; e.hidden = false; });
  document.querySelectorAll('[aria-expanded="false"]').forEach(e => { try { e.click() } catch (x) {} });
}"""

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:9222")
    pg = b.contexts[0].new_page()
    for x in todo:
        if os.path.exists(f"{OUT}/{x['id']}.txt"):
            continue
        t = ""
        for attempt in range(3):
            try:
                pg.goto(x["officialUrl"], timeout=60000, wait_until="domcontentloaded")
                pg.wait_for_timeout(7000)
                if "birmingham.ac.uk" in x["officialUrl"]:
                    s = pg.query_selector("#countryDropdownApplicationProcess")
                    if s:
                        opts = s.eval_on_selector_all("option", "os=>os.map(o=>o.textContent.trim())")
                        s.select_option(label=[o for o in opts if o.startswith("China")][0])
                        pg.wait_for_timeout(2500)
                pg.evaluate(EXPAND)
                pg.wait_for_timeout(1500)
                t = re.sub(r"\s+", " ", pg.evaluate("document.body.innerText"))
                # 隐藏块 innerText 读不到时补 textContent
                t2 = re.sub(r"\s+", " ", pg.evaluate("document.body.textContent"))
                t = t + " ||TEXTCONTENT|| " + t2
                if "Just a moment" in t[:500] or "请稍候" in t[:500]:
                    pg.wait_for_timeout(8000)
                    continue
                break
            except Exception as e:
                t = f"ERR {str(e)[:120]}"
                pg.wait_for_timeout(6000)
        open(f"{OUT}/{x['id']}.txt", "w").write(t)
        print(f"{x['id']:24} {len(t)}", flush=True)
    pg.close()
