# Converting to Vanilla JavaScript (GitHub Pages Ready)

This guide shows how to convert the React landing page to pure HTML/CSS/JS for GitHub Pages deployment.

## Quick Overview

The current React app is **already GitHub Pages compatible** after running `npm run build`. However, if you want a pure vanilla JS version without the React runtime, follow this guide.

## Files You'll Create

```
/
├── index.html          (main HTML structure)
├── styles.css          (compiled Tailwind + custom styles)
├── script.js           (fetch content.json, animations, interactions)
└── content.json        (already exists in /public/)
```

## Step 1: Extract HTML Structure

The React components map directly to semantic HTML sections. Here's the skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <title>AI Audit - Ship AI that pays for itself in 90 days</title>
  <meta name="description" content="Stop overpaying for AI experiments. Get a 2-week AI Audit for $4,000 with clear ROI projections." />
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Header (Sticky) -->
  <header id="header" class="header">
    <div class="container">
      <div class="header-content">
        <div class="brand">
          <span class="brand-name" data-content="personal.name">AI Consultant</span>
          <span class="brand-title" data-content="personal.title">AI Strategy</span>
        </div>
        <nav class="nav-desktop">
          <button data-nav="services">Services</button>
          <button data-nav="case-studies">Case Studies</button>
          <button data-nav="about">About</button>
          <button data-nav="contact">Contact</button>
        </nav>
        <button class="cta-button" data-cta="contact">Get your AI Audit</button>
        <button class="mobile-menu-toggle">☰</button>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section with Aurora Background -->
    <section id="hero" class="hero aurora-bg">
      <div class="aurora-orb"></div>
      <div class="container">
        <h1 id="hero-headline" class="hero-headline" data-content="hero.headline">
          Ship AI that pays for itself in 90 days
        </h1>
        <p class="hero-subheadline" data-content="hero.subheadline">
          Stop overpaying for AI experiments.
        </p>
        <div class="hero-cta">
          <button class="btn btn-primary glare-effect" data-cta="contact">
            Get your AI Audit →
          </button>
          <button class="btn btn-secondary" data-scroll="how-it-works">
            See how it works
          </button>
        </div>
        <div id="hero-proof-points" class="hero-proof-points">
          <!-- Dynamically filled from content.json -->
        </div>
      </div>
    </section>

    <!-- Social Proof Stats -->
    <section id="social-proof" class="social-proof">
      <div class="container">
        <div id="stats-grid" class="stats-grid">
          <!-- Dynamically filled with count-up stats -->
        </div>
      </div>
    </section>

    <!-- Problem ↔ Solution -->
    <section id="problem-solution" class="problem-solution">
      <div class="container">
        <div class="two-col-grid">
          <div class="problem-col">
            <h2 data-content="problemSolution.problem.title">The Problem</h2>
            <div id="problem-points">
              <!-- Dynamically filled -->
            </div>
          </div>
          <div class="solution-col">
            <h2 data-content="problemSolution.solution.title">The Solution</h2>
            <div id="solution-moves">
              <!-- Dynamically filled -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="services">
      <div class="container">
        <h2>Two ways to work together</h2>
        <div id="services-grid" class="services-grid">
          <!-- Service cards filled dynamically -->
        </div>
      </div>
    </section>

    <!-- Outcomes -->
    <section id="outcomes" class="outcomes">
      <div class="container">
        <h2>Real results from real companies</h2>
        <div id="outcomes-grid" class="outcomes-grid">
          <!-- Outcome tiles filled dynamically -->
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="how-it-works">
      <div class="container">
        <h2 data-content="howItWorks.title">How it works</h2>
        <div id="steps-grid" class="steps-grid">
          <!-- Steps filled dynamically -->
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="pricing electric-border">
      <div class="container">
        <h2 data-content="pricing.title">Transparent pricing</h2>
        <div id="pricing-grid" class="pricing-grid">
          <!-- Pricing tiers filled dynamically -->
        </div>
      </div>
    </section>

    <!-- Case Studies -->
    <section id="case-studies" class="case-studies">
      <div class="container">
        <h2>Case studies</h2>
        <div id="case-studies-grid" class="case-studies-grid">
          <!-- Case tiles filled dynamically -->
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="faq">
      <div class="container">
        <h2>Frequently asked questions</h2>
        <div id="faq-accordion" class="faq-accordion">
          <!-- FAQ items filled dynamically -->
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="final-cta" class="final-cta">
      <div class="container">
        <h2 data-content="finalCTA.headline">Ready to see ROI in 90 days?</h2>
        <p data-content="finalCTA.subheadline">Book a 2-week AI Audit...</p>
        <button class="btn btn-primary glare-effect" data-cta="contact">
          Get your AI Audit →
        </button>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact">
      <div class="container">
        <h2>Get started today</h2>
        <div class="contact-buttons">
          <button class="btn btn-primary" data-contact="calendar">📅 Book a call</button>
          <button class="btn btn-outline" data-contact="email">✉️ Email me</button>
          <button class="btn btn-outline" data-contact="phone">📞 Call me</button>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer id="footer" class="footer">
    <div class="container">
      <!-- Footer content filled dynamically -->
    </div>
  </footer>

  <!-- Mobile FABs -->
  <div class="mobile-fabs">
    <button class="fab" data-contact="phone">📞</button>
    <button class="fab" data-contact="email">✉️</button>
  </div>

  <!-- Back to Top -->
  <button id="back-to-top" class="back-to-top" style="display: none;">↑</button>

  <script src="script.js"></script>
</body>
</html>
```

## Step 2: Compile Styles (styles.css)

You have two options:

### Option A: Use Tailwind CLI (Recommended)

1. Install Tailwind CLI:
   ```bash
   npm install -D tailwindcss
   ```

2. Create `tailwind.input.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   /* Paste all custom CSS from src/index.css */
   @layer base {
     /* ... color variables ... */
   }
   
   @keyframes aurora-1 { /* ... */ }
   /* ... all custom animations ... */
   ```

3. Build CSS:
   ```bash
   npx tailwindcss -i tailwind.input.css -o styles.css --minify
   ```

### Option B: Copy from Dev Tools

1. Run `npm run dev`
2. Open Chrome DevTools → Sources → styles
3. Copy all compiled CSS
4. Save as `styles.css`

### Critical Styles to Include

Make sure `styles.css` includes:

```css
/* Reset and base styles */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Inter, sans-serif; line-height: 1.45; }

/* Color variables */
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: #0ea5e9;
  --primary-foreground: #ffffff;
  /* ... all other variables from src/index.css ... */
}

/* Aurora background animation */
.aurora-bg { position: relative; overflow: hidden; }
.aurora-bg::before,
.aurora-bg::after,
.aurora-orb {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.aurora-bg::before {
  width: 600px;
  height: 600px;
  background: var(--primary);
  animation: aurora-1 20s ease-in-out infinite;
}
/* ... more aurora styles ... */

@keyframes aurora-1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.15; }
  50% { transform: translate(50%, 30%) scale(1.2); opacity: 0.25; }
}

/* Glare effect */
.glare-effect { position: relative; overflow: hidden; }
.glare-effect::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}
.glare-effect:hover::before { transform: translateX(100%); }

/* Shiny text */
.shiny-text {
  background: linear-gradient(90deg, var(--foreground), var(--primary), var(--foreground));
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glare 3s linear infinite;
}

@keyframes glare {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Electric border */
.electric-border {
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
    linear-gradient(90deg, var(--primary), var(--accent), var(--primary)) border-box;
  background-size: 200% 100%;
  animation: electric-border 3s ease infinite;
}

@keyframes electric-border {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Reveal animation */
.reveal {
  opacity: 0;
  animation: reveal-up 0.6s ease-out forwards;
}

@keyframes reveal-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Split char animation */
.split-char {
  display: inline-block;
  opacity: 0;
  animation: reveal-up 0.4s ease-out forwards;
}

/* Cursor blink */
.cursor-blink {
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Component styles (buttons, cards, etc.) */
/* ... add all necessary component styles ... */
```

## Step 3: JavaScript (script.js)

```javascript
// Fetch and hydrate content
let content = {};

async function loadContent() {
  try {
    const response = await fetch('./content.json');
    content = await response.json();
    hydrateContent();
    initAnimations();
    initInteractions();
  } catch (error) {
    console.error('Failed to load content:', error);
    // Use fallback content
    content = getFallbackContent();
    hydrateContent();
  }
}

function hydrateContent() {
  // Hydrate data-content attributes
  document.querySelectorAll('[data-content]').forEach(el => {
    const path = el.getAttribute('data-content');
    const value = getNestedValue(content, path);
    if (value) {
      el.textContent = value;
    }
  });

  // Hydrate specific sections
  hydrateHeroProofPoints();
  hydrateSocialProofStats();
  hydrateProblemSolution();
  hydrateServices();
  hydrateOutcomes();
  hydrateHowItWorks();
  hydratePricing();
  hydrateCaseStudies();
  hydrateFAQ();
}

// Utility to get nested object values
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

// Hero split-text animation
function initHeroSplitText() {
  const headline = document.getElementById('hero-headline');
  if (!headline) return;

  const text = headline.textContent;
  headline.innerHTML = '';

  const words = text.split(' ');
  words.forEach((word, wordIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.marginRight = '0.3em';

    word.split('').forEach((char, charIdx) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'split-char';
      span.style.animationDelay = `${(wordIdx * 5 + charIdx) * 0.03}s`;
      wordSpan.appendChild(span);
    });

    headline.appendChild(wordSpan);
  });

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  cursor.style.display = 'inline-block';
  cursor.style.width = '2px';
  cursor.style.height = '3rem';
  cursor.style.background = 'var(--primary)';
  cursor.style.marginLeft = '0.25rem';
  cursor.style.animationDelay = `${words.length * 0.15}s`;
  headline.appendChild(cursor);
}

// Count-up animation for stats
function countUp(element, target, duration = 1500) {
  const numMatch = target.match(/\d+/);
  if (!numMatch) {
    element.textContent = target;
    return;
  }

  const targetNum = parseInt(numMatch[0]);
  const startTime = Date.now();

  function animate() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(progress * targetNum);
    element.textContent = target.replace(/\d+/, current.toString());

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// Intersection Observer for scroll reveals
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          
          // Trigger count-up for stats
          if (entry.target.hasAttribute('data-countup')) {
            const target = entry.target.getAttribute('data-countup');
            const valueEl = entry.target.querySelector('.stat-value');
            if (valueEl) {
              countUp(valueEl, target, 1600);
            }
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('[data-countup]').forEach(el => {
    observer.observe(el);
  });
}

// Navigation and interactions
function initInteractions() {
  // Sticky header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll for navigation
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      const section = document.getElementById(target);
      section?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // CTA buttons
  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById('contact');
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Contact buttons
  document.querySelectorAll('[data-contact="calendar"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (content.personal?.calendarLink) {
        window.open(content.personal.calendarLink, '_blank');
      }
    });
  });

  document.querySelectorAll('[data-contact="email"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (content.personal?.email) {
        window.location.href = `mailto:${content.personal.email}`;
      }
    });
  });

  document.querySelectorAll('[data-contact="phone"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (content.personal?.phone) {
        window.location.href = `tel:${content.personal.phone}`;
      }
    });
  });

  // Back to top button
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // FAQ accordion
  document.querySelectorAll('[data-faq-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = content.style.maxHeight;
      
      // Close all
      document.querySelectorAll('[data-faq-content]').forEach(el => {
        el.style.maxHeight = null;
      });
      
      // Open clicked
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// Initialize animations
function initAnimations() {
  initHeroSplitText();
  initScrollReveal();
}

// Hydrate specific sections (implement based on content.json structure)
function hydrateHeroProofPoints() {
  const container = document.getElementById('hero-proof-points');
  if (!container || !content.hero?.proofPoints) return;

  container.innerHTML = content.hero.proofPoints
    .map((point, idx) => `
      <div class="proof-point reveal" style="animation-delay: ${0.8 + idx * 0.1}s">
        <span class="check-icon">✓</span>
        ${point}
      </div>
    `)
    .join('');
}

function hydrateSocialProofStats() {
  const container = document.getElementById('stats-grid');
  if (!container || !content.socialProof?.stats) return;

  container.innerHTML = content.socialProof.stats
    .map((stat, idx) => `
      <div class="stat-card" data-reveal data-countup="${stat.value}" style="animation-delay: ${idx * 0.1}s">
        <div class="stat-value">${stat.value}</div>
        <p class="stat-label">${stat.label}</p>
      </div>
    `)
    .join('');
}

// ... implement other hydrate functions similarly ...

function getFallbackContent() {
  return {
    personal: {
      name: 'AI Consultant',
      title: 'AI Strategy & Implementation',
      email: 'contact@example.com',
      phone: '+1 (555) 000-0000'
    },
    hero: {
      headline: 'Ship AI that pays for itself in 90 days',
      subheadline: 'Stop overpaying for AI experiments.',
      proofPoints: ['Reduce manual work by 20-40%', 'Clear ROI tracking', 'No vendor lock-in']
    }
    // ... more fallback content
  };
}

// Start the app
document.addEventListener('DOMContentLoaded', loadContent);
```

## Step 4: Deploy to GitHub Pages

1. Create a new repo on GitHub
2. Add files:
   ```
   index.html
   styles.css
   script.js
   content.json
   ```
3. Push to GitHub
4. Go to Settings → Pages
5. Select "main" branch and root folder
6. Save and visit your site at `https://username.github.io/repo-name/`

## Performance Checklist

- ✅ Inline critical CSS (above-the-fold styles in `<style>` tag)
- ✅ Defer non-critical JS (`<script defer src="script.js"></script>`)
- ✅ Lazy load images below the fold (`loading="lazy"`)
- ✅ Compress images (use tools like TinyPNG)
- ✅ Minify CSS and JS
- ✅ Set cache headers (via GitHub Pages or CDN)
- ✅ Use `rel="preconnect"` for external fonts

## Testing

- Test on mobile (Chrome, Safari)
- Test animations (smooth scroll, count-up, reveals)
- Test all CTAs and navigation
- Test with slow 3G connection
- Validate HTML (https://validator.w3.org/)
- Check accessibility (WAVE, Lighthouse)

## Differences from React Version

| Feature | React Version | Vanilla JS Version |
|---------|--------------|-------------------|
| Split-text animation | useEffect + DOM manipulation | Direct DOM manipulation |
| Count-up stats | useState + useEffect + IntersectionObserver | IntersectionObserver + requestAnimationFrame |
| Scroll reveals | IntersectionObserver in useEffect | IntersectionObserver on load |
| Content loading | fetch in useEffect | fetch in DOMContentLoaded |
| Routing | React Router (none used here) | Hash navigation or none |
| Bundle size | ~140KB (minified + gzipped) | ~20KB (pure HTML/CSS/JS) |

## Conclusion

The vanilla JS version is significantly smaller, faster to load, and easier to host on GitHub Pages without a build step. However, the React version is easier to maintain and extend if you plan to add more interactivity or features.

Choose vanilla JS for maximum performance and simplicity. Choose React for easier maintenance and scalability.
