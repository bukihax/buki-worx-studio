// Step 6: Polish & UX (disable button, styling hooks, cleaner success timeout)

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

  // Button
  const submitBtn = document.getElementById("submitBtn");

  // Success timeout (clean pattern)
  let successTimeout = null;

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

  function setError(inputEl, errorEl, message) {
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add("input-error");
  }

  function clearError(inputEl, errorEl) {
    if (errorEl) errorEl.textContent = "";
    if (inputEl) inputEl.classList.remove("input-error");
  }

  function clearAllErrors() {
    clearError(nameInput, nameErrorEl);
    clearError(emailInput, emailErrorEl);
    clearError(phoneInput, phoneErrorEl);
    clearError(messageInput, messageErrorEl);
  }

  function showSuccess(message) {
    if (!successEl) return;

    successEl.textContent = message;
    successEl.classList.add("success-visible");

    // Make sure user sees it
    successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

    clearTimeout(successTimeout);
    successTimeout = setTimeout(() => {
      successEl.textContent = "";
      successEl.classList.remove("success-visible");
    }, 5500);
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.classList.toggle("btn-disabled", isSubmitting);
    submitBtn.textContent = isSubmitting ? "Sending..." : "Send Request";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (successEl) {
      successEl.textContent = "";
      successEl.classList.remove("success-visible");
    }

    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const message = messageInput.value;

    let hasErrors = false;

    // Name
    if (!validateRequired(name)) {
      setError(nameInput, nameErrorEl, "Name is required.");
      hasErrors = true;
    } else {
      clearError(nameInput, nameErrorEl);
    }

    // Email
    if (!validateRequired(email)) {
      setError(emailInput, emailErrorEl, "Email is required.");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setError(emailInput, emailErrorEl, "Enter a valid email address.");
      hasErrors = true;
    } else {
      clearError(emailInput, emailErrorEl);
    }

    // Phone
    if (!validateRequired(phone)) {
      setError(phoneInput, phoneErrorEl, "Phone is required.");
      hasErrors = true;
    } else if (!validatePhone(phone)) {
      setError(phoneInput, phoneErrorEl, "Enter a valid phone number (10+ digits).");
      hasErrors = true;
    } else {
      clearError(phoneInput, phoneErrorEl);
    }

    // Message
    if (!validateRequired(message)) {
      setError(messageInput, messageErrorEl, "Message is required.");
      hasErrors = true;
    } else {
      clearError(messageInput, messageErrorEl);
    }

    if (hasErrors) return;

    // UX: disable during "submission"
    setSubmitting(true);

    // Simulate short processing time for UX (no backend)
    setTimeout(() => {
      clearAllErrors();
      form.reset();
      showSuccess("Thanks! We’ll reach out soon to confirm your booking.");
      setSubmitting(false);
    }, 350);
  });
});