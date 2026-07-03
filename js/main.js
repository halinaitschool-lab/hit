(function () {
  const SITE_URL = document.body.dataset.siteUrl || window.location.href;
  const WP_BENCHMARK_S = 8.6;

  function getLang() {
    const htmlLang = document.documentElement.getAttribute('lang') || 'en';
    if (htmlLang.startsWith('pl')) return 'pl';
    if (htmlLang.startsWith('uk') || htmlLang.startsWith('ua')) return 'ua';
    return 'en';
  }

  const TYPE_PHRASES = {
    en: [
      'hand-coded, not templated.',
      '80–200KB. under 1 second.',
      'built to sound like you.',
      'no plugins. no bloat.',
    ],
    pl: [
      'kod ręczny, nie szablon.',
      '80–200KB. poniżej 1 sekundy.',
      'brzmi jak Ty.',
      'bez wtyczek. bez balastu.',
    ],
    ua: [
      'ручний код, не шаблон.',
      '80–200KB. менше ніж 1 секунда.',
      'звучить як ти.',
      'без плагінів. без баласту.',
    ],
  };

  const header = document.getElementById('header');
  if (header) {
    window.addEventListener(
      'scroll',
      () => header.classList.toggle('scrolled', window.scrollY > 30),
      { passive: true }
    );
  }

  const burger = document.getElementById('burger');
  const panel = document.getElementById('mobilePanel');
  if (burger && panel) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      panel.classList.toggle('open');
    });
    panel.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        panel.classList.remove('open');
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  const railIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.rail-node').forEach((el) => railIo.observe(el));

  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const otherA = other.querySelector('.faq-a');
          if (otherA) otherA.style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? `${a.scrollHeight}px` : null;
    });
  });

  const isTouch = matchMedia('(hover:none), (pointer:coarse)').matches;
  if (!isTouch) {
    document.body.classList.add('cursor-active');
    const dot = document.getElementById('cursorDot');
    const label = document.getElementById('cursorLabel');

    window.addEventListener('mousemove', (e) => {
      if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      }
      if (label) {
        label.style.left = `${e.clientX}px`;
        label.style.top = `${e.clientY - 34}px`;
      }
      document.body.classList.add('cursor-ready');
    });

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (!label) return;
        label.textContent = el.getAttribute('data-cursor');
        label.classList.add('show');
      });
      el.addEventListener('mouseleave', () => label?.classList.remove('show'));
    });

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle && !isTouch) {
    window.addEventListener(
      'mousemove',
      (e) => {
        const r = heroTitle.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const radius = 420;
        if (dist < radius) {
          const t = 1 - dist / radius;
          heroTitle.style.fontVariationSettings = `"opsz" ${40 + t * 20}, "wght" ${500 + t * 180}`;
        } else {
          heroTitle.style.fontVariationSettings = '"opsz" 40, "wght" 500';
        }
      },
      { passive: true }
    );
  }

  const typeText = document.getElementById('typeText');
  if (typeText) {
    const phrases = TYPE_PHRASES[getLang()] || TYPE_PHRASES.en;
    let pIdx = 0;
    let cIdx = 0;
    let deleting = false;
    function typeLoop() {
      const current = phrases[pIdx];
      if (!deleting) {
        cIdx += 1;
        typeText.textContent = current.slice(0, cIdx);
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        cIdx -= 1;
        typeText.textContent = current.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 30 : 55);
    }
    typeLoop();
  }

  function wireVoicePlayer(btn, audioEl, cardEl) {
    if (!btn || !audioEl) return;
    btn.addEventListener('click', () => {
      if (!audioEl.src) {
        btn.textContent = '—';
        btn.title = btn.dataset.emptyTitle || 'Add audio to enable playback';
        return;
      }
      if (audioEl.paused) {
        audioEl.play();
        btn.textContent = '❚❚';
        cardEl?.classList.add('playing');
      } else {
        audioEl.pause();
        btn.textContent = '▶';
        cardEl?.classList.remove('playing');
      }
    });
    audioEl.addEventListener('ended', () => {
      btn.textContent = '▶';
      cardEl?.classList.remove('playing');
    });
  }

  wireVoicePlayer(
    document.getElementById('voicePlay'),
    document.getElementById('voiceAudio'),
    document.getElementById('voiceCard')
  );
  document.querySelectorAll('.testi-voice-btn').forEach((btn) => {
    const key = btn.getAttribute('data-audio');
    wireVoicePlayer(btn, document.getElementById(`audio-${key}`), null);
  });

  function reportLoadTime() {
    const trustLoad = document.getElementById('trustLoad');
    const chip = document.getElementById('loadChip');
    if (!trustLoad || !chip) return;

    let ms;
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) ms = nav.loadEventEnd - nav.startTime;
    else ms = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (!ms || ms <= 0) ms = performance.now();

    const s = (ms / 1000).toFixed(2);
    const good = ms < 1000;
    trustLoad.textContent = `${s}s`;
    trustLoad.classList.add('live');
    chip.classList.add(good ? 'ready' : 'warn');
    chip.innerHTML = `<span class="led"></span>${chip.dataset.loadedLabel || 'Loaded in'} <b>${s}s</b>`;

    const raceLabel = document.getElementById('raceThisLabel');
    const raceThis = document.getElementById('raceThisFill');
    const raceWp = document.getElementById('raceWpFill');
    if (raceLabel && raceThis && raceWp) {
      const thisSeconds = ms / 1000;
      raceLabel.textContent = `${thisSeconds.toFixed(2)}s`;
      requestAnimationFrame(() => {
        raceThis.style.width = `${Math.min((thisSeconds / WP_BENCHMARK_S) * 100, 100)}%`;
        raceWp.style.width = '100%';
      });
    }
  }

  if (document.readyState === 'complete') reportLoadTime();
  else window.addEventListener('load', () => setTimeout(reportLoadTime, 0));

  async function loadPageSpeedBadge() {
    const chip = document.getElementById('psiChip');
    const trustPsi = document.getElementById('trustPsi');
    if (!chip && !trustPsi) return;

    try {
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&strategy=mobile&category=performance`;
      const res = await fetch(api);
      if (!res.ok) throw new Error('psi_unavailable');
      const data = await res.json();
      const score = Math.round(data.lighthouseResult.categories.performance.score * 100);
      if (chip) {
        chip.classList.add(score >= 90 ? 'ready' : 'warn');
        chip.innerHTML = `<span class="led"></span>${chip.dataset.psiLabel || 'PageSpeed'}: <b>${score}/100</b>`;
      }
      if (trustPsi) trustPsi.textContent = `${score}/100`;
    } catch {
      if (chip) {
        chip.classList.add('warn');
        chip.innerHTML = `<span class="led"></span>${chip.dataset.psiFallback || 'PageSpeed when live'}`;
      }
      if (trustPsi) trustPsi.textContent = '—';
    }
  }
  loadPageSpeedBadge();

  (function loadWebVitals() {
    if (!document.getElementById('cwvLcp')) return;
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js';
    s.onload = () => {
      const fmtMs = (v) => `${(v / 1000).toFixed(2)}s`;
      const offline = document.body.dataset.cwvOffline || 'offline — reconnect to measure';
      webVitals.onLCP((m) => {
        const el = document.getElementById('cwvLcp');
        if (!el) return;
        el.textContent = fmtMs(m.value);
        el.classList.remove('pending');
        el.classList.add(m.value < 2500 ? 'good' : '');
      });
      webVitals.onCLS((m) => {
        const el = document.getElementById('cwvCls');
        if (!el) return;
        el.textContent = m.value.toFixed(3);
        el.classList.remove('pending');
        el.classList.add(m.value < 0.1 ? 'good' : '');
      });
      webVitals.onINP((m) => {
        const el = document.getElementById('cwvInp');
        if (!el) return;
        el.textContent = `${Math.round(m.value)}ms`;
        el.classList.remove('pending');
        el.classList.add(m.value < 200 ? 'good' : '');
      });
    };
    s.onerror = () => {
      ['cwvLcp', 'cwvCls', 'cwvInp'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = document.body.dataset.cwvOffline || 'offline';
      });
    };
    document.head.appendChild(s);
  })();

  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    window.addEventListener(
      'scroll',
      () => {
        stickyCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.45);
      },
      { passive: true }
    );
  }

  document.querySelectorAll('[data-lang-link]').forEach((a) => {
    a.addEventListener('click', () => {
      const lang = a.getAttribute('data-lang-link');
      if (lang) document.cookie = `hit_lang=${lang}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    });
  });

  const CONSENT_KEY = 'hit_cookie_consent_v1';
  const CONSENT_DEFAULT = { necessary: true, analytics: false, marketing: false };

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
      analyticsDesc: 'Pomagają zrozumieć, jak korzystasz ze strony.',
      marketing: 'Marketingowe',
      marketingDesc: 'Służą do pomiaru i reklam (np. Pixel).',
      save: 'Zapisz',
      close: 'Zamknij',
      policyPrivacy: 'Polityka prywatności',
      policyCookies: 'Polityka cookies',
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
      analyticsDesc: 'Helps us understand usage.',
      marketing: 'Marketing',
      marketingDesc: 'Used for measurement/ads (e.g. Pixel).',
      save: 'Save',
      close: 'Close',
      policyPrivacy: 'Privacy policy',
      policyCookies: 'Cookie policy',
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
      analyticsDesc: 'Допомагає зрозуміти використання.',
      marketing: 'Маркетинг',
      marketingDesc: 'Для вимірювання та реклами (наприклад Pixel).',
      save: 'Зберегти',
      close: 'Закрити',
      policyPrivacy: 'Політика конфіденційності',
      policyCookies: 'Політика cookies',
    },
  };

  function loadConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      return { ...CONSENT_DEFAULT, ...JSON.parse(raw) };
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
    const t = I18N[getLang()] || I18N.en;

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
      </div>`;

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
          <div class="cookie-text" style="margin-top:.35rem;">
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
          <div class="cookie-switch"><input type="checkbox" checked disabled /></div>
        </div>
        <div class="cookie-option">
          <div>
            <div class="cookie-option-title">${t.analytics}</div>
            <div class="cookie-option-desc">${t.analyticsDesc}</div>
          </div>
          <label class="cookie-switch"><input id="cookieAnalytics" type="checkbox" /></label>
        </div>
        <div class="cookie-option">
          <div>
            <div class="cookie-option-title">${t.marketing}</div>
            <div class="cookie-option-desc">${t.marketingDesc}</div>
          </div>
          <label class="cookie-switch"><input id="cookieMarketing" type="checkbox" /></label>
        </div>
      </div>
      <div class="cookie-modal-actions">
        <button class="cookie-btn" type="button" data-cookie-action="reject">${t.reject}</button>
        <button class="cookie-btn primary" type="button" data-cookie-action="save">${t.save}</button>
      </div>`;

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

    banner.querySelectorAll('[data-cookie-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-cookie-action');
        if (action === 'accept') {
          saveConsent({ analytics: true, marketing: true });
          closeModal();
          hideBanner();
        }
        if (action === 'reject') {
          saveConsent({ analytics: false, marketing: false });
          closeModal();
          hideBanner();
        }
        if (action === 'manage') openModal();
      });
    });

    modal.querySelectorAll('[data-cookie-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-cookie-action');
        if (action === 'reject') {
          saveConsent({ analytics: false, marketing: false });
          closeModal();
          hideBanner();
        }
        if (action === 'save') {
          const a = document.getElementById('cookieAnalytics');
          const m = document.getElementById('cookieMarketing');
          saveConsent({ analytics: !!(a && a.checked), marketing: !!(m && m.checked) });
          closeModal();
          hideBanner();
        }
      });
    });

    modal.querySelector('.cookie-close')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.querySelectorAll('[data-open-cookie-settings]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });
  }

  if (!loadConsent()) ensureCookieUI();
  else {
    document.querySelectorAll('[data-open-cookie-settings]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        ensureCookieUI();
        document.querySelector('[data-cookie-action="manage"]')?.click();
      });
    });
  }
})();
