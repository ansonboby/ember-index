#!/usr/bin/env bash
# One-take demo recording of Ember Index with visible cursor.
# Logs beat timestamps to /tmp/opencode/demo-beats.log for caption timing.
set -e
cd "/home/anson/nasa space app challage"
AB="npx -y agent-browser"
LOG=/tmp/opencode/demo-beats.log
: > "$LOG"
beat() { echo "$(date +%s.%N) $1" >> "$LOG"; }

S=$($AB session id --scope worktree --prefix demo 2>/dev/null | tail -1)
echo "session: $S"
run() { $AB "$@" --session "$S" > /tmp/opencode/ab-last.txt 2>&1; }

run open http://localhost:3311
run set viewport 1920 1080
run wait --text "Ember Index"
sleep 3

SNAP=$(run snapshot -i; cat /tmp/opencode/ab-last.txt)
# this CLI version prints refs as [ref=eN]; click takes @eN
ref_for() { echo "$SNAP" | grep -m1 "$1" | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2; }

ISS=$(echo "$SNAP" | grep -m1 'ISS · 21%' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
MOON=$(echo "$SNAP" | grep -m1 'Moon Base · 32%' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
T_EXPLORE=$(echo "$SNAP" | grep -m1 'button "Explore"' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
T_SIM=$(echo "$SNAP" | grep -m1 'button "Simulator"' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
T_COMPARE=$(echo "$SNAP" | grep -m1 'button "Compare"' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
T_ABOUT=$(echo "$SNAP" | grep -m1 'button "About"' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
echo "refs: iss=$ISS moon=$MOON explore=$T_EXPLORE sim=$T_SIM compare=$T_COMPARE about=$T_ABOUT"

mkdir -p demo
(run record stop || true); sleep 1
run record start demo/demo-video.mp4 --cursor --fps 30
sleep 2

# Beat 1: hero on Moon Base default
beat "hero"
sleep 5

# Beat 2: switch ISS then back to Moon Base — watch ranking reorder
run click "@$ISS"
beat "iss"
sleep 4
run click "@$MOON"
beat "moon"
sleep 4

# Beat 3: envelope chart
run scroll down 560; sleep 2
run scroll down 120
beat "envelope"
sleep 4

# Beat 4: ranked list
run scroll down 520; sleep 1
run scroll down 260
beat "ranking"
sleep 4

# Beat 5: Explore + open BASS card
run scroll up 2500; sleep 1; run click "@$T_EXPLORE"; run wait --text "Burning and Suppression of Solids"; sleep 2
SNAP2=$(run snapshot -i; cat /tmp/opencode/ab-last.txt)
BASS=$(echo "$SNAP2" | grep -m1 'Burning and Suppression of Solids – I' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
echo "bass ref: $BASS"
run click "@$BASS"; run wait --text "Plexiglas"
beat "explore"
sleep 2
run scroll down 320; sleep 5

# Beat 6: Simulator demo run
run scroll up 2500; sleep 1; run click "@$T_SIM"; run wait --text "Run mission"; sleep 2
SNAP3=$(run snapshot -i; cat /tmp/opencode/ab-last.txt)
DEMOBTN=$(echo "$SNAP3" | grep -m1 'Run demo scenario' | grep -o 'ref=e[0-9]*' | head -1 | cut -d= -f2)
echo "demo btn ref: $DEMOBTN"
run click "@$DEMOBTN"; run wait --text "Safety case"
beat "simulator"
sleep 3
run scroll down 300; sleep 6

# Beat 7: Compare
run scroll up 2500; sleep 1; run click "@$T_COMPARE"; run wait --text "Hardware genealogy"
beat "compare"
sleep 3
run scroll down 420; sleep 4

# Beat 8: About
run scroll up 2500; sleep 1; run click "@$T_ABOUT"; run wait --text "What Ember Index is"
beat "about"
sleep 3
run scroll down 380; sleep 4

sleep 2
run record stop
echo "--- recording done"
tail -2 /tmp/opencode/ab-last.txt
cat "$LOG"
