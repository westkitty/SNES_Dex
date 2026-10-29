# OPERATIONAL STATE — DEXTER / THE LONG WAY HOME

Project ID: `dexter-suspicious-stuff-platformer`. This is a bounded Classic Arcade expansion, not Dexter Desk Familiar, Dex_Pad, Westcat Goes East or any other project.

## Current source of truth

- Player artifact: `Dexter_The_Long_Way_Home.html` (standalone, offline, 384×216 main Canvas).
- Development sources: `src/game.js`, `src/index.html`, `src/build.py`. Assets in `assets/` and `original/`.
- Unmodified previous game: `original/Dexter_Classic_Investigation.html`, also embedded as selectable sandboxed Classic Case mode.
- Character: unmodified 192×160/22-frame 32×32/16-color Dexter sprite atlas. Title/result portrait extracted from original bright mockup. No unrelated dog substitution.

## Protected purpose and identity

A colorful, fully playable SNES-style Dexter 2D platformer: not a gallery, lore archive, cinematic mockup or unrelated universe. The playable hero must remain black/cream/tan long-haired Dexter with floppy ears and a scowl. Preserve the bright park mockup visual authority, original case evidence identities and their ranking (stick > leaf pile > paper). No Starsilk, spiders, external assets/dependencies, telemetry, cloud features, payment, login or recurring daily automation.

## Current gameplay

- Three stages: Lakeside Lap (1600 world px), Bramble Boardwalk (1760), Pawprint Passage (1870).
- Character movement: horizontal acceleration/drag, variable jump, coyote time, jump buffer, fixed-step simulation, camera tracking.
- Hazards: pits, patrolling acorns and garden gnomes; bark stun or stomp. Three hearts, checkpoints, respawn, retry, 72s per stage, stage clear, evidence ranking, replay.
- Mechanic: temporary sniff-revealed scent bridges. Sniff evidence at each goal, time/cooldown/sulk. Optional paw tokens. Original WebAudio-style procedural blips.
- Keyboard and touch with screen buttons; responsive portrait/landscape layouts. Sound/quality toggles, pause/resume, reduced motion.

## Evidence state

Verified in this runtime: deterministic physics-assisted complete three-stage win, keyboard controls, touch controls, optional original Classic Case, 21 bounded behavior regressions, no JavaScript errors or external requests in measured sessions, headless Chrome frame pacing sample.

Unknown: file:// browser policy on consumer devices, physical Android/iOS Safari, extended hardware memory/thermal measurements, live human completion. Do not report these as proven.

## Future work

If extending further, preserve all three stages, original case, and sprite lineage. Add mechanics as alternate routes or new levels rather than silently replacing a proven core journey. Re-test full platform physics route, Classic Case iframe, keyboard/touch, pause/restart, bridge expiration, ranking, console and network after any change.

## Current checked revision — OMNI uplift 2026-10-28

- Current build: `Dexter_The_Long_Way_Home.html`, rebuilt from `src/game.js`, `src/index.html`, `src/build.py` with Classic Case and original sprite unchanged.
- Three optional Nose Stamps: authored fixed locations for each stage, sniff-reveal timer, spatial collection, previous-stage continuity on retry, results summary. Extra signature scent-wave feedback and stage landmarks.
- Input sources keyboard, touch and gamepad are independent; edge-triggered standard Gamepad API route with rank selection. Controller-native hardware remains unverified.
- Repaired verified source drift: sticky Classic Back bar missing from source wrapper, reproduced as a navigation regression in Chromium. Source was updated to match the last known good visible behavior.
- Verified post-change: 21/21 original browser regression checks; 28/28 newly added OMNI checks; three-stage pilot complete; 0 page errors/network requests. `QA.md` contains matched rendering performance evidence and limitations.
- Future repairs must preserve all three stage layouts and win conditions, Classic Case, original Dexter sprite hashes, gamepad/keyboard/touch ownership, and stamp retry invariants. Add regression rows if changing input, sniffs, stages, result ranking, or the source-generation wrapper.

- Controller input isolation: the parent cartridge does not consume gamepad presses while Classic Case is visible. This is covered by two additional regression checks.


## Current checked revision — OMNI II, 2026-10-29

- Final artifact: `Dexter_Long_Way_Home_OMNI_II.html`, built from `src/game.js` and `src/index.html`. Main 3-stage campaign and original Classic Case are protected.
- The original three Nose Stamps now authorize exactly one optional fourth level, **Golden Sock Trail**, only after a perfect 3-object verdict. Original three-stage completion remains valid on its own; bonus is not forced into campaign progression.
- New bonus state: `state.stage===3`, `state.bonusCompleted`, `state.bonusTime`, `state.bonusPaws`, with independent `bonusclear` visual state. Bonus retry retains campaign Nose Stamps, while full replay clears all collectibles and score.
- The pause screen has a real path overview. Input routes to bonus: visible toolbar button, keyboard `B`, gamepad `X` (simulated API tested), or Canvas results button on mobile.
- Performance changes: landing collision no longer allocates spread platform lists per fixed step; expired particles compact in place; pit water no longer allocates a temporary gap list on each render.
- Final proof: previous 21/21 and 28/28 suites both pass; new 38/38 and 10/10 suites pass; deterministic main and bonus campaign paths clear. Matched render cost has stable p95, variable p99. All source and original character-asset hashes preserved in release package.
- Unverified: physical iOS/Android/Safari/gamepads, endurance, direct `file://` navigation (managed-browser policy blocks it).
- Guard against regressions: never fold optional Golden Sock route into mandatory three-stage evidence completion; never expose bonus before all three stamps AND correct ranking; keep Classic iframe navigation, no spiders, no Starsilk, and zero external dependencies.

## Current checked revision — OMNI III, 2026-10-29

- Authoritative source: `src/game.js`, `src/index.html`, `src/build.py`; output `Dexter_The_Long_Way_Home.html`, released as `Dexter_Long_Way_Home_OMNI_III.html`.
- Preserved original three-stage game, optional Golden Sock stage, Classic Case, 22-frame sprite assets, mission structure, gameplay controls, evidence names and ordering, three Nose Stamps, optional unlock rules, no network/storage dependencies.
- **New mechanic:** Trail Echo: prior fall/timeout path is sampled at fixed interval with a hard 470-sample cap. Visible as sparse pale tracks in world plus prior-route and fall-position markers on pause map. It does not change physics or progression. A same-stage retry preserves it; entering a new stage clears it. User can disable via E or toolbar.
- **New procedural music:** Four original WebAudio arpeggio themes (day, boardwalk, passage, secret) scheduled with a bounded lookahead in the existing RAF; no media files or new dependencies. Independent M and toolbar mute; no scheduling while not playing; node cleanup after playback. The prior SFX master button remains.
- **Actual repairs:** keyboard synonym handling now remembers physical pressed codes (e.g. D and Right simultaneous), instead of clearing a direction when either one is released; Golden Sock replay is available from its own victory state on keyboard B, simulated gamepad X, touch Canvas CTA, and toolbar. The original New Walk option remains.
- **Runtime asset optimization:** preserved original title portrait unchanged in `assets/title_dexter_full.png`; added `assets/portrait_runtime_indexed.png` for smaller embedded build. Exact original Classic and sprite SHA-256 locked in QA.
- **New verification:** all previous 97 checks plus 40 new checks passed, complete main and bonus physics run passed; two matched Chromium 1,400-render samples show no stable p95 regression, no proven device-FPS benefit. See QA.md.
- **Known unverified:** hardware touch/Safari/gamepad, audio output quality and background behavior across browsers, file navigation, prolonged endurance. Never claim these tested.
- **Future guard:** do not replace original Dexter sprite or bright lakeside identity. Recheck trail cap/reset, keyboard overlap, music mute/pause cleanup, bonus replay and strict unlock, Classic iframe, no network/storage with every material change. `comparison/OMNI_II.html` is a frozen rollback/benchmark reference, not the authoritative new source.

## Current checked revision — OMNI IV / Ranger Trials, 2026-10-29

- Authoritative source: `src/game.js`, `src/index.html`, `src/build.py`, deployed as the standalone `Dexter_Long_Way_Home_OMNI_IV.html`. The `comparison/OMNI_III.html` file is an immutable previous-release baseline.
- New optional, session-only `RANGER TRIALS` menu becomes available after the campaign ranking. Each original level can be replayed independently without changing its geometry, controls, evidence goals, 72-second timer, stage progression or the unlocked Golden Sock route.
- Successful stage routes are sampled from real production movement at ~155 ms intervals into at most 470 positions per level; a personal-best record displays as a translucent animated Dexter sprite with an ahead/behind distance indicator on trial replay. No localStorage/network submission, ghost collision or physics shortcut.
- Each trial finish awards Bronze/Silver/Gold based on completed evidence, paw tokens, no-fall status and a reachable timing threshold. Best times and best medals remain only in the current browser session. Trials can be selected by keyboard, touch, and standard gamepad simulation.
- Confirmed new integration defects found and repaired before release: retrying a trial no longer deletes campaign Nose Stamps, and an active/game-over trial has an `EXIT TRIAL` escape back to the original case results. Trial stage stamps cannot be duplicated. The saved case score, evidence order, stamps, verdict, bonus eligibility and stage ledger are restored after any trial exit.
- Protected invariants: original three-stage campaign and optional Golden Sock, original Classic Case, original 22-frame Dexter sprite sheet, bright lakeside style, keyboard/touch/gamepad controls, Trail Echo, procedural music, original secret unlock. Do not replace the working game with static mockup or add Starsilk/spiders/external assets or tracking.
- Fresh proof: all five earlier Playwright suites (137 assertions) and `src/qa_ranger_trials.py` (32 new checks) pass, plus `src/pilot.py` complete production-physics campaign. Previous bonus full-completion is covered by `src/qa_secret.py`, which traverses its production physics. Final matched OMNI III/IV Canvas microbench shows no stable p95 difference (0.3 ms); physical FPS not established.
- Unverified: physical Android/iOS/Safari/gamepads, long-session power/memory, actual sound quality, consumer `file://` behavior; no Git repository, CI or deployed URL was involved in the local artifact workflow.

## Current checked revision — OMNI V / Portable Ranger Replay, 2026-10-29

- Baseline verified against exact `comparison/OMNI_IV.html` SHA-256; new source is `src/index.html`, `src/game.js`, `src/build.py` with a standalone under 500KB. Legacy Classic HTML and 22-frame Dexter sprite atlas are unchanged; original bright park visual authority and case ranking remain locked.
- Ranger Replay Cartridge v1 is an explicit export/import system with bounded JSON records (<=130000 bytes) that adds no network or automatic storage. RESTORE merges per-course personal bests and medals, never campaign progress; INVITE A RIVAL keeps visitor replays in separate state. `state.trialGhostKind` distinguishes PB/visitor rendering and HUD. The optional demo file is a physics-recorded reference, not a human opponent.
- Repairs: keyboard stage-number shortcuts remain usable after selecting a guest from the focused desk; a recorded checkpoint return no longer fails validation merely for discontinuity, while unsupported teleports are rejected atomically. Copy-to-visitor and copy-to-self are distinct operations.
- Fresh verified checks: 21 `qa_extended`, 28 `qa_omni`, 38 `qa_secret`, 10 `qa_access`, 40 `qa_echo_music`, 32 `qa_ranger_trials`, 48 `qa_replay_cartridge`, 4 `qa_replay_respawn` = 221 checks in headless Chromium, plus `pilot` full three-stage campaign and the existing production-physics secret walkthrough. The imported guest uses a cached pixel-silhouette tint for improved readability and actually changes rendered pixels and is selected by real stage input. Browser download, clean restore, invalid-file rejection and mobile touch file chooser passed. No page JS errors or external requests observed.
- Matched render-cost proof: `src/bench_v5.py` compares frozen OMNI IV and OMNI V across 4 environments x 240 draws, twice. Baseline median 0.1ms/p95 0.3ms; revised median 0.1-0.2ms/p95 0.3ms, visitor ghost median 0.2ms/p95 0.3-0.5ms. p99 variable. This is render() only, not physical hardware FPS, power or thermal proof.
- NOT VERIFIED: direct browser `file://` launching (test policy restriction), real iOS Safari/Android/gamepad hardware, long-duration memory and thermal performance. No Git source repository exists in this artifact directory; no commits/push/CI/deployment claimed. Manual exported records are durable only if the user saves the downloaded file.
- Validation requirement for future changes: preserve v1 replay compatibility and atomic import validation, original campaign/bonus locks, Classic navigation, and test source+standalone parity. Offline and no-tracking invariants remain absolute.

## GitHub publication — 2026-10-29

- **Canonical repository:** `westkitty/SNES_Dex` (public).
- **Local Git checkout:** `/Users/andrew/Documents/SNES_Dex` on MacBook Air, isolated from other repositories.
- **Published entry point:** repository-root `index.html` on branch `main`.
- **GitHub Pages:** `https://westkitty.github.io/SNES_Dex/` (root of `main`, legacy branch build).
- **Initial publication commit:** `899fd8ff0f3edebceb6795b06e4f7ff8852210fc`.
- **Verified release SHA-256:** `1bc8a0f2e815f50c0b18e0b78a353d8878ee8cd107f11dd8708a5e61d6bed92b`. Local `index.html`, clean rebuilt output and HTTP 200 Pages response matched.
- **Source restoration:** `src/game.js`, `src/index.html` and embedded Classic Case were reconstructed from the byte-verified cartridge and compared against the preserved originals. Runtime images were decoded from the same cartridge.
- **Protected project identity:** `AGENTS.md` binds this workspace to `westkitty/SNES_Dex`.
- **Not verified by this publication check:** physical mobile browsers, real gamepad, long-duration performance, and an interactive hosted-browser playthrough. Pre-publication Chromium QA remains historical evidence, not a fresh hosted-runtime certification.
- **Deployment procedure:** rebuild `python3 src/build.py`, validate output, update root `index.html` when intentionally changed, commit and push `main`; confirm GitHub Pages built and the served game matches the commit.
