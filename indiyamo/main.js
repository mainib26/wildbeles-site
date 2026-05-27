// ============================================
// INDIYAMO LANDING — INTERACTIONS
// ============================================

// Dark mode toggle
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  root.setAttribute('data-theme', theme);
  updateToggleIcon(toggle, theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon(toggle, theme);
    });
  }

  function updateToggleIcon(btn, t) {
    if (!btn) return;
    btn.innerHTML = t === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// Sticky nav shadow on scroll
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Waitlist form
(function () {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  const success = document.getElementById('signup-success');
  const status = document.getElementById('signup-status');
  const submit = form.querySelector('button[type="submit"]');
  const params = new URLSearchParams(window.location.search);

  form.querySelectorAll('[data-utm]').forEach(input => {
    input.value = params.get(input.dataset.utm) || '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const encoded = new URLSearchParams(formData).toString();
    const action = form.getAttribute('action') || window.location.pathname;

    setStatus('Joining the waitlist...', false);
    setBusy(true);

    try {
      if (window.location.protocol === 'file:') {
        throw new Error('Waitlist requires a hosted form endpoint');
      }

      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded,
      });

      if (!response.ok) throw new Error('Waitlist submission failed');
      showSuccess();
    } catch (error) {
      setStatus('Something went wrong. Email hello@wildbeles.com and mention Indiyamo early access.', true);
      setBusy(false);
    }
  });

  function showSuccess() {
    form.reset();
    form.style.display = 'none';
    if (success) {
      success.hidden = false;
    }
  }

  function setBusy(isBusy) {
    if (!submit) return;
    submit.disabled = isBusy;
    submit.textContent = isBusy ? 'Joining...' : 'Join the waitlist';
  }

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }
})();

// Scroll-triggered fade-up animations
(function () {
  const targets = document.querySelectorAll('.dimension-card, .indy-feature, .chaos-item');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = (i * 0.05) + 's';
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
