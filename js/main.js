(() => {
  const savedLang = localStorage.getItem('cfhf-lang') || 'nl';
  let currentLang = savedLang;

  const doc = document.documentElement;
  const langToggle = document.getElementById('langToggle');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.getElementById('siteHeader');
  const donateConfirm = document.getElementById('donateConfirm');
  const modal = document.getElementById('donationModal');
  const modalClose = document.getElementById('modalClose');
  const modalLater = document.getElementById('modalLater');
  const modalAmount = document.getElementById('modalAmount');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const setLang = (lang) => {
    currentLang = lang;
    localStorage.setItem('cfhf-lang', lang);
    doc.lang = TRANSLATIONS[lang]['html.lang'];
    langToggle.checked = lang === 'en';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang][key]) {
        el.innerHTML = TRANSLATIONS[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const ph = el.getAttribute('data-i18n-ph');
      if (TRANSLATIONS[lang][ph]) {
        el.placeholder = TRANSLATIONS[lang][ph];
      }
    });

    document.title = lang === 'nl'
      ? 'Care For Humanity Foundation Suriname | Samen voor een betere toekomst'
      : 'Care For Humanity Foundation Suriname | Together for a better future';
  };

  langToggle.addEventListener('change', () => {
    setLang(langToggle.checked ? 'en' : 'nl');
  });

  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  const runCounters = () => {
    const els = document.querySelectorAll('[data-count]');
    els.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.floor(eased * target);
        if (el.getAttribute('data-i18n-count') !== null) {
          el.textContent = value.toLocaleString(currentLang === 'en' ? 'en-US' : 'nl-NL');
        } else {
          el.textContent = value.toLocaleString(currentLang === 'en' ? 'en-US' : 'nl-NL');
        }
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounters();
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(document.querySelector('.impact'));

  let selectedAmount = 25;

  document.querySelectorAll('.amount-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amount-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = btn.getAttribute('data-amount') === 'custom' ? 0 : parseInt(btn.getAttribute('data-amount'), 10);
    });
  });

  donateConfirm.addEventListener('click', () => {
    if (selectedAmount === 0) {
      modalAmount.textContent = document.querySelector('.amount-custom').classList.contains('active')
        ? '\u2013'
        : '\u20ac 25';
    } else {
      modalAmount.textContent = '\u20ac ' + selectedAmount;
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modalClose.focus();
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  modalClose.addEventListener('click', closeModal);
  modalLater.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = contactForm.checkValidity();
    if (!valid) {
      contactForm.reportValidity();
      return;
    }
    formStatus.classList.remove('error');
    formStatus.classList.add('success');
    formStatus.textContent = TRANSLATIONS[currentLang]['form.status.ok'];
    contactForm.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  setLang(savedLang);
})();