# OMNI III — Validation and Quality Certificate

**Artifact:** `Dexter_Long_Way_Home_OMNI_III.html` / source `Dexter_The_Long_Way_Home.html`.
**Baseline:** exact previous OMNI II standalone, preserved at `comparison/OMNI_II.html`.
**Runtime:** Chromium headless through Python Playwright with HTML loaded by `page.set_content`; this environment blocks `file://` browser navigation. Core game resolution 384×216 with nearest-neighbor display.

## Final verified tests

| Test suite | Result | What it proves |
|---|---:|---|
| `qa_extended.py` | 21/21 PASS | Original keyboard/touch, Classic Case, stage retry, enemies, ranking, pause, requests |
| `qa_omni.py` | 28/28 PASS | Nose Stamp acquisition, gamepad API simulation, input ownership, source fixes |
| `qa_secret.py` | 38/38 PASS | Strict optional-secret unlock, both sniff crossings, Golden Sock, timeouts, mobile |
| `qa_access.py` | 10/10 PASS | Secret entry across controls, stress-bounded particles, responsive layout |
| `qa_echo_music.py` | 40/40 PASS | Echo lifecycle and pixels, pause-map traces, music scheduling, multi-key and bonus replay |
| `pilot.py` | COMPLETE | Real `update(1/60)` traversal of all three original stages, ending in correct verdict |
| `capture_live_bonus.py` | COMPLETE | Real production movement/collision traversal of Golden Sock route; 61s remaining, 3 bonus paws |
| `node --check src/game.js` | PASS | JavaScript syntax |

Total bounded browser assertions: **137/137 PASS** (they vary in scope; the number is not 137 full game playthroughs). Page exceptions: **0 observed**. External HTTP requests: **0 observed**. Mobile tests used browser touch emulation, not physical hardware. Gamepad tests used a simulated standard Gamepad API object, not a real controller.

## Performance — matched, non-overclaimed

Two same-process headless Chromium comparisons, the same 384×216 canvas, four stage scenarios, **1,400 `render()` samples per artifact per run**:

| Run | Artifact | Median | p95 | p99 |
|---|---|---:|---:|---:|
| 1 | OMNI II | 0.1 ms | 0.4 ms | 10.4 ms |
| 1 | OMNI III | 0.1 ms | 0.3 ms | 10.1 ms |
| 2 | OMNI II | 0.1 ms | 0.3 ms | 10.4 ms |
| 2 | OMNI III | 0.2 ms | 0.4 ms | 11.7 ms |

**Interpretation:** No reproducible steady-render regression at these percentiles; no supported blanket FPS improvement. These are sampled synchronous Canvas `render()` call costs, **not** a measurement of complete device frame times, full audio CPU load, battery, or long-session stability. An echo drawing stress scenario also passed without errors. Timed note scheduling is bounded, runs from the existing requestAnimationFrame loop, and releases finished WebAudio oscillator/gain nodes through `onended`.

## Size, source, and fidelity

The standalone byte count is **411,300 bytes**, against **494,482 bytes** for OMNI II: **83,182 bytes smaller** while retaining original animated sprites. A 256-color indexed rendering derivative of the title portrait accounts for most of the reduction; the untouched 78,022-byte source portrait remains in the development ZIP. All required game images and code are still embedded as local data in a single HTML.

Original exact-byte locks:
- Classic Case HTML SHA-256: `fa92f23fd442a728aa79e032a231fdb550339b8de48bfc8020cb99e49916b66c`
- 22-frame Dexter sprite PNG SHA-256: `0c5083b13b2f2d61e72e5cd1249645dd6cf9f8283cacabbc37336719f4e789a5`

## Quality gate / outstanding evidence debt

| Dimension | State | Grounding |
|---|---|---|
| Core arcade gameplay and protected identity | PASS | Full original campaign, preserved sprite+Classic hashes |
| New trace interactions and recovery path | PASS | Live world pixel diff, map screenshots, retry and timeout checks |
| Offline single-file delivery, no external dependencies | PASS in inspected runtime | Exact embedded HTML and observed request log |
| Accessible touch controls and responsive screen widths | PARTIAL | Emulated touch and 360px viewport passed; physical devices untested |
| Original music and sound lifecycle | PARTIAL | WebAudio starts in Chromium; no speaker/audio-quality or Safari validation |
| Physical performance, battery, thermals | UNVERIFIED | Only browser render-call measurements available |
| Native file navigation and broad Safari/Android compatibility | UNVERIFIED | Managed Chromium blocks `file://` |

**Verdict:** A tested, improved browser cartridge with declared hardware-validation debt—not a certified cross-device commercial release. No effect, feature, or result is claimed solely because it appears in source.

## OMNI IV — Ranger Trials forensic/verification addendum

**Target:** `Dexter_The_Long_Way_Home.html`, built from `src/` and delivered as `Dexter_Long_Way_Home_OMNI_IV.html`. **Frozen baseline:** `comparison/OMNI_III.html`.

**New functionality:** three individually replayable stage trials, production-movement ghost from a prior successful stage, session-only bests and medals, clean case restore, keyboard/DOM/touch/gamepad navigation. No new mandatory stages; original secret access condition remains three Nose Stamps + correct verdict.

**Repairs, causal evidence and regressions:**

- QQQ-1: Trial retry previously called the campaign's `restartStage`, which filtered `stageDiscoveries` against the trial stage index; this could delete a later campaign stamp. A trial-scoped retry now bypasses campaign discovery/paw filtering and does not regenerate collectible stamps. Tested with all three stamps present across game-over and retry.
- QQQ-2: A trial could not be abandoned without overwriting campaign progress. An `EXIT TRIAL` toolbar control now returns to the original case from active play, pause or game over. A state snapshot restores original evidence, score, stamps, verdict, bonus status and stage ledger. Tested with a live stage, trial completion, game-over and touch exit.
- QQQ-3: Successful recorded routes are real `update(STEP)` movement samples, capped at 470 per current route and best; ghost alters rendered pixels (measured pixel difference), and does not influence physics. First campaign creates three real records; trial completed using production physics awarded a Gold medal.

**Final test matrix, Chromium via Playwright on exact standalone HTML bytes:**

| Suite | Evidence |
| --- | --- |
| `qa_extended.py` | 21/21 PASS |
| `qa_omni.py` | 28/28 PASS |
| `qa_secret.py` | 38/38 PASS, including production-physics Golden Sock route |
| `qa_access.py` | 10/10 PASS |
| `qa_echo_music.py` | 40/40 PASS |
| `qa_ranger_trials.py` | 32/32 PASS, including production-physics three-stage completion + actual Ranger trial |
| `pilot.py` | Main campaign completed with original correct verdict |
| JavaScript source | `node --check src/game.js` passed |

Total bounded browser checks: **169/169**; these are not 169 human playthroughs. No JavaScript page errors or external HTTP requests observed in the checks. Mobile proof is emulated touch at 320px, not physical hardware.

**Matched render-call microbenchmark** (Chromium headless, 384x216 Canvas, 960 samples per artifact per run over four scenes):

| Run | OMNI III median / p95 / p99 | OMNI IV median / p95 / p99 |
| --- | --- | --- |
| 1 | 0.1 / 0.3 / 9.6 ms | 0.1 / 0.3 / 9.3 ms |
| 2 | 0.1 / 0.3 / 9.9 ms | 0.1 / 0.3 / 9.5 ms |

Ghost-active sampled median/p95 approximately 0.1/0.3 ms in matched tests; p99 fluctuated. These are direct `render()` call costs, not complete frame time, device FPS, battery or thermal proof. No blanket performance-speedup claim is warranted. User-facing artifact remains under 500,000 bytes.

**Remaining proof debt:** physical hardware input/Safari/Android performance, direct local-file launch and long-session stability are unverified. Git/commit/push/CI/deployment are not applicable to this artifact-root workflow. The ZIP contains reproducible source and frozen rollback reference.

## OMNI V — Portable Ranger Replay verification, 2026-10-29

Source: `src/game.js`, `src/index.html`, `src/build.py`; release target: `Dexter_The_Long_Way_Home.html`.

Final Chromium suites from exact built HTML: qa_extended 21/21; qa_omni 28/28; qa_secret 38/38; qa_access 10/10; qa_echo_music 40/40; qa_ranger_trials 32/32; qa_replay_cartridge 48/48; qa_replay_respawn 4/4. Total 221/221 independent bounded assertions, **not human playthroughs**. `pilot.py` additionally traversed all three campaign stages and filed the correct verdict. The existing secret-stage QA traversed the Golden Sock physics. Page errors and external requests were absent in measured tests.

End-to-end new evidence: a real Blob browser download produced the exact serialized route file; two fresh browser pages restored self or loaded rival using a native file chooser; the guest route rendered into the playable scene; prior campaign state and lock semantics were preserved; invalid version, time, coordinates, teleport, oversized data, medals and non-JSON files were rejected without destroying prior good state; 320px mobile touch menu and import worked. A production route with an actual respawn was accepted, while the same route falsely claiming zero falls was rejected.

Matched Chromium headless Canvas `render()` microbenchmark `src/bench_v5.py`, 960 samples per release per run: OMNI IV 0.1ms median/0.3ms p95 for two runs; OMNI V 0.2/0.3 and 0.1/0.3ms. Imported ghost active 0.2ms median, p95 0.3-0.5ms. No verified full-frame FPS, physical device, battery, thermals or long-session stability. No universal speedup claim.

The optional demo replay file in the release is generated via `src/make_demo_replay.py` using actual production `update(STEP)` and verified with the same import validator. This does not simulate a human runner. No external libraries are required **to play**, but Python Playwright is used for development-time tests and demo regeneration.
