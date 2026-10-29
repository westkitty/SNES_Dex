# OMNI III — The Walk Remembers

2026-10-29 | New local build derived from the verified OMNI II standalone.

- Added optional **Trail Echo**, drawn in the actual platformer after a fall or timeout, with route/failure evidence on the Ranger Trail Map. The trace is bounded, stage-local, and session-only.
- Composed four small original WebAudio chiptune patterns, one per stage identity, with pause/mute handling and a light final-seconds pulse. Added an independent MUSIC control.
- Fixed simultaneous-keyboard-alias release errors. Holding D and Right then releasing either still keeps movement active while the other is held; likewise for jump aliases.
- Repaired replay friction after the Golden Sock ending: secret reruns are available directly through keyboard B, gamepad X, touch Canvas CTA, and the secret toolbar button.
- Replaced only the runtime portrait representation with a 256-color optimized PNG, preserving the original portrait as well as original sprites and Classic Case byte-for-byte. The final self-contained HTML shrank by 83,182 bytes (~16.8%).
- Preserved all four stages, original campaign ranking, optional secret unlock, physics, enemies, sound toggle, gamepad mapping, stage maps, hidden stamps, and SNES-style art direction.
- Validation: 97/97 prior checks plus 40/40 new checks; production simulation traverses all three original stages; automated production-physics bonus run reaches its distinct ending.
- Two matched Chromium render-call benchmark rounds show no supported general speedup or consistent p99 change; median/p95 remain comparable to OMNI II.

All claims are limited to the inspected artifact and available browser/runtime. No Git push or deployment was performed.

## OMNI IV — Ranger Trials (2026-10-29)

Added a genuinely replayable three-stage personal-best challenge using the existing platformer physics: an animated recorded Dexter ghost, live distance split, stage cards with personal bests, timed clean-run medals, and session-only records. Reuses the original player sprite, scenery, collision system and evidence-sniff objectives. No new mandatory content or hidden secret bypass.

Fixed two real state-boundary defects during QA: stage retries inside trials could accidentally remove campaign Nose Stamps; and trials lacked a non-destructive escape. Both now have browser regression tests. Kept the 72-second stage timer, Classic Case, 22-frame character atlas, Golden Sock unlock, controls, Trail Echo and procedural music intact.

Verification: 169 Playwright assertions across six suites; full three-stage and secret-stage production movement passes; matched Chromium render cost shows no stable p95 change. No internet request or JavaScript page exception in observed sessions. Physical-device performance, `file://` browser behavior and hardware gamepad testing are still unverified; no remote deployment or Git mutation was performed.

## OMNI V — Portable Ranger Replay (2026-10-29)

The Ranger Trials ghost is now manually exportable and importable as a strict JSON recording. A visitor can be raced in the actual existing levels without adopting their score or unlocking the Golden Sock trail. Personal-best runs and medals can instead be restored deliberately, without auto-persistence. The cartridge desk stays collapsed until needed. Desktop, 320px touch, keyboard, browser download, and malformed-file behavior are tested.

Confirmed repairs: (1) global keyboard routing initially blocked stage-selection digits when the new replay desk retained focus; the focused-control guard now preserves native desk interaction while allowing trial digit shortcuts; (2) the first JSON validator rejected authentic post-respawn ghost paths; it now permits a known checkpoint/start return only when supported by the recording's actual fall count and stage ground. These have targeted regression checks. No changes were made to core movement physics, stage geometry, the three original suspects, bonus eligibility, or the unchanged Classic Case source.

Original stage files and past OMNI IV build are preserved. The new standalone remains under 500,000 bytes. Matched Chromium Canvas microbench shows roughly 0.1-0.2 ms median and 0.3 ms p95 per render for OMNI V vs 0.1/0.3 ms for OMNI IV; no universal FPS claim. Import parsing is on explicit user action, never in the render loop.

Visual finishing: a cached 16-bit gold/cyan silhouette rim now makes visitor and PB replays readable over foliage with no shader dependency. Low-effects and reduced-motion modes reduce the number of silhouette passes.
