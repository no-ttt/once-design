/** Shared page shell. Load before page-specific scripts; works on static hosting. */
(() => {
  const header = `
  <header class="site-header">
    <a href="index.html" class="brand-logo" id="brandLogo" aria-label="ONCE DESIGN Home">
    <img src="assets/${document.body.dataset.page === 'quote' ? 'quote-logo.png' : 'logo.png'}" alt="ONCE DESIGN Logo" width="181" height="83">
    </a>
  </header>

  <!-- Menu 按鈕獨立放在 site-header 外面：header 帶有 perspective，會讓內部 position:fixed
       的子元素被限制在 header 範圍內捲動，移出來才能真正懸浮固定在視窗右上角 -->
  <button class="menu-toggle-btn" id="menuToggleBtn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navDrawer">
    <svg class="menu-btn-icon" viewBox="0 0 23 20" width="23" height="20" aria-hidden="true">
      <path fill="currentColor" fill-rule="evenodd" d="M23 10a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h21a1 1 0 0 1 1 1m0-9a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h21a1 1 0 0 1 1 1m0 18a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h14a1 1 0 0 1 1 1"/>
    </svg>
  </button>

  <!-- Background Dim Overlay when Drawer is Opened -->
  <div class="nav-drawer-backdrop" id="navDrawerBackdrop" aria-hidden="true"></div>

  <!-- Side Navigation Drawer (Wix Studio 1:1 Right-side Panel) -->
  <aside tabindex="-1" role="dialog" aria-modal="true" aria-label="Navigation" class="nav-drawer" id="navDrawer" aria-hidden="true">
    <div class="drawer-header">
      <div class="lang-switch" aria-label="Language Selector">
        <span class="lang-item active">EN</span>
        <span class="lang-item">中</span>
      </div>
      <button class="nav-close-btn" id="navCloseBtn" aria-label="Close navigation menu">
        <svg class="nav-close-icon" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
          <path d="M.293.293a1 1 0 0 1 1.414 0L16 14.586 30.293.293a1 1 0 1 1 1.414 1.414L17.414 16l14.293 14.293a1 1 0 0 1-1.414 1.414L16 17.414 1.707 31.707a1 1 0 0 1-1.414-1.414L14.586 16 .293 1.707a1 1 0 0 1 0-1.414" fill="currentColor" fill-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <ul class="nav-menu-list">
      <li><a href="index.html#home">HOME</a></li>
      <li><a href="about.html">ABOUT</a></li>
      <li><a href="work.html">WORK</a></li>
      <li><a href="trends.html">TRENDS</a></li>
      <li><a href="index.html#faqs">FAQS</a></li>
      <li><a href="index.html#contact">CONTACT</a></li>
      <li><a href="quote.html">QUOTE</a></li>
    </ul>
  </aside>
`;
  const footer = `
  <footer class="site-footer">
    <div class="footer-top-row">
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="index.html#home">HOME</a>
        <a href="about.html">ABOUT</a>
        <a href="work.html">WORK</a>
        <a href="trends.html">TRENDS</a>
        <a href="index.html#faqs">FAQS</a>
        <a href="index.html#contact">CONTACT</a>
        <a href="quote.html">QUOTE</a>
      </nav>
      <button class="back-to-top" id="backToTop" type="button">BACK TO TOP <span aria-hidden="true">↑</span></button>
    </div>
    <p class="footer-copyright">COPYRIGHT © ONCE DESIGN 2026. ALL RIGHTS RESERVED</p>
  </footer>
`;
  document.querySelector('[data-site-header]')?.insertAdjacentHTML('afterbegin', header);
  document.querySelector('[data-site-footer]')?.insertAdjacentHTML('afterbegin', footer);
  const contact = `
    <section class="contact-section" id="contact" aria-labelledby="contactTitle">
      <div class="contact-badge">FIND US</div>
      <h2 class="contact-title" id="contactTitle">CONTACT</h2>
      <div class="contact-layout">
        <div class="contact-info">
          <a href="index.html#home" aria-label="ONCE DESIGN Home"><img class="contact-logo" src="assets/contact-logo.png" alt="ONCE DESIGN" width="120" height="120" loading="lazy"></a>
          <ul class="contact-links">
            <li><a class="contact-link" href="https://api.whatsapp.com/send/?phone=85292232561" target="_blank" rel="noopener noreferrer">
              <img class="contact-link-icon" src="assets/contact-whatsapp.svg" alt="" width="16" height="18" aria-hidden="true">
              <span class="contact-link-label">+852-9223 2561</span>
              <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a></li>
            <li><a class="contact-link" href="tel:+85229629093">
              <img class="contact-link-icon" src="assets/contact-phone.svg" alt="" width="16" height="18" aria-hidden="true">
              <span class="contact-link-label">+852-2962 9093</span>
              <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a></li>
            <li><a class="contact-link" href="mailto:info@once-hk.com">
              <img class="contact-link-icon" src="assets/contact-email.svg" alt="" width="16" height="18" aria-hidden="true">
              <span class="contact-link-label">INFO@ONCE-HK.COM</span>
              <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a></li>
            <li><a class="contact-link" href="https://www.instagram.com/oncedesignhk/" target="_blank" rel="noopener noreferrer">
              <img class="contact-link-icon" src="assets/contact-instagram.svg" alt="" width="16" height="18" aria-hidden="true">
              <span class="contact-link-label">ONCEDESIGNHK</span>
              <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a></li>
            <li><a class="contact-link" href="https://www.facebook.com/oncedesignhk" target="_blank" rel="noopener noreferrer">
              <img class="contact-link-icon" src="assets/contact-facebook.svg" alt="" width="16" height="18" aria-hidden="true">
              <span class="contact-link-label">ONCEDESIGNHK</span>
              <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a></li>
            <li><a class="contact-link contact-link-address" href="https://maps.app.goo.gl/KH1wTtNLEGiVWhoV7" target="_blank" rel="noopener noreferrer">
              <img class="contact-link-icon" src="assets/contact-location.svg" alt="" width="16" height="18" aria-hidden="true">
              <span class="contact-link-label">Room 2007, 20/F, Wayson Commercial Building,<br>28 Connaught Road West, Sheung Wan, HK</span>
              <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a></li>
          </ul>
        </div>
        <div class="contact-consultation" id="quote">
          <h3>START OUR CONSULTATION</h3>
          <form class="contact-form" id="consultationForm" novalidate>
            <label class="contact-field">FIRST NAME<input name="firstName" autocomplete="given-name" type="text"></label>
            <label class="contact-field">LAST NAME<input name="lastName" autocomplete="family-name" type="text"></label>
            <label class="contact-field">EMAIL <span aria-hidden="true">*</span><input name="email" autocomplete="email" type="email" required></label>
            <div class="contact-field"><label for="contactPhone">PHONE NUMBER</label><span class="contact-phone-field"><span class="contact-country-icon" aria-hidden="true"></span><select name="phoneCountry" aria-label="Country code"><option value="+852">+852</option><option value="+86">+86</option><option value="+886">+886</option><option value="+1">+1</option><option value="+44">+44</option><option value="+81">+81</option><option value="+82">+82</option><option value="+65">+65</option><option value="+61">+61</option></select><span class="contact-country-chevron" aria-hidden="true">⌃</span><input id="contactPhone" name="phone" autocomplete="tel" type="tel"></span></div>
            <label class="contact-field contact-field-full">COMPANY NAME<input name="company" autocomplete="organization" type="text"></label>
            <label class="contact-field contact-field-full">DESIGN REQUIREMENT / PROJECT TYPE<textarea name="requirement" rows="2"></textarea></label>
            <label class="contact-field contact-field-full contact-upload">
              UPLOAD FLOOR PLAN ( JPG / PDF ) <span aria-hidden="true">*</span>
              <span class="contact-upload-control">
                <span class="contact-upload-name" id="floorPlanName" aria-live="polite"></span>
                <input name="floorPlan" type="file" aria-label="Choose floor plan, JPG or PDF" accept="image/jpeg,application/pdf,.jpg,.jpeg,.pdf" required>
              </span>
            </label>
            <button class="contact-submit" type="submit">SUBMIT</button>
            <div class="contact-form-response" id="consultationResponse" role="status" hidden>
              <p>Continue by email and attach your floor plan.</p>
              <a id="consultationEmail" href="mailto:info@once-hk.com">OPEN EMAIL ↗</a>
            </div>
          </form>
        </div>
      </div>
    </section>
`;
  document.querySelector('[data-site-contact]')?.insertAdjacentHTML('afterbegin', contact);
  const toggle = document.getElementById('menuToggleBtn');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navDrawerBackdrop');
  const close = document.getElementById('navCloseBtn');
  let previousFocus;
  const setOpen = open => {
    if (open === drawer.classList.contains('open')) return;
    if (open) {
      previousFocus = document.activeElement;
    }
    toggle.classList.toggle('is-active', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.inert = !open;
    backdrop.classList.toggle('open', open);
    if (open) close.focus({ preventScroll: true });
    else previousFocus?.focus({ preventScroll: true });
  };
  if (toggle && drawer) {
    // Keep navigation above every page stacking context without changing layout.
    const navigationLayer = document.createElement('div');
    navigationLayer.className = 'site-navigation-layer';
    document.body.append(navigationLayer);
    navigationLayer.append(backdrop, toggle, drawer);
    const preventBackgroundScroll = event => {
      if (drawer.classList.contains('open') && !drawer.contains(event.target)) {
        event.preventDefault();
      }
    };
    document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    drawer.inert = true;
    toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
    close.addEventListener('click', () => setOpen(false));
    backdrop.addEventListener('click', () => setOpen(false));
    drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
      if (!drawer.classList.contains('open')) return;
      if (event.key === 'Escape') setOpen(false);
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)
        && !event.target.closest('input, textarea, select, [contenteditable="true"]')
        && !(event.key === ' ' && event.target.closest('button, a'))) {
        event.preventDefault();
      }
      if (event.key !== 'Tab') return;
      const items = [...drawer.querySelectorAll('button, a[href]')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    const icon = close.querySelector('.nav-close-icon');
    close.addEventListener('mouseenter', () => { icon.classList.remove('spin-back'); icon.classList.add('spin-to-cross'); });
    close.addEventListener('mouseleave', () => { icon.classList.remove('spin-to-cross'); icon.classList.add('spin-back'); });
  }
  const currentPage = { about: 'about.html', work: 'work.html', trends: 'trends.html', quote: 'quote.html' }[document.body.dataset.page] || 'index.html#home';
  document.querySelectorAll('.nav-menu-list a, .footer-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
  });
  // A cross-page hash normally jumps directly to its destination before the
  // homepage paints. Store the target instead so the homepage can visibly
  // scroll down to it after it has loaded.
  const homeSectionLinks = [...document.querySelectorAll('a[href^="index.html#"]')];
  const smoothScrollToHomeSection = targetId => {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      return;
    }
    const start = scrollY;
    const destination = start + target.getBoundingClientRect().top;
    const distance = destination - start;
    const duration = 4000;
    const startedAt = performance.now();
    const ease = progress => 1 - Math.pow(1 - progress, 3);
    const step = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      scrollTo(0, start + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  homeSectionLinks.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const targetId = link.getAttribute('href').split('#')[1];
    if (!targetId) return;
    event.preventDefault();
    if (document.body.dataset.page === 'home') {
      smoothScrollToHomeSection(targetId);
      history.replaceState(null, '', `#${targetId}`);
      return;
    }
    sessionStorage.setItem('once-smooth-home-target', targetId);
    location.assign('index.html');
  }));
  if (document.body.dataset.page === 'home') {
    const targetId = sessionStorage.getItem('once-smooth-home-target');
    if (targetId) {
      const scrollToStoredTarget = () => {
        sessionStorage.removeItem('once-smooth-home-target');
        smoothScrollToHomeSection(targetId);
        history.replaceState(null, '', `#${targetId}`);
      };
      // Wait for the homepage layout, images and page-specific scripts to
      // settle; otherwise the initial hero layout can overwrite the scroll.
      const startScroll = () => setTimeout(scrollToStoredTarget, 120);
      if (document.readyState === 'complete') startScroll();
      else addEventListener('load', startScroll, { once: true });
    }
  }
  // On the home page, keep the location indicator in sync with the section
  // currently occupying the viewport instead of leaving HOME selected.
  if (document.body.dataset.page === 'home' && 'IntersectionObserver' in window) {
    const sectionLinks = [...document.querySelectorAll('.nav-menu-list a, .footer-nav a')];
    const targets = ['home', 'faqs', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
    const setCurrent = id => sectionLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const active = href === `index.html#${id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else if (href.startsWith('index.html#')) link.removeAttribute('aria-current');
    });
    const locationObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrent(visible.target.id);
    }, { threshold: [0.15, 0.4, 0.7], rootMargin: '-12% 0px -45% 0px' });
    targets.forEach(target => locationObserver.observe(target));
    const updateLocation = () => {
      const line = innerHeight * 0.42;
      const current = [...targets].reverse().find(target => {
        const rect = target.getBoundingClientRect();
        return rect.top <= line && rect.bottom >= line;
      });
      if (current) setCurrent(current.id);
    };
    addEventListener('scroll', updateLocation, { passive: true });
    addEventListener('resize', updateLocation);
    updateLocation();
  }
  document.getElementById('backToTop')?.addEventListener('click', () => window.scrollTo({
    top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  }));
  const consultationForm = document.getElementById('consultationForm');
  const phoneSelect = consultationForm?.querySelector('select[name="phoneCountry"]');
  if (phoneSelect) {
    phoneSelect.style.display = 'none';
    const field = phoneSelect.closest('.contact-phone-field');
    const choices = [
      ['Afghanistan','+93','🇦🇫'],['Aland Islands','+358','🇦🇽'],['Albania','+355','🇦🇱'],['Algeria','+213','🇩🇿'],['American Samoa','+1684','🇦🇸'],
      ['Australia','+61','🇦🇺'],['Canada','+1','🇨🇦'],['China','+86','🇨🇳'],['Hong Kong','+852','🇭🇰'],['Japan','+81','🇯🇵'],['Singapore','+65','🇸🇬'],['Taiwan','+886','🇹🇼'],['United Kingdom','+44','🇬🇧'],['United States','+1','🇺🇸']
    ];
    const current = field.querySelector('.contact-country-icon');
    current.innerHTML = '<button type="button" class="country-trigger" aria-label="Select a country code" aria-expanded="false"><span class="country-globe"><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M11.5,19 C11.331,19 11.166,18.985 11,18.975 L11,16.5 C11,16.224 10.776,16 10.5,16 L9.5,16 C9.224,16 9,15.775 9,15.5 L9,12.5 C9,12.366 8.947,12.238 8.852,12.145 L4.804,8.14 C6.04,5.688 8.573,4 11.5,4 C12.76,4 13.946,4.315 14.989,4.866 L15,6.497 C15.001,6.631 14.949,6.757 14.855,6.853 C14.76,6.947 14.634,7 14.5,7 L12.339,7 C12.207,7 12.08,7.053 11.986,7.146 L10.146,8.983 C10.053,9.077 10,9.204 10,9.337 L10,10.5 C10,11.325 10.672,11.999 11.499,12 L15.293,12 L17,13.707 L17,16.582 C15.629,18.064 13.674,19 11.5,19 M4,11.5 C4,10.673 4.14,9.879 4.388,9.135 L8,12.709 L8,15.5 C8,16.327 8.673,17 9.5,17 L10,17 L10,18.849 C6.581,18.152 4,15.122 4,11.5 M19,11.5 C19,12.856 18.632,14.127 18,15.226 L18,13.5 C18,13.367 17.947,13.24 17.854,13.146 L15.854,11.146 C15.76,11.053 15.633,11 15.5,11 L11.5,11 C11.224,11 11,10.775 11,10.5 L11,9.544 L12.546,8 L14.5,8 C14.902,8 15.281,7.843 15.564,7.557 C15.848,7.271 16.003,6.892 16,6.49 L15.993,5.51 C17.814,6.879 19,9.051 19,11.5 M11.5,3 C6.813,3 3,6.813 3,11.5 C3,16.187 6.813,20 11.5,20 C16.187,20 20,16.187 20,11.5 C20,6.813 16.187,3 11.5,3"/></svg></span><span class="country-caret" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="m4 7 6 6 6-6" stroke="currentColor" stroke-width="1.2"/></svg></span></button>';
    // A body-level popup avoids clipping and inherited form-field input styles.
    const panel = document.createElement('div');
    panel.className = 'country-picker';
    panel.id = 'contactCountryPicker';
    panel.hidden = true;
    panel.innerHTML = '<label class="country-search"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/><path d="m16 16 7 7" stroke="currentColor" stroke-width="1.2"/></svg><input type="search" placeholder="Search" aria-label="Search countries" autocomplete="off"></label><div class="country-options" role="listbox" aria-label="Countries"></div><p class="country-empty" hidden>No results found</p>';
    document.body.append(panel);
    const options = panel.querySelector('.country-options');
    const search = panel.querySelector('input');
    const trigger = current.querySelector('.country-trigger');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-haspopup', 'listbox');
    phoneSelect.replaceChildren();
    const position = () => {
      if (panel.hidden) return;
      const r = field.getBoundingClientRect();
      const width = Math.min(320, innerWidth - 24);
      const height = Math.min(290, innerHeight - 24);
      const below = innerHeight - r.bottom - 12;
      panel.style.width = width + 'px';
      panel.style.height = height + 'px';
      panel.style.left = Math.max(12, Math.min(r.left, innerWidth - width - 12)) + 'px';
      panel.style.top = Math.max(12, below >= height ? r.bottom : r.top >= height + 12 ? r.top - height : innerHeight - height - 12) + 'px';
    };
    const close = (focus = false) => {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (focus) trigger.focus({ preventScroll: true });
    };
    choices.forEach(([name, code, flag], index) => {
      const countryCode = [...flag].map(char => String.fromCharCode(char.codePointAt(0) - 0x1f1e6 + 97)).join('');
      const flagMarkup = '<img class="country-flag" src="assets/flags/' + countryCode + '.png" alt="" width="24" height="15">';
      const nativeOption = new Option(name + ' ' + code, code);
      phoneSelect.add(nativeOption);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'country-option';
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');
      button.dataset.country = name;
      button.innerHTML = '<span aria-hidden="true">' + flagMarkup + '</span><span>' + name + ' ' + code + '</span>';
      button.addEventListener('click', () => {
        phoneSelect.selectedIndex = index;
        options.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b === button)));
        current.querySelector('.country-globe').innerHTML = flagMarkup;
        trigger.setAttribute('aria-label', name + ' ' + code + ', change country code');
        phoneSelect.dispatchEvent(new Event('change', { bubbles: true }));
        close(true);
      });
      options.append(button);
    });
    phoneSelect.selectedIndex = -1;
    const filter = () => {
      const query = search.value.trim().toLowerCase();
      const buttons = [...options.children];
      buttons.forEach(button => {
        button.hidden = !button.textContent.toLowerCase().includes(query);
        button.classList.remove('is-active');
      });
      const first = buttons.find(button => !button.hidden);
      if (first) first.classList.add('is-active');
      panel.querySelector('.country-empty').hidden = !!first;
      options.scrollTop = 0;
    };
    trigger.addEventListener('click', () => {
      if (!panel.hidden) return close();
      search.value = '';
      filter();
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      position();
      search.focus({ preventScroll: true });
    });
    search.addEventListener('input', filter);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); close(true); }
      const buttons = [...options.children].filter(button => !button.hidden);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const index = buttons.indexOf(document.activeElement);
        const next = event.key === 'ArrowDown' ? Math.min(index + 1, buttons.length - 1) : Math.max(index - 1, 0);
        buttons[next]?.focus();
      }
      if (event.key === 'Enter' && event.target === search) {
        event.preventDefault(); buttons[0]?.click();
      }
    });
    document.addEventListener('pointerdown', event => {
      if (!field.contains(event.target) && !panel.contains(event.target)) close();
    });
    document.addEventListener('focusin', event => {
      if (!field.contains(event.target) && !panel.contains(event.target)) close();
    });
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
  }
  consultationForm?.querySelector('input[name="floorPlan"]')?.addEventListener('change', event => {
    document.getElementById('floorPlanName').textContent = event.target.files[0]?.name || '';
    clearFieldError(event.target);
  });
  const clearFieldError = field => {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    field.closest('.contact-field')?.querySelector('.contact-error')?.remove();
  };
  const showFieldError = (field, message) => {
    clearFieldError(field);
    field.setAttribute('aria-invalid', 'true');
    const error = document.createElement('span');
    error.id = `contact-${field.name}-error`;
    error.className = 'contact-error';
    error.setAttribute('role', 'alert');
    error.innerHTML = '<svg class="contact-error-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M9.5,3 C13.084,3 16,5.916 16,9.5 C16,13.084 13.084,16 9.5,16 C5.916,16 3,13.084 3,9.5 C3,5.916 5.916,3 9.5,3 Z M9.5,4 C6.467,4 4,6.467 4,9.5 C4,12.533 6.467,15 9.5,15 C12.533,15 15,12.533 15,9.5 C15,6.467 12.533,4 9.5,4 Z M10,11 L10,12 L9,12 L9,11 L10,11 Z M10,7 L10,10 L9,10 L9,7 L10,7 Z"/></svg>';
    const text = document.createElement('span');
    text.className = 'contact-error-text';
    text.textContent = message;
    error.append(text);
    field.setAttribute('aria-describedby', error.id);
    field.closest('.contact-field')?.append(error);
  };
  consultationForm?.querySelector('input[name="email"]')?.addEventListener('input', event => {
    if (event.target.validity.valid) clearFieldError(event.target);
    document.getElementById('consultationResponse').hidden = true;
  });
  consultationForm?.addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('consultationResponse').hidden = true;
    const email = consultationForm.querySelector('input[name="email"]');
    const floorInput = consultationForm.querySelector('input[name="floorPlan"]');
    let valid = true;
    if (!email.value.trim() || !email.validity.valid) {
      showFieldError(email, 'Enter an email address like example@mysite.com.');
      valid = false;
    } else clearFieldError(email);
    if (!floorInput.files.length) {
      showFieldError(floorInput, 'Enter an answer.');
      valid = false;
    } else clearFieldError(floorInput);
    if (!valid) return;
    const data = new FormData(consultationForm);
    const floorPlan = data.get('floorPlan');
    const body = [
      `Name: ${data.get('firstName')} ${data.get('lastName')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone') ? [data.get('phoneCountry'), data.get('phone')].filter(Boolean).join(' ') : ''}`,
      `Company: ${data.get('company')}`,
      `Design requirement / project type: ${data.get('requirement')}`,
      `Floor plan: ${floorPlan?.name || ''} (please attach this file)`
    ].join('\n');
    document.getElementById('consultationEmail').href = `mailto:info@once-hk.com?subject=${encodeURIComponent('Design consultation inquiry')}&body=${encodeURIComponent(body)}`;
    document.getElementById('consultationResponse').hidden = false;
  });

  // Background media starts only while visible and respects reduced motion.
  document.querySelectorAll('[data-background-video]').forEach(video => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (motion.matches || document.hidden || !visible) { video.pause(); return; }
      video.play().catch(() => {});
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }).observe(video);
    } else { visible = true; update(); }
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
  });
  // Opt-in entrance effect; content remains visible without JavaScript or motion.
  const reveal = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending'); observer.unobserve(entry.target);
    }), { threshold: 0.12 });
    reveal.forEach(element => { element.classList.add('reveal-pending'); observer.observe(element); });
  }
})();
