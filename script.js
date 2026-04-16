// ── Pure validation functions ─────────────────────────────────────────────────
// Kept separate from DOM code so Jest can import and test them directly.

/**
 * Returns true if the string looks like a valid email address.
 * Pattern: <something> @ <something> . <something>
 * Intentionally simple — catches common typos without rejecting valid addresses.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates all three contact form fields.
 * @param {{ name: string, email: string, message: string }} fields
 * @returns {{ errors: { name: string, email: string, message: string }, isValid: boolean }}
 */
function validateForm(fields) {
  const errors = { name: '', email: '', message: '' };
  let isValid = true;

  if (!fields.name.trim()) {
    errors.name = 'Name is required.';
    isValid = false;
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!isValidEmail(fields.email)) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }

  if (!fields.message.trim()) {
    errors.message = 'Message is required.';
    isValid = false;
  }

  return { errors, isValid };
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

/**
 * Shows or clears an inline error for one field.
 * Passing an empty string clears the error and removes the error border.
 */
function renderFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  if (message) {
    inputEl.classList.add('input-error');
  } else {
    inputEl.classList.remove('input-error');
  }
}

// ── DOM wiring ────────────────────────────────────────────────────────────────

/**
 * Wires up the contact form.
 * Called automatically on DOMContentLoaded in the browser.
 * Exported and called manually in tests so each test gets a fresh binding.
 */
function init() {
  const form = document.getElementById('contact-form');
  if (!form) return; // Not on the contact page — do nothing.

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('name-error');
  const emailError   = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const successEl    = document.getElementById('form-success');
  const submitBtn    = form.querySelector('button[type="submit"]');

  // Clear a field's inline error as the user starts correcting it.
  nameInput.addEventListener('input', () => renderFieldError(nameInput, nameError, ''));
  emailInput.addEventListener('input', () => renderFieldError(emailInput, emailError, ''));
  messageInput.addEventListener('input', () => renderFieldError(messageInput, messageError, ''));

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const { errors, isValid } = validateForm({
      name:    nameInput.value,
      email:   emailInput.value,
      message: messageInput.value,
    });

    // Render all error states in one pass (clears passing fields automatically).
    renderFieldError(nameInput,    nameError,    errors.name);
    renderFieldError(emailInput,   emailError,   errors.email);
    renderFieldError(messageInput, messageError, errors.message);

    if (!isValid) return;

    // Disable button while "sending".
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    // Simulated async send — swap for fetch('/api/contact', ...) when ready.
    setTimeout(function () {
      successEl.textContent = 'Message sent — we\'ll be in touch shortly!';
      successEl.classList.add('success-visible');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 200);
  });
}

// ── Export guard ──────────────────────────────────────────────────────────────
// In the browser, `module` is not defined, so this block never runs.
// In Node/Jest, it exports the functions for unit testing.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidEmail, validateForm, init };
} else {
  document.addEventListener('DOMContentLoaded', init);
}
