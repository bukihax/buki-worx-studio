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

6. **AI Studio Assistant (LLM-powered chatbot)** — A floating chat widget on every page that answers visitor questions about classes, booking, and parties. Calls a locally running [Ollama](https://ollama.com) instance (`llama3.2` model) via its REST API. Responses stream token-by-token using the `ReadableStream` / `fetch` API so text appears progressively. A session-level cache (plain JS object) stores completed answers so repeated questions skip the API call entirely. Falls back to a contact message if Ollama is unreachable.

---

## AI Studio Assistant — Setup

The chat widget requires [Ollama](https://ollama.com) running locally. It makes no external network requests and costs nothing.

```bash
# 1. Install Ollama (Mac/Linux/Windows) — https://ollama.com/download
# 2. Pull the model (one-time download, ~2 GB)
ollama pull llama3.2

# 3. Start the Ollama server (stays running in background)
ollama serve

# 4. Open the site — the "Ask the Studio" button in the bottom-right corner will work
```

The widget sends requests to `http://localhost:11434/api/chat` with `"stream": true`. Each streamed chunk is a newline-delimited JSON object; the widget parses `chunk.message.content` and appends it to the bubble in real time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements, ARIA attributes) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Interactivity | Vanilla JavaScript (ES5-compatible) |
| LLM / AI | Ollama (local) · llama3.2 model · streamed via Fetch API |
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
├── script.js           # Validation, accessibility widget, chat, parallax, scroll reveal
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
