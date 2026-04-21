# Transcript Highlights

Five key moments from the AI-assisted development of BUKI-WORX STUDIO.

---

### 1. Planning the feature set before writing any code (Session 1, early)

Before writing a single line of code, I asked Claude to help me think through what a pole fitness studio website actually needs — not just pages, but features users would interact with. We landed on contact form validation, an accessibility menu, and a lead generation section as the core three before moving into implementation. Starting with planning rather than jumping straight to code meant every feature had a clear purpose.

---

### 2. Debugging the canvas curtain animation (Session 2, midway)

The silk curtain animation was choppy because MP4 video files store delta frames — not every frame is a full image, so seeking is slow. I described the problem to Claude and we worked through several approaches: direct `currentTime` seeking, a smart seek queue using a `pendingTime` pattern to prevent stacking concurrent seeks, and a canvas-based approach that draws decoded frames. The fix required understanding how video codecs work, not just JavaScript — a debugging session that went deeper than I expected.

---

### 3. Rejecting auto-open curtain in favor of scroll-driven (Session 2)

Claude implemented a time-based curtain that opened automatically after a few seconds. I said no — I specifically wanted the curtain to open as the user scrolled, like the twinbru.com technique. This required reverting the change and rethinking the input model entirely: instead of a timer, scroll wheel events feed a virtual accumulator that drives video progress. Pushing back on an AI suggestion and explaining *why* led to a much better interaction design.

---

### 4. Keeping it vanilla JavaScript — rejecting React (Session 1)

When the project was getting more complex, Claude suggested switching to React for better state management. I declined. The site is a marketing page with a few interactive widgets — it doesn't need a component framework. Keeping it in vanilla JS meant no build step, no node_modules in production, and code that anyone can read without knowing a framework. This was a judgment call that made the project simpler and faster to ship.

---

### 5. Integrating Supabase Auth and cloud database (Session 3)

Adding user authentication meant learning a new service mid-project. Claude walked me through creating a Supabase project, writing SQL to create the profiles table, enabling Row Level Security with a policy, and writing a database trigger that auto-creates a profile row on sign up. I ran each SQL block in the Supabase SQL Editor and verified the output before moving to the JavaScript integration. Breaking backend setup into discrete, testable steps made a complex feature feel manageable.
