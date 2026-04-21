// ── Authentication Module ─────────────────────────────────────────────────────
// Uses Supabase Auth — a service that handles sign up, login, logout, and
// session persistence (staying logged in after page refresh via a cookie/token).
//
// Key concept — Auth State:
//   Supabase stores the logged-in user's session in localStorage automatically.
//   onAuthStateChange() fires whenever that state changes (login, logout, refresh).
//   We use it to keep the nav and UI in sync without manually checking on every page.

// ── Helper: update the nav Login/Logout button ────────────────────────────────
// Called every time auth state changes so every page stays in sync.
function updateAuthNav(session) {
  var link = document.getElementById('auth-nav-link');
  if (!link) return;

  if (session && session.user) {
    // User is logged in — show Logout
    link.textContent = 'Logout';
    link.href = '#';
    link.onclick = function (e) {
      e.preventDefault();
      supabaseClient.auth.signOut().then(function () {
        window.location.href = 'index.html';
      });
    };
  } else {
    // User is logged out — show Login
    link.textContent = 'Login';
    link.href = 'signup.html';
    link.onclick = null;
  }
}

// ── Bootstrap: run on every page ─────────────────────────────────────────────
// getSession() reads the stored token synchronously so the nav updates
// immediately on page load with no flicker.
document.addEventListener('DOMContentLoaded', function () {
  supabaseClient.auth.getSession().then(function (result) {
    updateAuthNav(result.data.session);
  });

  // onAuthStateChange is a real-time listener — fires on login, logout,
  // and token refresh (Supabase refreshes tokens automatically every hour).
  supabaseClient.auth.onAuthStateChange(function (event, session) {
    updateAuthNav(session);
  });
});
