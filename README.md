# FB Feed Lock

A tiny Chrome extension that stops you from mindlessly scrolling Facebook.

**Made by Rl** · GitHub: [github.com/leox12x](https://github.com/leox12x)
Repo: [github.com/leox12x/fb-feed-lock](https://github.com/leox12x/fb-feed-lock)

## What it does
- Blocks scrolling on the Facebook home page (mouse wheel, touch swipe, arrow keys, PageUp/Down, spacebar).
- Hides the home feed behind a 🔒 lock screen so you don't see posts.
- Everything else still works: Messenger, search, your profile, groups, etc.
- It only activates on the home page (`/`, `/home.php`). Leave home and it unlocks automatically.

## Install (load unpacked)
1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this folder

## Files
- `manifest.json` — MV3 manifest
- `content.js` — lock logic + scroll blocking
- `lock.css` — lock screen styling
- `icon.png` — toolbar icon

## Notes
Personal-use project. No data leaves your browser.
