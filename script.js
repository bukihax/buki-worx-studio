// Step 4: Inline error messages for booking form + stop submit if invalid

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
    // phone is required in this booking form flow; adjust later if optional
    return digits.length >= 10;
  }

  function setError(el, message) {
    el.textContent = message;
  }

  function clearError(el) {
    el.textContent = "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
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

    // Stop here if errors exist (this is the “block submission” part)
    if (hasErrors) return;

    // Step 5 will add success behavior + clearing, so for now just log
    console.log("Booking form valid ✅ (Step 4)");
  });
});