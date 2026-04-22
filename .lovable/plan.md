

# Fix Favicon on Score de Crédito Page

## Problem
The static HTML file at `public/score-dcarvalho.html` has no favicon link, so the browser shows the default Lovable icon instead of the custom Veehtor icon.

## Fix
Add the same favicon `<link>` tag from `index.html` into the `<head>` of `public/score-dcarvalho.html`:

```html
<link rel="icon" type="image/x-icon" href="https://storage.googleapis.com/gpt-engineer-file-uploads/PZFzXGxeCrhHu0WFCWbmSBvahVJ2/uploads/1763100853834-1.png">
```

This is inserted after the existing `<title>` tag on line 5. One line added, no other changes.

