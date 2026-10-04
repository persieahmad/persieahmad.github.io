(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

  // ---------- Theme toggle ----------
  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', next === 'light' ? '#f7f7fb' : '#0a0a12');
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  };
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---------- Nav background on scroll ----------
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Active section link ----------
  const links = [...navLinks.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

  // ---------- Count-up numbers ----------
  const countUp = (el) => {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    if (reduceMotion) { el.textContent = to.toFixed(dec); return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ---------- Reveal on scroll ----------
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('.count').forEach(countUp);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealObserver.observe(el);
  });

  // ---------- Typed role rotator ----------
  const typed = document.getElementById('typed');
  const phrases = [
    'fast, scalable web experiences',
    'Core Web Vitals that pass',
    'config-driven UI platforms',
    'AI-powered developer tooling',
    'products for 100M+ users',
  ];
  if (typed && !reduceMotion) {
    let p = 0, c = phrases[0].length, deleting = true;
    const step = () => {
      const word = phrases[p];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      let delay = deleting ? 28 : 55;
      if (!deleting && c === word.length) { deleting = true; delay = 2200; }
      else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
      setTimeout(step, delay);
    };
    setTimeout(step, 2600);
  }

  // ---------- Tech logos ----------
  document.querySelectorAll('.logos li').forEach((li) => {
    if (li.dataset.fa) {
      li.insertAdjacentHTML('afterbegin', `<i class="${li.dataset.fa}" aria-hidden="true"></i>`);
      return;
    }
    if (!li.dataset.icon) return;
    const img = new Image();
    img.src = `${DEVICON}${li.dataset.icon}.svg`;
    img.alt = '';
    img.loading = 'lazy';
    img.width = img.height = 20;
    if ('invert' in li.dataset) img.setAttribute('data-invert', '');
    img.onerror = () => img.replaceWith(Object.assign(document.createElement('i'), {
      className: 'fa-solid fa-code', ariaHidden: 'true',
    }));
    li.prepend(img);
  });

  // ---------- Spotlight on stat cards ----------
  document.querySelectorAll('.stat').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ---------- Copy email ----------
  const copyBtn = document.getElementById('copyEmail');
  copyBtn.addEventListener('click', async () => {
    const label = copyBtn.querySelector('span');
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      label.textContent = 'Copied!';
    } catch (e) {
      label.textContent = copyBtn.dataset.email;
    }
    setTimeout(() => { label.textContent = 'Copy email'; }, 2000);
  });

  // ---------- Footer year ----------
  document.getElementById('year').textContent = new Date().getFullYear();
})();
