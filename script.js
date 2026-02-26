// Step 5: Show success message + clear form (after passing validation)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const successEl = document.getElementById("formSuccess");

  // Error elements
  const nameErrorEl = document.getElementById("booking-nameError");
  const emailErrorEl = document.getElementById("booking-emailError");
  const phoneErrorEl = document.getElementById("booking-phoneError");
  const messageErrorEl = document.getElementById("booking-messageError");

  // Inputs
  const nameInput = document.getElementById("booking-name");
  const emailInput = document.getElementById("booking-email");
  const phoneInput = document.getElementById("booking-phone");
  const messageInput = document.getElementById("booking-message");

  // Validation helpers
  function validateRequired(value) {
    return value.trim().length > 0;
  }

  function validateEmail(value) {
    const email = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10; // booking form: require 10+ digits
  }

  function setError(el, message) {
    if (!el) return;
    el.textContent = message;
  }

  function clearError(el) {
    if (!el) return;
    el.textContent = "";
  }

  function clearAllErrors() {
    clearError(nameErrorEl);
    clearError(emailErrorEl);
    clearError(phoneErrorEl);
    clearError(messageErrorEl);
  }

  function showSuccess(message) {
    if (!successEl) return;

    successEl.textContent = message;

    // Auto-hide after 4 seconds
    window.clearTimeout(showSuccess._t);
    showSuccess._t = window.setTimeout(() => {
      successEl.textContent = "";
    }, 4000);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Clear previous success message each submit
    if (successEl) successEl.textContent = "";

    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const message = messageInput.value;

    let hasErrors = false;

    // Name
    if (!validateRequired(name)) {
      setError(nameErrorEl, "Name is required.");
      hasErrors = true;
    } else {
      clearError(nameErrorEl);
    }

    // Email
    if (!validateRequired(email)) {
      setError(emailErrorEl, "Email is required.");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setError(emailErrorEl, "Enter a valid email address.");
      hasErrors = true;
    } else {
      clearError(emailErrorEl);
    }

    // Phone
    if (!validateRequired(phone)) {
      setError(phoneErrorEl, "Phone is required.");
      hasErrors = true;
    } else if (!validatePhone(phone)) {
      setError(phoneErrorEl, "Enter a valid phone number (10+ digits).");
      hasErrors = true;
    } else {
      clearError(phoneErrorEl);
    }

    // Message
    if (!validateRequired(message)) {
      setError(messageErrorEl, "Message is required.");
      hasErrors = true;
    } else {
      clearError(messageErrorEl);
    }

    if (hasErrors) return;

    // ✅ Step 5 behavior: success + clear form
    clearAllErrors();
    form.reset();
    showSuccess("Thanks! We’ll reach out soon to confirm your booking.");
  });
});
