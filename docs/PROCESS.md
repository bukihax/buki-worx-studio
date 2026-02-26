\# Process Reflection (Base Tier)



\## What I built

I added a “Book a Class” booking form feature to my BUKI-WORX STUDIO website. The form now validates required fields (name, email, phone, message), shows inline error messages beside each field, and displays a success message without reloading the page. When the submission is valid, the form clears and the success message auto-hides after a few seconds.



\## Micro-iteration experience

Micro-iteration felt natural because I focused on one small change at a time (HTML structure, then JS submit wiring, then validation, then inline errors, then success behavior). It kept me from piling on changes that were hard to debug. The only frustrating part was when “nothing worked” at first, but it turned out to be duplicate IDs caused by having two forms on the same page.



\## What self-review caught

Self-review helped me notice edge cases and UX details. For example, the AI flagged that my success timeout pattern was fragile and suggested using a dedicated `successTimeout` variable. It also pointed out that users could rapidly click submit, so I added a disabled “Sending…” state to prevent double submissions.



\## Tool impressions (Claude Web)

Claude Web was good for planning and quick iteration because I could ask for one step and then immediately test in the browser. The downside is it’s easy for small HTML issues (like duplicate IDs) to break the logic, so I had to verify the actual page structure carefully.

