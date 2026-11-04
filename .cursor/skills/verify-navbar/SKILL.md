---
name: verify-navbar
description: Build and drive bootstrap-navbar's real desktop and mobile navigation sample before changes to markup, dependencies or collapse behavior.
---
# Verify Bootstrap Navbar
## Surface and isolation
Five-file StackBlitz-derived Bootstrap4 sample. Its visible feature is a responsive navbar; links intentionally point to #, not implemented pages. Use an owned local production preview; no login or remote shared data needed.
## Launch
Use Node22.12+ for the pinned verification tooling. Run npm ci, npm run build, then npm run preview -- --port 5198. Prefer an unused port and pass its actual URL via --base. Keep the preview PID/process group so cleanup only stops that instance. Ready means HTTP200 and navbar renders, not merely an empty HTML file.
## Doctor
`node .cursor/skills/verify-navbar/helpers/drive.mjs doctor --base http://127.0.0.1:5198/ --width 390 --out .verification-evidence/doctor`
Checks target title,200, actual nav and exactly Home/About/Contact, with no pageerrors. Run at each fresh instance and after surprises.
## Drive
Run `node .cursor/skills/verify-navbar/helpers/drive.mjs drive --base http://127.0.0.1:5198/ --width 390 --out .verification-evidence/mobile`, then repeat with --width 1365 and a desktop evidence directory. Puppeteer-core uses CHROME_PATH or /usr/bin/google-chrome. Install a compatible Chrome separately if missing.
## Evidence
Mobile asserts initially collapsed, toggle opens menu and aria-expanded true, toggle closes. Desktop asserts visible links and hidden toggle. Both capture actual screenshots and retained JSON, including errors/action states. Inspect pixels for clipping and readability. Link destination semantics are checked as placeholders; no routing claim is made.
## Cleanup
Helper always closes its own browser. Stop only the preview PID/process group you started. Keep JSON/screenshots after cleanup; node_modules/dist are ignored, evidence is not deleted. No user history or services touched.
## Helpers
Executable helpers/drive.mjs supports doctor/drive, --base, --width and --out. No internal setters or DOM mutation used for interactions. Maintain features/README.md as the sample changes.
