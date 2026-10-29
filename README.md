# SNES_Dex

**Dexter's Suspicious Stuff: The Long Way Home** — an offline-friendly SNES-style platform adventure starring Dexter, the furious little stinkweasel.

**Play:** https://westkitty.github.io/SNES_Dex/

Open \`index.html\` to play the standalone cartridge offline. It contains the complete game and requires no external libraries, accounts, trackers, or network calls.

## Adventure

Three side-scrolling stages (Lakeside Lap, Bramble Boardwalk, Pawprint Passage), jumping, hazards, barking, sniff-revealed bridges, checkpoints, collectibles, and a suspicion-ranking finale. Collect all three hidden Nose Stamps and solve the case to unlock the Golden Sock bonus level. The original 72-second Classic Case is preserved as a playable mode.

Ranger Trials let you race your own ghost, earn medals and pursue faster times. Trail Echo shows your previous failed route. Four original procedural chiptune arrangements accompany the stages. Ranger Replay Cartridges are optional manual JSON files for exporting runs or importing a visitor's ghost; they never unlock campaign content or save automatically.

## Controls

| Action | Keyboard |
|---|---|
| Move | A/D or left/right arrows |
| Jump | Space, W, or up |
| Sniff | X or K |
| Bark | Z or J |
| Pause / map | P or Escape |
| Toggle echo | E |
| Toggle music | M |

On-screen touch buttons and standard gamepad input are also available.

## Source and GitHub Pages

\`index.html\` is the exact playable **OMNI V** release, checked byte-for-byte before import. Pages serves \`main\` from the repository root.

The editable source lives in \`src/game.js\`, \`src/index.html\`, \`src/build.py\`, \`assets/\`, and \`original/\`. To rebuild from source:

\`\`\`sh
python3 src/build.py
cmp index.html Dexter_The_Long_Way_Home.html
\`\`\`

That comparison must match for this initial release. On intentional future changes, inspect and test the rebuilt output, then replace \`index.html\` with it before committing. No bundler or npm packages are required.

\`original/\` includes the source sprite art and preserved Classic Case. \`QA.md\`, \`OPERATIONAL_STATE.md\`, and \`RELEASE_NOTES.md\` document earlier verification and remaining device-test limitations. The development-only Playwright test harness is retained in the separate OMNI V full development archive, not in this minimal Pages repository.
