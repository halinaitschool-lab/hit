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