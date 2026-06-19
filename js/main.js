  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateCursor() {
    if (!cursor || !ring) return;
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a,button,.faq-q,.process-card,.result-card,.skill-pill,.sticky-cta').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!cursor || !ring) return;
      cursor.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      if (!cursor || !ring) return;
      cursor.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });

  // SECTIONS & PROGRESS
  const sections = document.querySelectorAll('.section');
  const counter = document.getElementById('sectionCounter');
  const progressBar = document.getElementById('progressBar');
  const arrowDown = document.getElementById('arrowDown');
  let currentSection = 0;

  // Build dots
  if (counter) {
    sections.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => scrollToSection(i);
      counter.appendChild(dot);
    });
  }

  function updateDots(idx) {
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function scrollToSection(idx) {
    if (idx < 0 || idx >= sections.length) return;
    currentSection = idx;
    sections[idx].scrollIntoView({ behavior: 'smooth' });
    updateDots(idx);
  }

  if (arrowDown) {
    arrowDown.addEventListener('click', () => {
      scrollToSection(Math.min(currentSection + 1, sections.length - 1));
    });
  }

  // Update on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = (scrollTop / docH * 100) + '%';
    }

    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        currentSection = i;
        updateDots(i);
        // XP bar trigger
        if (i === 8) triggerXP();
        // Counter trigger
        if (i === 8) triggerCounters();
      }
    });

    if (arrowDown) {
      arrowDown.style.opacity = currentSection >= sections.length - 1 ? '0' : '1';
    }
  });

  // OBSERVE ANIMATIONS
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.observe').forEach(el => observer.observe(el));

  // Remember language choice (for Cloudflare Accept-Language routing)
  document.querySelectorAll('.lang-switcher a.lang-link').forEach(a => {
    a.addEventListener('click', () => {
      const label = (a.textContent || '').trim().toUpperCase();
      const lang = label === 'UA' ? 'ua' : label === 'PL' ? 'pl' : label === 'EN' ? 'en' : null;
      if (!lang) return;
      document.cookie = `hit_lang=${lang}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    });
  });

  // Cookie consent (simple CMP-lite)
  const CONSENT_KEY = 'hit_cookie_consent_v1';
  const CONSENT_DEFAULT = { necessary: true, analytics: false, marketing: false };

  function getLang() {
    const htmlLang = document.documentElement.getAttribute('lang') || 'en';
    if (htmlLang.startsWith('pl')) return 'pl';
    if (htmlLang.startsWith('uk') || htmlLang.startsWith('ua')) return 'ua';
    return 'en';
  }

  const I18N = {
    pl: {
      title: 'Cookies',
      text: 'Używamy plików cookies, aby strona działała poprawnie oraz (opcjonalnie) do analityki i marketingu. Możesz zmienić ustawienia w każdej chwili.',
      acceptAll: 'Akceptuj wszystkie',
      reject: 'Odrzuć',
      manage: 'Ustawienia',
      modalTitle: 'Ustawienia cookies',
      necessary: 'Niezbędne',
      necessaryDesc: 'Wymagane do działania strony (zawsze włączone).',
      analytics: 'Analityczne',
      analyticsDesc: 'Pomagają zrozumieć, jak korzystasz ze strony (włączymy później, jeśli dodasz analitykę).',
      marketing: 'Marketingowe',
      marketingDesc: 'Służą do pomiaru i reklam (np. Pixel — dodamy później).',
      save: 'Zapisz',
      close: 'Zamknij',
      policyPrivacy: 'Polityka prywatności',
      policyCookies: 'Polityka cookies',
      manageLink: 'Zarządzaj cookies',
    },
    en: {
      title: 'Cookies',
      text: 'We use cookies to make the site work properly and (optionally) for analytics and marketing. You can change settings anytime.',
      acceptAll: 'Accept all',
      reject: 'Reject',
      manage: 'Settings',
      modalTitle: 'Cookie settings',
      necessary: 'Necessary',
      necessaryDesc: 'Required for the site to work (always on).',
      analytics: 'Analytics',
      analyticsDesc: 'Helps us understand usage (will be used later if analytics is added).',
      marketing: 'Marketing',
      marketingDesc: 'Used for measurement/ads (e.g. Pixel — can be added later).',
      save: 'Save',
      close: 'Close',
      policyPrivacy: 'Privacy policy',
      policyCookies: 'Cookie policy',
      manageLink: 'Manage cookies',
    },
    ua: {
      title: 'Cookies',
      text: 'Ми використовуємо cookies, щоб сайт працював коректно, а також (за бажанням) для аналітики й маркетингу. Налаштування можна змінити будь-коли.',
      acceptAll: 'Прийняти все',
      reject: 'Відхилити',
      manage: 'Налаштування',
      modalTitle: 'Налаштування cookies',
      necessary: 'Необхідні',
      necessaryDesc: 'Потрібні для роботи сайту (завжди увімкнені).',
      analytics: 'Аналітика',
      analyticsDesc: 'Допомагає зрозуміти використання (увімкнемо пізніше, якщо додамо аналітику).',
      marketing: 'Маркетинг',
      marketingDesc: 'Для вимірювання та реклами (наприклад Pixel — додамо пізніше).',
      save: 'Зберегти',
      close: 'Закрити',
      policyPrivacy: 'Політика конфіденційності',
      policyCookies: 'Політика cookies',
      manageLink: 'Керувати cookies',
    },
  };

  function loadConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return { ...CONSENT_DEFAULT, ...parsed };
    } catch {
      return null;
    }
  }

  function saveConsent(consent) {
    const payload = {
      ...CONSENT_DEFAULT,
      ...consent,
      necessary: true,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
    return payload;
  }

  function ensureCookieUI() {
    if (document.getElementById('cookieBanner')) return;
    const lang = getLang();
    const t = I18N[lang] || I18N.en;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <div>
          <div class="cookie-title">${t.title}</div>
          <div class="cookie-text">${t.text}</div>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn" type="button" data-cookie-action="reject">${t.reject}</button>
          <button class="cookie-btn" type="button" data-cookie-action="manage">${t.manage}</button>
          <button class="cookie-btn primary" type="button" data-cookie-action="accept">${t.acceptAll}</button>
        </div>
      </div>
    `;

    const backdrop = document.createElement('div');
    backdrop.className = 'cookie-backdrop';
    backdrop.id = 'cookieBackdrop';

    const modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.id = 'cookieModal';
    modal.innerHTML = `
      <div class="cookie-modal-head">
        <div>
          <h3>${t.modalTitle}</h3>
          <div class="cookie-text" style="margin-top: .35rem;">
            <a href="./polityka-prywatnosci.html">${t.policyPrivacy}</a> ·
            <a href="./polityka-cookies.html">${t.policyCookies}</a>
          </div>
        </div>
        <button class="cookie-close" type="button" aria-label="${t.close}">×</button>
      </div>
      <div class="cookie-options">
        <div class="cookie-option">
          <div>
            <div class="cookie-option-title">${t.necessary}</div>
            <div class="cookie-option-desc">${t.necessaryDesc}</div>
          </div>
          <div class="cookie-switch">
            <input type="checkbox" checked disabled />
          </div>
        </div>
        <div class="cookie-option">
          <div>
            <div class="cookie-option-title">${t.analytics}</div>
            <div class="cookie-option-desc">${t.analyticsDesc}</div>
          </div>
          <label class="cookie-switch">
            <input id="cookieAnalytics" type="checkbox" />
          </label>
        </div>
        <div class="cookie-option">
          <div>
            <div class="cookie-option-title">${t.marketing}</div>
            <div class="cookie-option-desc">${t.marketingDesc}</div>
          </div>
          <label class="cookie-switch">
            <input id="cookieMarketing" type="checkbox" />
          </label>
        </div>
      </div>
      <div class="cookie-modal-actions">
        <button class="cookie-btn" type="button" data-cookie-action="reject">${t.reject}</button>
        <button class="cookie-btn primary" type="button" data-cookie-action="save">${t.save}</button>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    function openModal() {
      backdrop.classList.add('open');
      modal.classList.add('open');
      const consent = loadConsent() || CONSENT_DEFAULT;
      const a = document.getElementById('cookieAnalytics');
      const m = document.getElementById('cookieMarketing');
      if (a) a.checked = !!consent.analytics;
      if (m) m.checked = !!consent.marketing;
    }

    function closeModal() {
      backdrop.classList.remove('open');
      modal.classList.remove('open');
    }

    function hideBanner() {
      banner.remove();
    }

    function setAll(val) {
      saveConsent({ analytics: val, marketing: val });
      closeModal();
      hideBanner();
    }

    function rejectAll() {
      saveConsent({ analytics: false, marketing: false });
      closeModal();
      hideBanner();
    }

    function saveFromModal() {
      const a = document.getElementById('cookieAnalytics');
      const m = document.getElementById('cookieMarketing');
      saveConsent({ analytics: !!(a && a.checked), marketing: !!(m && m.checked) });
      closeModal();
      hideBanner();
    }

    banner.querySelectorAll('[data-cookie-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-cookie-action');
        if (action === 'accept') setAll(true);
        if (action === 'reject') rejectAll();
        if (action === 'manage') openModal();
      });
    });

    modal.querySelectorAll('[data-cookie-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-cookie-action');
        if (action === 'reject') rejectAll();
        if (action === 'save') saveFromModal();
      });
    });

    modal.querySelector('.cookie-close')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // External link: open settings
    document.querySelectorAll('[data-open-cookie-settings]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });
  }

  // Show banner only if user has not decided yet.
  if (!loadConsent()) {
    ensureCookieUI();
  } else {
    // Still allow opening settings from footer links
    document.querySelectorAll('[data-open-cookie-settings]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        ensureCookieUI();
        document.querySelector('[data-cookie-action=\"manage\"]')?.dispatchEvent(new Event('click'));
      });
    });
  }

  // FAQ
  function toggleFaq(el) {
    const item = el.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  // XP BAR
  let xpTriggered = false;
  function triggerXP() {
    if (xpTriggered) return;
    const xpBar = document.getElementById('xpBar');
    if (!xpBar) return;
    xpTriggered = true;
    setTimeout(() => { xpBar.style.width = '72%'; }, 300);
  }

  // COUNTERS
  let countersTriggered = false;
  function triggerCounters() {
    if (countersTriggered) return;
    const countNums = document.querySelectorAll('.count-num');
    if (!countNums.length) return;
    countersTriggered = true;
    countNums.forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }

  // EMAIL FORM
  function handleSubmit() {
    const email = document.getElementById('emailInput').value;
    if (!email || !email.includes('@')) {
      document.getElementById('emailInput').style.borderColor = 'var(--coral)';
      return;
    }
    const btn = document.querySelector('.cta-submit');
    btn.textContent = '✓ Gotowe! Odezwę się wkrótce';
    btn.style.background = 'var(--ink)';
    document.getElementById('emailInput').value = '';
  }

  // KEYBOARD NAV
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); scrollToSection(Math.min(currentSection + 1, sections.length - 1)); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); scrollToSection(Math.max(currentSection - 1, 0)); }
  });

  // STICKY CTA BUTTON
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const heroSection = sections[0];
      const heroHeight = heroSection ? heroSection.offsetHeight : 0;
      
      // Show sticky button after scrolling past hero section
      if (scrollTop > heroHeight * 0.5) {
        stickyCta.classList.remove('hidden');
      } else {
        stickyCta.classList.add('hidden');
      }
    });

    // Add hover effect to sticky button
    stickyCta.addEventListener('mouseenter', () => {
      if (!cursor || !ring) return;
      cursor.classList.add('hovering');
      ring.classList.add('hovering');
    });
    stickyCta.addEventListener('mouseleave', () => {
      if (!cursor || !ring) return;
      cursor.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  }