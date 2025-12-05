# Strategy Inspiration Generator

A simple quote/image randomizer. No database needed.

---

## Setup

1. **Edit `index.html`** - Update the nav links (Newsletter, Website) to your URLs
2. **Deploy to Netlify** - Drag the entire folder to Netlify
3. **Done!**

---

## Adding Content

### Adding a Quote

Open `content.json` and add a new item to the `items` array:

```json
{ "type": "quote", "text": "Your quote here", "author": "Author Name" }
```

If there's no author, use an empty string:

```json
{ "type": "quote", "text": "Your quote here", "author": "" }
```

### Adding an Image

1. Put your image in the `images` folder (e.g., `images/my-image.jpg`)
2. Add an entry to `content.json`:

```json
{ "type": "image", "src": "./images/my-image.jpg", "caption": "Optional caption" }
```

---

## Example content.json

```json
{
  "items": [
    { "type": "quote", "text": "Culture eats strategy for breakfast.", "author": "Peter Drucker" },
    { "type": "quote", "text": "Simplify, then exaggerate.", "author": "" },
    { "type": "image", "src": "./images/inspiration-1.jpg", "caption": "Strategic framework" }
  ]
}
```

---

## Deploying Updates

### If using Netlify drag-and-drop:
Just drag the folder again. It will replace the old version.

### If connected to GitHub:
1. Edit `content.json` directly on GitHub, or
2. Push your changes from VS Code / terminal

Netlify will automatically rebuild when you push.

---

## File Structure

```
strategy-inspiration-generator/
├── index.html      ← The website
├── content.json    ← Your quotes and image references
├── images/         ← Put your images here
│   └── (your images)
└── README.md       ← This file
```

---

## Tips

- **Image size**: Keep images under 1MB for fast loading. Resize large screenshots.
- **Image format**: JPG for photos, PNG for screenshots with text
- **Backup**: Your `content.json` IS your database. Keep a copy somewhere safe.
- **JSON syntax**: Use a JSON validator (like jsonlint.com) if you get errors

---

## Connecting to GitHub (Optional but Recommended)

This lets you edit content from anywhere and keeps a backup.

1. Create a GitHub account if you don't have one
2. Create a new repository (e.g., "strategy-inspiration")
3. Upload these files to the repository
4. In Netlify, connect your site to the GitHub repo
5. Now: edit on GitHub → Netlify auto-deploys

---

That's it. No database. No Firebase. Just files.
