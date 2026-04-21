# BUKI-WORX STUDIO

A multi-page marketing and booking website for a pole fitness and empowerment studio based in Orlando, FL. Built with vanilla HTML, CSS, and JavaScript — no frameworks.

**Live site:** https://bukihax.github.io/buki-worx-studio/

---

## Project Description

BUKI-WORX STUDIO offers pole fitness, heels choreography, aerial silks, and strength training classes for women of all experience levels. The site serves as the studio's full digital presence — letting visitors explore classes, book private parties, contact the studio, and create an account to track their membership perks. It features a luxury visual experience with an animated silk curtain intro, AI-powered chat assistant, and accessibility tools to ensure every visitor feels welcome.

---

## Features

1. **Contact form with validation** — The Contact page validates all fields client-side before submission, shows inline error messages per field, and displays a success confirmation on valid submit.

2. **Accessibility menu** — A navbar dropdown with 10 toggleable options: high contrast, larger text, text spacing, dyslexia-friendly font, pause animations, highlight links, custom cursor, tooltips, line height, and text alignment. Preferences persist via `localStorage`.

3. **Lead generation section** — Homepage offer that captures visitor name and email in exchange for a first-class promo code (BUKIFREE). Validates input, reveals the code on submit, and guards against duplicate claims.

4. **Silk curtain intro animation** — A scroll-scrubbed canvas animation on the landing page. A hidden `<video>` element is used as a frame source; each scroll event seeks to a new timestamp and draws that frame to a `<canvas>`. The page is locked at the top until the curtain fully opens. Headline text uses the Nirakolu display font with a 3D bubbly cream text-shadow stack.

5. **AI Studio Assistant (LLM-powered chatbot)** — A floating chat widget on every page that answers visitor questions about classes, booking, and parties. Calls a locally running [Ollama](https://ollama.com) instance (`llama3.2` model) via its REST API. Responses stream token-by-token. A session-level cache skips repeat API calls.

6. **User authentication** — Sign up and login via Supabase Auth (email + password). Session persists across page refreshes via JWT token stored in `localStorage`. The nav updates dynamically to show Login or Logout based on auth state.

7. **Cloud database** — User profiles and promo claim status stored in Supabase (PostgreSQL). Row Level Security (RLS) ensures each user can only read and write their own data. A database trigger auto-creates a profile row whenever a new user signs up.

---

## Architecture Overview

```
Frontend (Vanilla HTML/CSS/JS)
        │
        ├── supabase-client.js   — Initializes Supabase connection (CDN SDK)
        ├── auth.js              — Session listener, updates nav on every page
        ├── script.js            — Validation, chat, curtain, parallax, lead gen
        └── styles.css           — All styles shared across pages
        │
        ▼
Supabase (Backend-as-a-Service)
        │
        ├── Auth                 — Email/password sign up & login
        │                          JWT tokens stored client-side
        │
        └── Firestore (PostgreSQL)
                ├── profiles table
                │     id (uuid, FK → auth.users)
                │     email (text)
                │     promo_claimed (boolean, default false)
                │     created_at (timestamptz)
                │
                └── Row Level Security
                      Users can only SELECT/UPDATE their own row
                      via: auth.uid() = id
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements, ARIA attributes) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Interactivity | Vanilla JavaScript (ES5-compatible) |
| Authentication | Supabase Auth (email + password, JWT sessions) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| LLM / AI | Ollama (local) · llama3.2 · streamed via Fetch API |
| Fonts | Jost (Google Fonts) · Nirakolu (local OTF/TTF) |
| Testing | Jest 29 + jest-environment-jsdom |
| Deployment | GitHub Pages (root of `main` branch) |

---

## Project Structure

```
buki-worx-studio/
├── index.html           # Homepage (curtain, hero, offer, benefits)
├── about.html           # Studio story and instructors
├── classes.html         # Class catalogue with difficulty badges
├── parties.html         # Private party bookings
├── contact.html         # Contact form + studio info
├── signup.html          # Login / Sign Up / Account page
├── styles.css           # All styles (shared across pages)
├── script.js            # Validation, a11y, chat, curtain, parallax, lead gen
├── supabase-client.js   # Supabase SDK initialization
├── auth.js              # Auth state listener + nav updates
├── nirakolu/            # Nirakolu display font (OTF + TTF)
├── __tests__/
│   └── contactForm.test.js
├── images/              # Video and image assets
└── docs/                # Build plan and process notes
```

---

## AI Studio Assistant — Setup

The chat widget requires [Ollama](https://ollama.com) running locally.

```bash
# 1. Install Ollama — https://ollama.com/download
# 2. Pull the model (one-time, ~2 GB)
ollama pull llama3.2
# 3. Start the server
ollama serve
# 4. Open the site — the chat icon appears bottom-right
```

---

## Running Tests

```powershell
npm install
npm test
```

18 tests cover `isValidEmail`, `validateForm`, and DOM behavior for the contact form.

---

## What I Learned

Working with AI tools to build this project changed how I think about software development. Early on I learned to write specific, detailed prompts — vague instructions like "make the animation work" produced generic results, but describing the exact behavior, the error message, and what I expected got me useful code immediately.

The biggest lesson was knowing when to push back on AI suggestions. When Claude recommended switching to React or adding a state management library, I said no — the project didn't need it, and keeping it in vanilla JavaScript made everything simpler and more readable. I learned that AI gives you options, but you have to be the one deciding what actually fits.

Debugging with AI also taught me to read error messages carefully before asking for help. Sharing the exact error plus the relevant code led to faster solutions than just describing the symptom. The process of iterating — building a feature, testing it, identifying what broke, and refining it — is a skill I developed through this project that I'll carry forward into every project I build.

---

## Known Bugs & Limitations

- The AI chat widget requires Ollama running locally — it will show a fallback message in production
- The silk curtain animation smoothness depends on the browser's video decoding speed; Chrome performs best
- Email confirmation is disabled in Supabase for development — should be re-enabled before a real production launch
