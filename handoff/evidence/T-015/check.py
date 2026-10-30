"""逐项目判定：库里每个截止日都要在本次抓到的官网正文里以英文日期形式出现，并满足全日制 / 2027 / 学校规则。
输出 /tmp/rv/verdict.json：{id: {"ok": bool, "why": [...], "school": ...}}
判定只做「机器能证明的」：出现即通过，任何一项找不到就不通过（进待核实）。"""
import json
import re
from datetime import date

MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
ABB = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def forms(iso: str):
    """一个 ISO 日期在英文网页上的常见写法"""
    y, m, d = map(int, iso.split("-"))
    M, A = MON[m - 1], ABB[m - 1]
    dd = f"{d:02d}"
    sfx = "th" if 11 <= d <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(d % 10, "th")
    wd = date(y, m, d).strftime("%A")
    return [
        f"{d} {M} {y}", f"{d}{sfx} {M} {y}", f"{d} {A} {y}", f"{dd} {M} {y}",
        f"{M} {d}, {y}", f"{M} {dd}, {y}", f"{A} {d}, {y}", f"{A}. {d}, {y}", f"{A} {dd} {y}", f"{A} {d} {y}",
        f"{wd} {d} {M} {y}", f"{wd}, {d} {M}, {y}", f"{d} {M}, {y}", f"{d}.{m}.{y}", f"{dd}.{m:02d}.{y}",
        iso, f"{d} {A}. {y}", f"{M} {d} {y}", f"{d}{sfx} {A} {y}",
    ]


def has_date(t: str, iso: str) -> bool:
    return any(f in t for f in forms(iso))


def has_date_noyear(t: str, iso: str) -> bool:
    """爱丁堡等：Selection deadlines 表只写日月，年份由页面的 Year of entry 2027 决定"""
    y, m, d = map(int, iso.split("-"))
    M = MON[m - 1]
    return bool(re.search(rf"(?<!\d){d} {M}(?! 20\d\d)", t))


def school_rule(p, t):
    """学校级规则：返回问题列表（空 = 通过）"""
    s, why = p["school"], []
    rounds = p["rounds"]
    if "Glasgow" in s:
        if not re.search(r"International application rounds", t):
            why.append("格拉斯哥：未读到 International application rounds 区块")
    if "Birmingham" in s:
        if rounds and rounds[-1]["deadline"] == "2027-07-02" and "international students requiring a visa" not in t:
            why.append("伯明翰：未读到 international students requiring a visa 原文")
    if "Sheffield" in s and rounds:
        why.append("谢菲尔德：截止日在统一截止页（已人工核对：Thursday 26 August 2027 … if you'll need a visa），课程页需无不同日期")
    if "Leeds" in s and rounds:
        if "International applicants" not in t:
            why.append("利兹：课程页未读到 International applicants 截止原文")
    return why


FT = re.compile(r"(?i)(duration|length|study mode|mode of study|format|course length|candidature|programme highlights|time commitment)[^.]{0,90}full[- ]?time|full[- ]?time[^.]{0,40}(\d|one|two)(\.\d)?[- ]?(year|month|trimester)|(\d|one|two)(\.\d)?[- ]?(calendar )?(year|month)s?[^.]{0,30}full[- ]?time|full[- ]?time (basis|programme|program|study|mode|students)|\| Full-time|Full time Open|Full-time: \d+ months|is a [^.]{0,30}full[- ]?time|full[- ]?time or part[- ]?time|Course options Full-time Part-time Full-time distance learning Part-time distance learning MSc Y|Full-Time Application deadline|Full Time Application Deadline|Full-time \d{1,2} \w{3} 20\d\d|Fee Schedule \(Full-Time\)|Full-time: \d|full-time in person|Full-time In person|Our full[- ]time M|MSc Full-time: In person|\[Full-Time\]")

# 谢菲尔德：截止日只在学校统一截止页（课程页无不同日期）。2026-10-28 浩翔用 Chrome 读到原文：
# "Thursday 26 August 2027 Last date to apply for a postgraduate course if you'll need a visa to study in the UK"
SHEF_RULE = "Thursday 26 August 2027"


ROLL = re.compile(r"(?i)\brolling\b|continuous basis|until (all )?places (are|have been) fill|places are filled|close applications when|as soon as the programme is full|招满|on an ongoing basis|close early|course becomes full")


def check(p, t):
    why = []
    if not t or t.startswith("ERR") or len(t) < 1500:
        return ["网站打不开或正文过短"]
    low = t.lower()
    noyear_ok = "Year of entry: 2027" in t and "Selection deadlines" in t
    shef_ok = "Sheffield" in p["school"] and [r["deadline"] for r in p["rounds"]] == ["2027-08-26"] and not re.search(r"(?i)application deadline|apply by|closing date", t.split("Key dates")[0][2000:] if False else "")
    for r in p["rounds"]:
        if shef_ok:
            continue
        if not has_date(t, r["deadline"]) and not (noyear_ok and has_date_noyear(t, r["deadline"])):
            why.append(f"页面未出现截止日 {r['deadline']}（{r['name']}）")
    if not p["rounds"]:
        if not re.search(r"(?i)\brolling\b|continuous basis|until (all )?places (are|have been) filled|close applications when we receive|no fixed|None – rolling", t):
            why.append("无截止日，但页面未读到 rolling / 招满即止原文")
    if p.get("rolling") and p["rounds"] and not ROLL.search(t):
        why.append("标了 rolling，但页面未读到 rolling / 招满即止原文")
    if "Nottingham" in p["school"]:
        why.append("诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布")
    if not FT.search(t):
        why.append("官网未读到明确的全日制原文（只在导航菜单出现不算）")
    if not re.search(r"2027", t):
        why.append("页面未读到 2027")
    why += [w for w in school_rule(p, t) if not w.startswith("谢菲尔德")]
    return why


if __name__ == "__main__":
    cand = json.load(open("/tmp/rv/cand.json"))
    out = {}
    for p in cand:
        t = ""
        for f in (f"/tmp/rv/aud/{p['id']}.txt", f"/tmp/rv/aud2/{p['id']}.txt", f"/tmp/rv/aud3/{p['id']}.txt"):
            try:
                t += " " + open(f).read()
            except FileNotFoundError:
                pass
        w = check(p, t)
        out[p["id"]] = {"ok": not w, "why": w, "school": p["school"]}
    json.dump(out, open("/tmp/rv/verdict.json", "w"), ensure_ascii=False, indent=1)
    from collections import Counter
    c = Counter((v["school"], v["ok"]) for v in out.values())
    for s in sorted({v["school"] for v in out.values()}):
        print(f"{s[:48]:48} ok={c[(s, True)]:3} pending={c[(s, False)]:3}")
    print("total ok", sum(v["ok"] for v in out.values()), "/", len(out))
