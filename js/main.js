(() => {
  const savedLang = localStorage.getItem('cfhf-lang') || 'nl';
  let currentLang = savedLang;

  const doc = document.documentElement;
  const langBtns = document.querySelectorAll('.lang-btn');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const donateConfirm = document.getElementById('donateConfirm');
  const modal = document.getElementById('donationModal');
  const modalClose = document.getElementById('modalClose');
  const modalLater = document.getElementById('modalLater');
  const modalAmount = document.getElementById('modalAmount');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');

  const locale = () => (currentLang === 'en' ? 'en-US' : 'nl-NL');

  const setLang = (lang) => {
    currentLang = lang;
    localStorage.setItem('cfhf-lang', lang);
    doc.lang = TRANSLATIONS[lang]['html.lang'];
    langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));

    document.querySelectorAll('[data-i18n], [data-i18n-w], [data-i18n-c]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const keyW = el.getAttribute('data-i18n-w');
      const keyC = el.getAttribute('data-i18n-c');
      const k = key || keyW || keyC;
      if (TRANSLATIONS[lang][k]) {
        el.innerHTML = TRANSLATIONS[lang][k];
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

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(btn.getAttribute('data-lang'));
    });
  });

  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.main-nav > .nav-list > li > a').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 992px)').matches && a.parentElement.classList.contains('has-submenu')) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
        return;
      }
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const runCounters = () => {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (!target) return;
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString(locale());
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
  counterObserver.observe(document.querySelector('.what-we-do'));

  const heroSlides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  let heroIndex = 0;
  let heroTimer;

  if (heroSlides.length) {
    heroSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }

  const goToSlide = (i) => {
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((s, idx) => s.classList.toggle('active', idx === heroIndex));
    dotsWrap.querySelectorAll('.hero-dot').forEach((d, idx) => d.classList.toggle('active', idx === heroIndex));
    restartHeroTimer();
  };

  const nextSlide = () => goToSlide(heroIndex + 1);
  const prevSlide = () => goToSlide(heroIndex - 1);

  const restartHeroTimer = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(nextSlide, 6500);
  };

  document.getElementById('heroNext').addEventListener('click', nextSlide);
  document.getElementById('heroPrev').addEventListener('click', prevSlide);
  restartHeroTimer();

  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(heroTimer));
  hero.addEventListener('mouseleave', restartHeroTimer);

  let selectedAmount = 25;

  document.querySelectorAll('.amount-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amount-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = btn.getAttribute('data-amount') === 'custom' ? 0 : parseInt(btn.getAttribute('data-amount'), 10);
    });
  });

  donateConfirm.addEventListener('click', () => {
    modalAmount.textContent = selectedAmount === 0 ? '\u2013' : '\u20ac ' + selectedAmount;
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
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formStatus.classList.remove('error');
    formStatus.classList.add('success');
    formStatus.textContent = TRANSLATIONS[currentLang]['form.status.ok'];
    contactForm.reset();
  });

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterMsg.classList.add('ok');
    newsletterMsg.textContent = TRANSLATIONS[currentLang]['newsletter.ok'];
    newsletterForm.reset();
    setTimeout(() => {
      newsletterMsg.textContent = '';
      newsletterMsg.classList.remove('ok');
    }, 5000);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  setLang(savedLang);
})();