# BUKI-WORX STUDIO

A multi-page marketing and booking website for a pole fitness and empowerment studio based in Orlando, FL. Built with vanilla HTML, CSS, and JavaScript — no frameworks.

**Live site:** https://bukihax.github.io/buki-worx-studio/

---

## Project Description

BUKI-WORX STUDIO offers pole fitness, heels choreography, aerial silks, and strength training classes for women of all experience levels. This site serves as the studio's public-facing presence — giving prospective clients everything they need to learn about the studio, browse classes, and get in touch.

---

## Features

1. **Multi-page site** — Five pages (Home, About, Classes, Parties, Contact) with consistent navigation and shared styling.

2. **Contact form with validation** — The "Send a Message" form on the Contact page validates all fields client-side before submission, shows inline error messages per field, and displays a success confirmation on valid submit.

3. **Accessibility menu** — A navbar dropdown with 10 toggleable options: high contrast, larger text, text spacing, dyslexia-friendly font, pause animations, highlight links, custom cursor, tooltips, line height, and text alignment. Preferences persist across pages via `localStorage`.

4. **Lead generation section** — Homepage offer that captures visitor name and email in exchange for a first-class discount. Validates input, displays a unique promo code on submission, and guards against duplicate claims using `localStorage`.

5. **Hero video background** — Full-screen looping video on the homepage with a controlled playback window (seconds 3–20) and a dark overlay for text legibility.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements, ARIA attributes) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Interactivity | Vanilla JavaScript (ES5-compatible) |
| Testing | Jest 29 + jest-environment-jsdom |
| Deployment | GitHub Pages (root of `main` branch) |

---

## Project Structure

```
buki-worx-studio/
├── index.html          # Homepage (hero, offer, benefits)
├── about.html          # Studio story and instructors
├── classes.html        # Class catalogue with difficulty badges
├── parties.html        # Private party bookings
├── contact.html        # Contact form + studio info
├── signup.html         # Sign-up page
├── styles.css          # All styles (shared across pages)
├── script.js           # Validation logic + accessibility widget
├── __tests__/
│   └── contactForm.test.js
├── images/             # Video and image assets
└── docs/               # Build plan and process notes
```

---

## Running Tests

```bash
npm install
npm test
```

18 tests cover `isValidEmail`, `validateForm`, and full DOM behavior for the contact form.

---

## AI Transcript

The initial project scaffold and feature planning were developed with AI assistance. The transcript is included in the repository root:
`2026-02-02-create-a-5-page-static-website-for-buki-worx-studi.txt`
