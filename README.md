# AI Consulting Landing Page

A high-converting, light-theme landing page for an AI consulting practice focused on AI Audit → AI Roadmap & Implementation (agents, workflows).

## Features

- ✅ **Results-based messaging**: Headlines focused on 90-day ROI
- ✅ **Social proof**: Early stat badges and case studies
- ✅ **Problem ↔ Solution adjacency**: Side-by-side pain points and solutions
- ✅ **Simple 3-step process**: Clear path from Audit to Implementation
- ✅ **Transparent pricing**: $4,000 fixed-price AI Audit prominently displayed
- ✅ **Single clear CTA**: "Get your AI Audit" throughout the page
- ✅ **Light theme**: White background, dark text, cyan accent (#0ea5e9)
- ✅ **Creative animations**: Split-text hero, count-up stats, aurora background, glare effects
- ✅ **Content-driven**: All copy loaded from `content.json` for easy updates
- ✅ **Performance optimized**: Lazy loading, smooth animations, accessible
- ✅ **Mobile responsive**: Sticky FABs, mobile menu, touch-friendly

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Content-driven**: Fetches from `/public/content.json`

## Getting Started

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:8080` to view the site.

### Production Build

```bash
npm run build
```

The optimized static files will be in the `dist/` folder, ready for deployment to any static hosting (GitHub Pages, Netlify, Vercel, etc.).

## Content Management

All page content is managed through `/public/content.json`. Edit this file to update:

- Personal information (name, email, phone, calendar link)
- Hero headline and messaging
- Services, pricing, and deliverables
- Case studies and outcomes
- FAQ items
- Social proof stats
- And more...

The React app fetches this JSON on load and hydrates all sections. If the fetch fails, fallback content is displayed.

## Deployment

### GitHub Pages

1. Update `vite.config.ts` with your repo name:
   ```ts
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. Build and deploy:
   ```bash
   npm run build
   gh-pages -d dist
   ```

### Other Static Hosts

Simply upload the contents of the `dist/` folder after running `npm run build`.

## Animations

The site includes several creative, conversion-optimized animations:

- **Split-text hero**: Letter-by-letter reveal with cursor blink
- **Aurora background**: Animated gradient orbs behind hero
- **Count-up stats**: Numbers animate on scroll into view
- **Glare effects**: Subtle shine on hover for CTAs and cards
- **Scroll reveals**: Fade-up animations for sections
- **Electric borders**: Animated gradient borders on pricing

All animations are implemented with vanilla CSS and React hooks, making them portable to any framework.

## Converting to Vanilla JavaScript

If you want a pure HTML/CSS/JS version without React:

1. **Extract the structure**: The React components in `src/components/` map directly to semantic HTML sections
2. **Copy styles**: All Tailwind classes can be compiled to vanilla CSS
3. **Fetch logic**: Replace `useEffect` + `fetch` with:
   ```js
   fetch('./content.json')
     .then(res => res.json())
     .then(data => {
       // Hydrate DOM with data.hero.headline, etc.
     })
     .catch(err => {
       // Fallback content
     });
   ```
4. **Animations**: 
   - Split-text: Use `textContent.split('')` and create `<span>` elements
   - Count-up: Use `setInterval` or `requestAnimationFrame`
   - Scroll reveals: Use `IntersectionObserver`
   - All CSS animations are already in `src/index.css` and portable

### Example Vanilla JS Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Audit - Ship AI that pays for itself in 90 days</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header id="header"><!-- Sticky header --></header>
  <main>
    <section id="hero"><!-- Aurora + split-text --></section>
    <section id="social-proof"><!-- Count-up stats --></section>
    <section id="problem-solution"><!-- Two columns --></section>
    <section id="services"><!-- Service cards --></section>
    <section id="outcomes"><!-- Case tiles --></section>
    <section id="how-it-works"><!-- 3 steps --></section>
    <section id="pricing"><!-- Pricing tiers --></section>
    <section id="case-studies"><!-- Case tiles --></section>
    <section id="faq"><!-- Accordion --></section>
    <section id="final-cta"><!-- CTA strip --></section>
    <section id="contact"><!-- Contact buttons --></section>
  </main>
  <footer id="footer"><!-- Footer --></footer>
  
  <script src="script.js"></script>
</body>
</html>
```

Then in `script.js`:
```js
fetch('./content.json')
  .then(res => res.json())
  .then(data => {
    document.querySelector('#hero h1').textContent = data.hero.headline;
    // ... hydrate all sections
  });
```

## Customization

### Colors

Edit `src/index.css` to change the color scheme:

```css
:root {
  --primary: 199 89% 48%; /* Cyan accent */
  --foreground: 0 0% 4%;  /* Dark text */
  --background: 0 0% 100%; /* White */
  /* ... more colors */
}
```

### Content Sections

To add/remove sections:

1. Update `content.json` with new data
2. Create a new component in `src/components/`
3. Import and add to `src/pages/Index.tsx`

### Animations

To disable/modify animations:

- Remove animation classes from components (e.g., `.reveal`, `.glare-effect`)
- Edit keyframes in `src/index.css`
- Adjust `animationDelay` values in components

## Accessibility

- Semantic HTML throughout
- WCAG AA contrast ratios
- Keyboard navigation support
- Focus states on all interactive elements
- ARIA labels where appropriate
- Skip-to-content link (add if needed)

## Performance

- Code splitting with Vite
- Lazy loading images below the fold
- Intersection Observer for scroll animations
- Minimal dependencies
- Optimized production build

## Support

For questions or issues, contact the developer or refer to:

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License

© 2025 AI Audit. All rights reserved.
