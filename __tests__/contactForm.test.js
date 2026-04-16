/**
 * WEEK6-7 Redo — Contact Form Tests
 *
 * Test groups:
 *   1. isValidEmail  — pure function, no DOM needed
 *   2. validateForm  — pure function, no DOM needed
 *   3. DOM behavior  — wires up the form HTML and exercises real events
 *
 * ⚠️  Potential failures to know about:
 *   - DOM tests use jest.useFakeTimers() to skip the 200ms setTimeout in script.js.
 *     If you ever change that delay to a Promise-based async (e.g. fetch), the
 *     fake timer approach won't work — you'd need jest.spyOn + mockResolvedValue instead.
 *   - The DOM markup in beforeEach must stay in sync with contact.html.
 *     If you rename an id in the HTML, the corresponding test will fail with
 *     "Cannot read properties of null" rather than a clear assertion failure.
 */

const { isValidEmail, validateForm, init } = require('../script.js');

// ── 1. isValidEmail ───────────────────────────────────────────────────────────
describe('isValidEmail', () => {
  it('returns false for an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('returns false when @ is missing', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });

  it('returns false when domain is missing after @', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('returns false when TLD is missing', () => {
    // "user@domain" has no dot after the @-part
    expect(isValidEmail('user@domain')).toBe(false);
  });

  it('returns true for a standard email', () => {
    expect(isValidEmail('hello@bukiworx.com')).toBe(true);
  });

  it('returns true for a plus-addressed email', () => {
    // Plus addressing is valid per RFC 5321 — the regex should not reject it
    expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
  });
});

// ── 2. validateForm ───────────────────────────────────────────────────────────
describe('validateForm', () => {
  it('flags all three fields when all are empty', () => {
    const { errors, isValid } = validateForm({ name: '', email: '', message: '' });

    expect(isValid).toBe(false);
    expect(errors.name).toMatch(/required/i);
    expect(errors.email).toMatch(/required/i);
    expect(errors.message).toMatch(/required/i);
  });

  it('treats whitespace-only input as empty', () => {
    // A user typing spaces should still be caught
    const { isValid, errors } = validateForm({ name: '   ', email: '   ', message: '   ' });

    expect(isValid).toBe(false);
    expect(errors.name).toMatch(/required/i);
    // ⚠️  email: validateForm checks trim() first, then format.
    //    "   ".trim() === "" so we get the "required" error, not "invalid format".
    expect(errors.email).toMatch(/required/i);
    expect(errors.message).toMatch(/required/i);
  });

  it('returns the email format error (not required) when email is present but malformed', () => {
    const { errors, isValid } = validateForm({ name: 'Buki', email: 'notanemail', message: 'Hi' });

    expect(isValid).toBe(false);
    expect(errors.email).toMatch(/valid email/i);
    // The other two fields passed — their errors should be empty strings
    expect(errors.name).toBe('');
    expect(errors.message).toBe('');
  });

  it('returns isValid true and no errors for fully valid input', () => {
    const { errors, isValid } = validateForm({
      name: 'Buki',
      email: 'hello@bukiworx.com',
      message: 'Book me for a session!',
    });

    expect(isValid).toBe(true);
    expect(errors.name).toBe('');
    expect(errors.email).toBe('');
    expect(errors.message).toBe('');
  });
});

// ── 3. DOM behavior ───────────────────────────────────────────────────────────
// Each test gets a fresh copy of the form HTML and re-runs init() so event
// listeners don't stack up across tests.
describe('Contact form DOM behavior', () => {
  beforeEach(() => {
    // Minimal form markup — mirrors the structure in contact.html.
    // If you rename an id in the HTML, update it here too.
    document.body.innerHTML = `
      <form id="contact-form" novalidate>
        <input id="name"    type="text"  />
        <span  id="name-error"           ></span>

        <input id="email"   type="email" />
        <span  id="email-error"          ></span>

        <textarea id="message"           ></textarea>
        <span     id="message-error"     ></span>

        <div id="form-success"></div>
        <button type="submit">Send Message</button>
      </form>
    `;
    init();
  });

  afterEach(() => {
    // Restore real timers after any test that used fake ones.
    jest.useRealTimers();
  });

  // Helper — submits the form via a real DOM event (same as clicking Submit).
  function submitForm() {
    document.getElementById('contact-form').dispatchEvent(new Event('submit'));
  }

  it('shows "Name is required" when name is blank on submit', () => {
    document.getElementById('email').value   = 'test@test.com';
    document.getElementById('message').value = 'Hello';
    submitForm();

    expect(document.getElementById('name-error').textContent).toMatch(/name is required/i);
  });

  it('shows "Email is required" when email is blank on submit', () => {
    document.getElementById('name').value    = 'Buki';
    document.getElementById('message').value = 'Hello';
    submitForm();

    expect(document.getElementById('email-error').textContent).toMatch(/email is required/i);
  });

  it('shows the email format error when email is present but invalid', () => {
    document.getElementById('name').value    = 'Buki';
    document.getElementById('email').value   = 'notanemail';
    document.getElementById('message').value = 'Hello';
    submitForm();

    expect(document.getElementById('email-error').textContent).toMatch(/valid email/i);
  });

  it('shows "Message is required" when message is blank on submit', () => {
    document.getElementById('name').value  = 'Buki';
    document.getElementById('email').value = 'test@test.com';
    submitForm();

    expect(document.getElementById('message-error').textContent).toMatch(/message is required/i);
  });

  it('does not show success when the form is invalid', () => {
    submitForm(); // all fields empty

    expect(document.getElementById('form-success').textContent).toBe('');
  });

  it('shows the success message after a valid submit', () => {
    // ⚠️  script.js uses setTimeout(fn, 200) after a valid submit.
    //    We use fake timers so the test doesn't actually wait 200ms.
    jest.useFakeTimers();

    document.getElementById('name').value    = 'Buki';
    document.getElementById('email').value   = 'hello@bukiworx.com';
    document.getElementById('message').value = 'Book me!';
    submitForm();

    // No success yet — setTimeout hasn't fired.
    expect(document.getElementById('form-success').textContent).toBe('');

    // Fast-forward past the 200ms delay.
    jest.runAllTimers();

    expect(document.getElementById('form-success').textContent).toMatch(/message sent/i);
  });

  it('clears all field values after a valid submit', () => {
    jest.useFakeTimers();

    document.getElementById('name').value    = 'Buki';
    document.getElementById('email').value   = 'hello@bukiworx.com';
    document.getElementById('message').value = 'Book me!';
    submitForm();
    jest.runAllTimers();

    // form.reset() is called in the setTimeout callback.
    expect(document.getElementById('name').value).toBe('');
    expect(document.getElementById('email').value).toBe('');
    expect(document.getElementById('message').value).toBe('');
  });

  it('clears a field error when the user starts typing in that field', () => {
    // Trigger all errors first.
    submitForm();
    expect(document.getElementById('name-error').textContent).toMatch(/required/i);

    // Simulate user typing a character in the name field.
    const nameInput = document.getElementById('name');
    nameInput.value = 'B';
    nameInput.dispatchEvent(new Event('input'));

    // The name error should now be gone; the others remain.
    expect(document.getElementById('name-error').textContent).toBe('');
    expect(document.getElementById('email-error').textContent).toMatch(/required/i);
  });
});
