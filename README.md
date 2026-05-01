# Hades Tour PWA

A countdown to Melanie Martinez's Hades Tour, August 14 in Inglewood — installable as a home screen app on iOS and Android.

## Files

```
hades-tour-pwa/
├── index.html              ← the app
├── manifest.json           ← PWA metadata (name, icons, display mode)
├── sw.js                   ← service worker (offline cache)
├── icons/
│   ├── apple-touch-icon.png    (180×180, iOS)
│   ├── icon-192.png            (192×192, Android)
│   ├── icon-512.png            (512×512, Android)
│   └── icon-maskable-1024.png  (1024×1024, adaptive)
└── README.md
```

## Deploying

This needs to be served from a real URL over HTTPS for service workers and home-screen install to work. Easiest options:

### Netlify Drop (fastest, ~30 seconds)
1. Go to https://app.netlify.com/drop
2. Drag the entire `hades-tour-pwa` folder into the drop zone
3. Get a URL like `https://random-name.netlify.app`
4. Open on iPhone Safari → Share → Add to Home Screen

### GitHub Pages
1. Push the folder contents to a repo
2. Settings → Pages → Deploy from main branch
3. Use the `username.github.io/repo-name` URL

### Existing host
Upload all files to any HTTPS web server, preserving the folder structure. The relative paths in manifest.json and sw.js mean it can live at any path (e.g. `elementsofchess.com/hades/`).

## Installing on iPhone

1. Open the URL in **Safari** (not Chrome on iOS — Add to Home Screen only works in Safari)
2. Tap the Share icon (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right
5. The Hades Tour icon now lives on her home screen and launches fullscreen

## Installing on Android

1. Open the URL in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"

## Offline support

After the first visit, the service worker caches everything. The app will load and run even with no network connection.
