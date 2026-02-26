// Step 2 + Step 3: Booking form submit listener + validation helpers

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  // Step 3: Validation helper functions (logic only)
  function validateRequired(value) {
    return value.trim().length > 0;
  }

  function validateEmail(value) {
    const email = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Read from booking fields (unique IDs)
    const name = document.getElementById("booking-name").value;
    const email = document.getElementById("booking-email").value;
    const phone = document.getElementById("booking-phone").value;
    const message = document.getElementById("booking-message").value;

    // Console log values
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Message:", message);

    // Step 3 test logs
    console.log("Required name:", validateRequired(name));
    console.log("Valid email:", validateEmail(email));
    console.log("Valid phone:", validatePhone(phone));
    console.log("Required message:", validateRequired(message));
  });
});