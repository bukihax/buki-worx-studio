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

// ── Accessibility Widget ──────────────────────────────────────────────────────

var A11Y_KEY = 'buki-a11y';

// Maps each preference key to the CSS class applied to <html>.
var A11Y_CLASS_MAP = {
  contrast:        'a11y-contrast',
  highlightLinks:  'a11y-highlight-links',
  biggerText:      'a11y-bigger-text',
  textSpacing:     'a11y-text-spacing',
  pauseAnimations: 'a11y-pause-anim',
  dyslexia:        'a11y-dyslexia',
  bigCursor:       'a11y-big-cursor',
  tooltips:        'a11y-tooltips',
  lineHeight:      'a11y-line-height',
  textAlign:       'a11y-text-align',
};

function a11yLoadPrefs() {
  try { return JSON.parse(localStorage.getItem(A11Y_KEY)) || {}; }
  catch (e) { return {}; }
}

function a11ySavePrefs(prefs) {
  localStorage.setItem(A11Y_KEY, JSON.stringify(prefs));
}

// Reads the saved prefs object and toggles each CSS class on <html>.
function a11yApplyPrefs(prefs) {
  var root = document.documentElement;
  Object.keys(A11Y_CLASS_MAP).forEach(function (key) {
    root.classList.toggle(A11Y_CLASS_MAP[key], !!prefs[key]);
  });
}

// Returns an SVG string for a given icon name.
function a11yIcon(name) {
  var icons = {
    contrast:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<rect x="2" y="3" width="20" height="15" rx="1.5"/>' +
      '<path d="M12 3v15" />' +
      '<rect x="2" y="3" width="10" height="15" rx="1.5" fill="currentColor" stroke="none"/>' +
      '</svg>',

    highlightLinks:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke-linecap="round"/>' +
      '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke-linecap="round"/>' +
      '<line x1="4" y1="20" x2="20" y2="20" stroke-width="2"/>' +
      '</svg>',

    biggerText:
      '<svg viewBox="0 0 24 24" fill="currentColor">' +
      '<text x="1" y="13" font-size="9" font-weight="900" font-family="serif">T</text>' +
      '<text x="10" y="18" font-size="14" font-weight="900" font-family="serif">T</text>' +
      '</svg>',

    textSpacing:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M3 12h18M3 8l-1 4 1 4M21 8l1 4-1 4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    pauseAnimations:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<circle cx="12" cy="12" r="9"/>' +
      '<line x1="10" y1="8" x2="10" y2="16" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="14" y1="8" x2="14" y2="16" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>',

    dyslexia:
      '<svg viewBox="0 0 24 24" fill="currentColor">' +
      '<text x="2" y="16" font-size="12" font-weight="900" font-family="Arial,sans-serif">Df</text>' +
      '</svg>',

    bigCursor:
      '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0.5">' +
      '<path d="M4 2l16 10-7 1.5-4 7.5z"/>' +
      '</svg>',

    tooltips:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<rect x="2" y="3" width="16" height="12" rx="2"/>' +
      '<path d="M6 19l4-4 4 4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<line x1="10" y1="7" x2="10" y2="7.5" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="10" y1="9.5" x2="10" y2="13" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>',

    lineHeight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M4 6h12M4 12h16M4 18h12" stroke-linecap="round"/>' +
      '<path d="M20 3v18M19 4l1-1 1 1M19 20l1 1 1-1" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    textAlign:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M4 6h16M4 11h10M4 16h16" stroke-linecap="round"/>' +
      '</svg>',

    reset:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.36 2.5L3 8" stroke-linecap="round"/>' +
      '<path d="M3 3v5h5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    hide:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',
  };
  return icons[name] || '';
}

// Builds the HTML for one toggleable tile.
function a11yTile(key, label, isOn) {
  return (
    '<button class="a11y-tile' + (isOn ? ' a11y-tile--on' : '') + '" ' +
    'data-key="' + key + '" ' +
    'aria-pressed="' + (isOn ? 'true' : 'false') + '" ' +
    'aria-label="' + label + (isOn ? ', on' : ', off') + '">' +
    '<span class="a11y-tile-icon" aria-hidden="true">' + a11yIcon(key) + '</span>' +
    '<span class="a11y-tile-label">' + label + '</span>' +
    '</button>'
  );
}

function initA11y() {
  // Apply saved prefs immediately so the page renders in the correct mode.
  var prefs = a11yLoadPrefs();
  a11yApplyPrefs(prefs);

  // ── Inject a nav item into the existing navbar ────────────────────────────
  // Every page loads this script and has a .nav-menu <ul> — we add one <li>.
  var navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return; // safety: no nav on this page

  var navItem = document.createElement('li');
  navItem.id = 'a11y-nav-item';

  navItem.innerHTML =
    '<button id="a11y-toggle" aria-label="Open accessibility menu" ' +
    'aria-expanded="false" aria-controls="a11y-panel">Accessibility</button>' +

    '<div id="a11y-panel" role="dialog" aria-label="Accessibility options" hidden>' +

    '<div id="a11y-panel-header">' +
    '<span>Accessibility</span>' +
    '<button id="a11y-close" aria-label="Close accessibility menu">&times;</button>' +
    '</div>' +

    '<div id="a11y-grid" role="group" aria-label="Accessibility toggles">' +
    a11yTile('contrast',        'Contrast +',        !!prefs.contrast) +
    a11yTile('highlightLinks',  'Highlight Links',   !!prefs.highlightLinks) +
    a11yTile('biggerText',      'Bigger Text',       !!prefs.biggerText) +
    a11yTile('textSpacing',     'Text Spacing',      !!prefs.textSpacing) +
    a11yTile('pauseAnimations', 'Pause Animations',  !!prefs.pauseAnimations) +
    a11yTile('dyslexia',        'Dyslexia Friendly', !!prefs.dyslexia) +
    a11yTile('bigCursor',       'Cursor',            !!prefs.bigCursor) +
    a11yTile('tooltips',        'Tooltips',          !!prefs.tooltips) +
    a11yTile('lineHeight',      'Line Height',       !!prefs.lineHeight) +
    a11yTile('textAlign',       'Text Align',        !!prefs.textAlign) +
    '<button id="a11y-reset" aria-label="Reset all accessibility settings">' +
    '<span class="a11y-tile-icon" aria-hidden="true">' + a11yIcon('reset') + '</span>' +
    '<span class="a11y-tile-label">Reset All</span>' +
    '</button>' +
    '</div>' +

    '</div>';

  navMenu.appendChild(navItem);

  // ── Panel open/close helpers ──────────────────────────────────────────────
  var toggleBtn = document.getElementById('a11y-toggle');
  var panel     = document.getElementById('a11y-panel');
  var closeBtn  = document.getElementById('a11y-close');

  function openPanel() {
    panel.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closePanel() {
    panel.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', function () {
    panel.hidden ? openPanel() : closePanel();
  });
  closeBtn.addEventListener('click', function () {
    closePanel();
    toggleBtn.focus();
  });

  // Escape closes the panel
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) {
      closePanel();
      toggleBtn.focus();
    }
  });

  // Click outside the nav item closes the panel
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !navItem.contains(e.target)) closePanel();
  });

  // ── Tile toggle — one handler for all 10 tiles ───────────────────────────
  document.getElementById('a11y-grid').addEventListener('click', function (e) {
    var tile = e.target.closest('[data-key]');
    if (!tile) return;

    var key = tile.dataset.key;
    var prefs = a11yLoadPrefs();
    prefs[key] = !prefs[key];
    a11ySavePrefs(prefs);
    a11yApplyPrefs(prefs);

    tile.classList.toggle('a11y-tile--on', !!prefs[key]);
    tile.setAttribute('aria-pressed', prefs[key] ? 'true' : 'false');
    tile.setAttribute('aria-label',
      tile.querySelector('.a11y-tile-label').textContent +
      (prefs[key] ? ', on' : ', off')
    );
  });

  // ── Reset ─────────────────────────────────────────────────────────────────
  document.getElementById('a11y-reset').addEventListener('click', function () {
    a11ySavePrefs({});
    a11yApplyPrefs({});
    document.querySelectorAll('#a11y-grid [data-key]').forEach(function (tile) {
      tile.classList.remove('a11y-tile--on');
      tile.setAttribute('aria-pressed', 'false');
      tile.setAttribute('aria-label',
        tile.querySelector('.a11y-tile-label').textContent + ', off'
      );
    });
  });

  // ── Custom cursor ring ────────────────────────────────────────────────────
  var cursorRing = document.createElement('div');
  cursorRing.id = 'a11y-cursor';
  cursorRing.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursorRing);

  document.addEventListener('mousemove', function (e) {
    if (document.documentElement.classList.contains('a11y-big-cursor')) {
      cursorRing.style.display = 'block';
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top  = e.clientY + 'px';
    } else {
      cursorRing.style.display = 'none';
    }
  });

  // ── Tooltip overlay ───────────────────────────────────────────────────────
  var tooltipEl = document.createElement('div');
  tooltipEl.id = 'a11y-tooltip';
  tooltipEl.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tooltipEl);

  document.addEventListener('mouseover', function (e) {
    if (!document.documentElement.classList.contains('a11y-tooltips')) return;
    var label = e.target.getAttribute('aria-label') ||
                e.target.getAttribute('title') ||
                e.target.getAttribute('alt');
    if (label) {
      tooltipEl.textContent = label;
      tooltipEl.style.display = 'block';
    }
  });

  document.addEventListener('mousemove', function (e) {
    if (tooltipEl.style.display === 'block') {
      tooltipEl.style.left = (e.clientX + 14) + 'px';
      tooltipEl.style.top  = (e.clientY + 14) + 'px';
    }
  });

  document.addEventListener('mouseout', function () {
    tooltipEl.style.display = 'none';
  });
}

// ── Parallax ──────────────────────────────────────────────────────────────────
// Moves elements at different speeds as the user scrolls, creating depth.
// Uses requestAnimationFrame (ticking pattern) for 60fps performance and
// passive scroll listeners so the browser never waits on JS to paint a frame.

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.documentElement.classList.contains('a11y-pause-anim')) return;

  var heroContent = document.querySelector('.hero-content');

  // ── Inner page hero backgrounds ───────────────────────────────────────────
  // background-attachment: fixed is removed from CSS because it breaks on iOS
  // and causes desktop jank. Instead we inject a child div for the image and
  // drive it with translateY — works reliably on all browsers and devices.
  var pageBgs = [];
  document.querySelectorAll('.page-hero--image').forEach(function (section) {
    var img = section.style.backgroundImage;
    if (!img) return;

    var bgDiv = document.createElement('div');
    bgDiv.className = 'page-hero-bg';
    bgDiv.style.backgroundImage = img;
    section.style.backgroundImage = ''; // image lives on the child now
    section.insertBefore(bgDiv, section.firstChild);

    var h1 = section.querySelector('h1');
    pageBgs.push({ section: section, bg: bgDiv, h1: h1 });
  });

  if (!heroContent && pageBgs.length === 0) return;

  var ticking = false;

  function update() {
    var scrollY = window.scrollY;

    // Homepage hero: text drifts upward at 35% of scroll speed.
    if (heroContent) {
      heroContent.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
    }

    // Inner page heroes: bg image moves at 30% speed (lags behind content),
    // title moves at 25% speed. Both use translateY relative to how far the
    // section has scrolled past the viewport top.
    pageBgs.forEach(function (item) {
      var bounds = item.section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;

      // Negative bounds.top means section has scrolled UP past viewport top.
      // Multiplying by -0.3 shifts the bg DOWN at 30% of that speed —
      // slower than the section itself, creating the parallax depth illusion.
      item.bg.style.transform = 'translateY(' + (-bounds.top * 0.3) + 'px)';

      if (item.h1) {
        item.h1.style.transform = 'translateY(' + (-bounds.top * 0.25) + 'px)';
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
// Uses IntersectionObserver to add .scroll-visible when elements enter the
// viewport. Cards inside grids get stagger delays based on their sibling index.
// Bails out entirely if the browser lacks IntersectionObserver support or if
// the user has Pause Animations enabled in the accessibility widget.

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (document.documentElement.classList.contains('a11y-pause-anim')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var vh = window.innerHeight;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scroll-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  // Only hide + observe an element if it STARTS below the visible viewport.
  // Elements already on screen when the page loads are left exactly as-is —
  // this prevents the flash where visible content goes blank then fades back.
  function setupEl(el, dirClass) {
    var rect = el.getBoundingClientRect();
    if (rect.top < vh) return;        // already visible — leave it alone
    el.classList.add('scroll-hidden');
    if (dirClass) el.classList.add(dirClass);
    observer.observe(el);
  }

  // Standard slide-up targets
  var SLIDE_UP = [
    '.benefit-card', '.class-card', '.tip-card',
    '.feature-item', '.difference-card', '.instructor-card',
    '.offer-card', '.info-block', '.lead-form',
    '.benefits > h2', '.classes-section > h2',
    '.instructors-section > h2', '.content-section h2',
    '.section-intro',
  ];
  SLIDE_UP.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { setupEl(el, null); });
  });

  // Contact page: columns slide in from opposite sides
  document.querySelectorAll('.contact-form-section').forEach(function (el) { setupEl(el, 'from-left'); });
  document.querySelectorAll('.contact-info-section').forEach(function (el) { setupEl(el, 'from-right'); });

  // Stagger delays — only for cards that are actually being hidden
  var GRID_CARDS = '.benefit-card, .class-card, .tip-card, ' +
                   '.feature-item, .difference-card, .instructor-card';
  document.querySelectorAll(GRID_CARDS).forEach(function (el) {
    if (!el.classList.contains('scroll-hidden')) return;
    var siblings = Array.prototype.slice.call(el.parentElement.children);
    var idx = siblings.indexOf(el);
    if (idx >= 1 && idx <= 5) el.classList.add('stagger-' + idx);
  });
}

// ── Lead Generation Form ──────────────────────────────────────────────────────
// Only present on index.html. Validates name + email, saves a claim flag to
// localStorage so the promo code persists on return visits, then reveals the
// code and hides the form.

var LEAD_KEY = 'buki-lead-claimed';

function initLeadGen() {
  var form = document.getElementById('lead-form');
  if (!form) return; // not on the homepage — do nothing

  var claimedEl   = document.getElementById('lead-claimed');
  var nameInput   = document.getElementById('lead-name');
  var emailInput  = document.getElementById('lead-email');
  var nameError   = document.getElementById('lead-name-error');
  var emailError  = document.getElementById('lead-email-error');
  var submitBtn   = form.querySelector('button[type="submit"]');

  // If this browser has already claimed, skip straight to the code.
  if (localStorage.getItem(LEAD_KEY)) {
    form.hidden = true;
    claimedEl.hidden = false;
    return;
  }

  // Clear inline errors as the user corrects each field.
  nameInput.addEventListener('input', function () {
    renderFieldError(nameInput, nameError, '');
  });
  emailInput.addEventListener('input', function () {
    renderFieldError(emailInput, emailError, '');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameVal  = nameInput.value;
    var emailVal = emailInput.value;
    var valid    = true;

    // Validate name
    if (!nameVal.trim()) {
      renderFieldError(nameInput, nameError, 'Name is required.');
      valid = false;
    } else {
      renderFieldError(nameInput, nameError, '');
    }

    // Validate email
    if (!emailVal.trim()) {
      renderFieldError(emailInput, emailError, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      renderFieldError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      renderFieldError(emailInput, emailError, '');
    }

    if (!valid) return;

    // Mark claimed and reveal the promo code.
    submitBtn.disabled = true;
    submitBtn.textContent = 'Claiming\u2026';

    setTimeout(function () {
      localStorage.setItem(LEAD_KEY, '1');
      form.hidden = true;
      claimedEl.hidden = false;
    }, 300);
  });
}

// ── Curtain ───────────────────────────────────────────────────────────────────
// Two silk-gradient panels cover the homepage on load. Scrolling drives them
// apart via translateX so the hero video is gradually revealed underneath.
// Uses the same rAF ticking pattern as initParallax for 60fps performance.

function initCurtain() {
  var curtain = document.getElementById('curtain');
  if (!curtain) return;

  var video  = document.getElementById('curtain-video');
  var canvas = document.getElementById('curtain-canvas');
  var hint   = curtain.querySelector('.curtain-hint');
  var logo   = curtain.querySelector('.curtain-logo');

  if (!video || !canvas) return;

  var ctx = canvas.getContext('2d');

  // Virtual scroll bucket — how many px of wheel input opens the curtain fully.
  var TOTAL       = 700;
  var accumulated = 0;
  var done        = false;
  var ticking     = false;

  // Seek queue — never stack more than one pending seek.
  // When the browser finishes a seek it fires 'seeked'; only then do we
  // issue the next one. This prevents frame-skipping from rapid scroll.
  var seeking     = false;
  var pendingTime = -1;

  // Lock page at top while curtain is active.
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  // ── Canvas helpers ─────────────────────────────────────────────────────────

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Draw current video frame to canvas maintaining object-fit:cover behaviour.
  function drawFrame() {
    var vw = video.videoWidth  || canvas.width;
    var vh = video.videoHeight || canvas.height;
    var scale  = Math.max(canvas.width / vw, canvas.height / vh);
    var drawW  = vw * scale;
    var drawH  = vh * scale;
    var x = (canvas.width  - drawW) / 2;
    var y = (canvas.height - drawH) / 2;
    ctx.drawImage(video, x, y, drawW, drawH);
  }

  // ── Smart seek queue ───────────────────────────────────────────────────────

  function seekTo(time) {
    if (seeking) {
      pendingTime = time; // remember latest target, discard anything older
      return;
    }
    seeking = true;
    video.currentTime = time;
  }

  // Each time a seek completes, draw that frame then process any queued target.
  video.addEventListener('seeked', function () {
    drawFrame();
    seeking = false;
    if (pendingTime >= 0) {
      var t   = pendingTime;
      pendingTime = -1;
      seekTo(t);
    }
  });

  // Paint frame 0 as soon as the video is ready to show.
  video.addEventListener('loadeddata', function () {
    resizeCanvas();
    seekTo(0);
  });

  video.addEventListener('loadedmetadata', function () {
    seekTo(0);
  });

  // ── Scroll / input handling ────────────────────────────────────────────────

  function update() {
    var progress = accumulated / TOTAL;

    if (video.readyState >= 2 && video.duration) {
      seekTo(Math.min(progress, 1) * video.duration);
    }

    var fadeOut = Math.max(0, 1 - progress * 3);
    if (logo) logo.style.opacity = String(fadeOut);
    if (hint) hint.style.opacity = String(fadeOut);

    if (progress >= 1 && !done) {
      done = true;
      curtain.style.visibility = 'hidden';
      document.body.style.overflow = ''; // unlock — page still at top
    }

    ticking = false;
  }

  // Mouse wheel — normalise deltaMode differences across browsers.
  window.addEventListener('wheel', function (e) {
    if (done) return;
    e.preventDefault();
    var delta = e.deltaMode === 1 ? e.deltaY * 40
              : e.deltaMode === 2 ? e.deltaY * 800
              : e.deltaY;
    accumulated = Math.min(TOTAL, Math.max(0, accumulated + delta));
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: false });

  // Touch — swipe up to open.
  var lastTouchY = 0;
  window.addEventListener('touchstart', function (e) {
    lastTouchY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (done) return;
    e.preventDefault();
    var dy = lastTouchY - e.touches[0].clientY;
    lastTouchY = e.touches[0].clientY;
    accumulated = Math.min(TOTAL, Math.max(0, accumulated + dy * 2.5));
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: false });
}

// ── Studio AI Chat ────────────────────────────────────────────────────────────
// Floating chat widget that calls a locally running Ollama model (llama3.2).
// Responses are streamed token-by-token via the Ollama /api/chat streaming
// endpoint so text appears progressively. A session-level Map caches answers
// so the same question never makes a second API call.

function initStudioChat() {
  var OLLAMA_URL = 'http://localhost:11434/api/chat';
  var MODEL      = 'llama3.2';

  var toggle      = document.getElementById('chat-toggle');
  var panel       = document.getElementById('chat-panel');
  var closeBtn    = document.querySelector('.chat-close');
  var messagesEl  = document.getElementById('chat-messages');
  var form        = document.getElementById('chat-form');
  var input       = document.getElementById('chat-input');
  var suggestions = document.querySelectorAll('.chat-suggestion');

  if (!toggle) return; // widget HTML not present on this page

  // Session cache — key: lowercased question, value: full response string
  var responseCache = {};

  var SYSTEM_PROMPT =
    'You are the friendly studio assistant for BUKI-WORX STUDIO, a pole fitness ' +
    'and empowerment studio for women in Orlando, FL (512 Innovation Drive, Orlando FL 32801). ' +
    'Phone: (407) 555-2849. Email: hello@bukiworx.com. ' +
    'Classes offered: Pole Fitness (beginner through advanced), Heels Choreography, ' +
    'Aerial Silks, and Strength Training. All classes welcome all experience levels ' +
    'and body types in a judgment-free zone. ' +
    'New clients get their first class free — promo code BUKIFREE, valid 30 days, no membership required. ' +
    'Private parties are available for bachelorette parties, birthdays, and corporate events. ' +
    'Bookings are made through the Contact page or by calling the studio. ' +
    'Tone: warm, encouraging, empowering. Keep answers to 2–4 sentences. ' +
    'If you do not know specific pricing or schedule details, direct them to contact the studio.';

  // ── Open / close ────────────────────────────────────────────────────────────

  toggle.addEventListener('click', function () {
    var isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));

    // Show a greeting on first open
    if (!isOpen && messagesEl.children.length === 0) {
      addMessage('assistant',
        "Hi! I'm the BUKI-WORX assistant. Ask me about classes, booking, parties, " +
        "or anything else about the studio!"
      );
    }
    if (!isOpen) {
      setTimeout(function () { input.focus(); }, 60);
    }
  });

  closeBtn.addEventListener('click', function () {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  });

  // ── Quick suggestion chips ──────────────────────────────────────────────────

  suggestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (panel.hidden) {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        if (messagesEl.children.length === 0) {
          addMessage('assistant',
            "Hi! I'm the BUKI-WORX assistant. Ask me about classes, booking, parties, " +
            "or anything else about the studio!"
          );
        }
      }
      askQuestion(btn.getAttribute('data-q'));
    });
  });

  // ── Form submit ─────────────────────────────────────────────────────────────

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    askQuestion(q);
  });

  // ── Core: send a question, stream the answer ────────────────────────────────

  function addMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'chat-message chat-message--' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function askQuestion(question) {
    addMessage('user', question);

    var cacheKey = question.toLowerCase().trim();

    // Return cached answer immediately — no API call needed
    if (responseCache[cacheKey]) {
      addMessage('assistant', responseCache[cacheKey]);
      return;
    }

    // Placeholder bubble that fills in as tokens stream in
    var bubble = addMessage('assistant', '');
    bubble.classList.add('chat-message--streaming');
    var accumulated = '';

    fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: question      }
        ]
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);

      var reader  = res.body.getReader();
      var decoder = new TextDecoder();

      // Recursively read chunks until the stream is done.
      // Each chunk is one or more newline-delimited JSON objects from Ollama.
      function readNext() {
        return reader.read().then(function (result) {
          if (result.done) {
            bubble.classList.remove('chat-message--streaming');
            responseCache[cacheKey] = accumulated; // cache completed response
            return;
          }

          var lines = decoder.decode(result.value, { stream: true }).split('\n');
          lines.forEach(function (line) {
            if (!line.trim()) return;
            try {
              var obj = JSON.parse(line);
              if (obj.message && obj.message.content) {
                accumulated += obj.message.content;
                bubble.textContent = accumulated;
                messagesEl.scrollTop = messagesEl.scrollHeight;
              }
            } catch (_) { /* partial JSON — ignore */ }
          });

          return readNext();
        });
      }

      return readNext();
    })
    .catch(function () {
      bubble.classList.remove('chat-message--streaming');
      bubble.textContent =
        "I'm having trouble connecting to the local AI right now. " +
        "Please call us at (407) 555-2849 or email hello@bukiworx.com and we'll be happy to help!";
      bubble.classList.add('chat-message--error');
    });
  }
}

// ── Editorial Nav ─────────────────────────────────────────────────────────────
// On the homepage the header starts transparent so it floats over the full-bleed
// hero video. Once the hero scrolls out of view the header fades to its solid
// state. IntersectionObserver drives the toggle so there is no scroll-event math.

function initEditorialNav() {
  var header = document.querySelector('header');
  var hero   = document.querySelector('.hero');
  if (!header || !hero) return; // only runs on pages that have a .hero section

  // Apply immediately so the first paint is transparent.
  header.classList.add('nav-hero');

  new IntersectionObserver(function (entries) {
    // isIntersecting = hero is still visible → keep transparent
    // not intersecting = hero has scrolled away → show solid header
    header.classList.toggle('nav-hero', entries[0].isIntersecting);
  }, { threshold: 0.12 }).observe(hero);
}

// ── Export guard ──────────────────────────────────────────────────────────────
// In the browser, `module` is not defined, so this block never runs.
// In Node/Jest, it exports the functions for unit testing.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidEmail, validateForm, init };
} else {
  document.addEventListener('DOMContentLoaded', function () {
    init();
    initA11y();
    initLeadGen();
    initCurtain();
    initParallax();
    initScrollReveal();
    initEditorialNav();
    initStudioChat();
  });
}
