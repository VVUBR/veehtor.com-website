## Goal
Get the AdCoach interactive demo rendering inside the iframe on `/adcole` by hosting the real `adcoach-prototype.html` locally at `/adcoach-demo.html`.

## Why the current iframe is blank
The existing `public/adcoach-demo.html` only contains the `<head>` and CSS. The `<body>` markup and `<script>` were lost when the HTML was pasted into chat, so the iframe loads a page with no DOM to render.

## What I need from you
Upload the original `adcoach-prototype.html` file directly in the chat (drag-and-drop or attach). Do not paste it as text — pasting strips/garbles the markup, which is exactly how we got here.

The file will arrive at a `user-uploads://` path (e.g. `user-uploads://adcoach-prototype.html`).

## Steps I will run once the file is uploaded

1. **Copy the upload** to `public/adcoach-demo.html`, overwriting the broken file. Use `code--copy` so the binary/text content is preserved byte-for-byte (no re-typing, no re-formatting).
2. **Sanity-check the file** by reading the first and last ~30 lines to confirm it has a real `<body>...</body>` with the topbar, chat, side panel, composer, and the closing `<script>` / `</html>`.
3. **Leave `src/pages/Adcole.tsx` untouched.** The iframe already points to `/adcoach-demo.html` with the correct responsive heights (820px desktop, 1040px under 820px wide) inside the bordered, rounded, shadowed card. No code changes needed.
4. **Verify in the preview** at `/adcole`: the iframe should now render the full AdCoach UI — topbar with Online/Offline pill and language switcher, chat column with chips, right-side session panel, composer at the bottom.

## What I will NOT do
- Will not rebuild or reconstruct the demo from the broken paste.
- Will not host it on an external URL (Netlify, etc.) — you chose direct upload.
- Will not touch any other section of `/adcole`, the header, or the rest of the site.

Ready to run as soon as the file lands in the chat.