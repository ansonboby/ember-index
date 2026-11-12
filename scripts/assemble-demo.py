#!/usr/bin/env python3
"""Assemble the final demo video: beat-timed caption overlays + freeze end card."""
import subprocess, json, os

ROOT = "/home/anson/nasa space app challage"
RAW = f"{ROOT}/demo/demo-video.mp4"
OUT = f"{ROOT}/demo/demo-final.mp4"
LOG = "/tmp/opencode/demo-beats.log"
FONT = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"

beats = []
for line in open(LOG):
    t, name = line.split(None, 1)
    beats.append((float(t), name.strip()))

# Video t=0 ≈ 2.5s before the "hero" beat (record start + sleep 2 + call latency).
t0 = beats[0][0] - 2.5
rel = [((t - t0), n) for t, n in beats]

dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries",
    "format=duration", "-of", "csv=p=0", RAW], capture_output=True, text=True).stdout.strip())
pad = 9.0
end = dur + pad

caps = [
    ("hero",      0.8, "In freefall, fire becomes a sphere.\nNASA has 20 years of data on it — scattered."),
    ("iss",       None, "Pick your mission. ISS: 21% O₂, sea-level air."),
    ("moon",      None, "Moon Base: 32% O₂ at 10.2 psi —\n40%+ more oxygen than Earth.\nWatch the evidence re-rank."),
    ("envelope",  None, "Every bar is a test NASA actually flew.\nThe crosshair is your mission.\nWhite space = missing evidence."),
    ("ranking",   None, "Transparent scoring — every card shows\nits own breakdown. No black box."),
    ("explore",   None, "Every attribute links to its NASA PSI record,\nwith DOI. Validity you can audit."),
    ("simulator", None, "Play the problem: budget materials, detection,\nsuppression. Every rule cites its experiment."),
    ("compare",   None, "Shared hardware, shared ducts —\ncompare everything side by side."),
    ("about",     None, "Honest limits. Verified sources.\nThis is decision support, not a black box."),
]

# attach each caption to its beat time; last one runs into the freeze pad
windows = []
for i, (name, fixed_start, text) in enumerate(caps):
    start = fixed_start if fixed_start is not None else dict((n, t) for t, n in rel)[name]
    endt = rel[i + 1][0] if i + 1 < len(rel) else dur + 0.8  # last caption ends when the end card starts
    windows.append((start, min(endt, end), text))
windows.append((dur + 0.8, end, "Ember Index\ngithub.com/ansonboby/ember-index  ·  ember-index.vercel.app\nBuilt for NASA Space Apps 2026 — Flame in Freefall"))

filters = []
for i, (a, b, text) in enumerate(windows):
    capfile = f"/tmp/opencode/cap{i}.txt"
    # drawtext chokes on some non-ASCII glyphs; keep captions ASCII-safe,
    # and escape % (this ffmpeg build expands bare % in textfile content)
    text = (text.replace("₂", "2").replace("—", "-").replace("·", "-"))
    text = text.replace("%", "\\%")
    with open(capfile, "w", encoding="utf-8") as f:
        f.write(text)
    filters.append(
        f"drawtext=fontfile={FONT}:textfile={capfile}:fontsize=38:line_spacing=14:"
        f"fontcolor=white:borderw=2:bordercolor=black@0.7:box=1:boxcolor=black@0.45:boxborderw=18:"
        f"x=(w-text_w)/2:y=h-260:enable='between(t,{a:.2f},{b:.2f})'"
    )

vf = "tpad=stop_mode=clone:stop_duration=%.1f," % pad + ",".join(filters)
cmd = ["ffmpeg", "-y", "-i", RAW, "-vf", vf, "-an",
       "-c:v", "libx264", "-crf", "22", "-preset", "medium", "-pix_fmt", "yuv420p", OUT]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode != 0:
    print(r.stderr[-1500:])
    raise SystemExit(1)
d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
    "-of", "csv=p=0", OUT], capture_output=True, text=True).stdout.strip()
size = os.path.getsize(OUT) / 1e6
print(f"OK: {OUT} — {d}s, {size:.1f} MB")
for a, b, t in windows:
    print(f"  {a:6.1f}–{b:5.1f}  {t.splitlines()[0][:60]}")
