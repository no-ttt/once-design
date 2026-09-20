/* Quote inquiry: prepare a complete email draft using the site's existing flow. */
(() => {
  // Keep Quote entrances identical to Homepage: an 80-degree arc around the
  // element's midpoint, linear 1.2s rotation plus the shared 840ms fade.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const animated = [...document.querySelectorAll('.quote-services .quote-enter, .quote-icon-enter, .quote-benefit-copy, .quote-vision .quote-enter, .quote-request .quote-enter, .quote-hero-title')];
  const reveal = element => {
    if (motion.matches || !Element.prototype.animate) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }
    const depth = element.offsetHeight / 2;
    const arc = angle => `perspective(800px) translateZ(-${depth}px) rotateX(${angle}deg) translateZ(${depth}px)`;
    element.style.opacity = '0';
    const delay = Number(element.dataset.quoteDelay || 0) + 1;
    element.animate([{ transform: arc(80) }, { transform: arc(0) }], {
      duration: 1200, delay, easing: 'linear', fill: 'forwards'
    });
    element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 840, delay, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'forwards'
    });
  };
  const observer = 'IntersectionObserver' in window && !motion.matches
    ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target);
    })) : null;
  animated.forEach(element => observer ? observer.observe(element) : reveal(element));
  motion.addEventListener('change', () => { if (motion.matches) animated.forEach(element => reveal(element)); });
  const quoteSection = document.getElementById('quote-services');
  const quoteTag = quoteSection?.querySelector('.quote-tag');
  if (quoteSection && quoteTag) {
    const updateQuoteTag = () => {
      const top = quoteSection.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * .25)));
      quoteTag.style.setProperty('--tag-grow', `${(progress * 100).toFixed(2)}%`);
    };
    addEventListener('scroll', updateQuoteTag, { passive: true });
    addEventListener('resize', updateQuoteTag);
  }
  const form = document.getElementById('quoteForm');
  if (!form) return;
  const validationContainer = control => control.closest('fieldset, .quote-field');
  const validationMessage = control => {
    if (control.type === 'radio') return 'Choose an option.';
    if (control.name === 'company') return 'Enter a company name.';
    if (control.name === 'name') return 'Enter a first name.';
    if (control.name === 'area') return 'Enter an answer.';
    if (control.type === 'tel') return 'Enter a phone number.';
    if (control.type === 'email') return 'Enter an email address like example@mysite.com.';
    return 'Enter an answer.';
  };
  const showValidation = control => {
    const container = validationContainer(control);
    if (!container) return;
    container.classList.add('is-invalid');
    control.setAttribute('aria-invalid', 'true');
    let error = container.querySelector('.quote-field-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'quote-field-error';
      error.setAttribute('role', 'alert');
      container.append(error);
    }
    error.textContent = validationMessage(control);
  };
  const clearValidation = control => {
    const container = validationContainer(control);
    if (!container) return;
    if (control.type === 'radio' && !form.querySelector(`input[name="${control.name}"]:checked`)) return;
    container.classList.remove('is-invalid');
    container.querySelector('.quote-field-error')?.remove();
    container.querySelectorAll('[aria-invalid="true"]').forEach(item => item.removeAttribute('aria-invalid'));
  };
  form.addEventListener('input', event => { if (event.target.validity?.valid) clearValidation(event.target); });
  form.addEventListener('change', event => { if (event.target.validity?.valid) clearValidation(event.target); });
  const phoneSelect = form.elements.countryCode;
  if (phoneSelect) {
    const field = phoneSelect.closest('.quote-phone-control');
    const current = field.querySelector('.contact-country-icon');
    const choices = [
      ['Afghanistan', '+93', '🇦🇫'], ['Aland Islands', '+358', '🇦🇽'], ['Albania', '+355', '🇦🇱'], ['Algeria', '+213', '🇩🇿'], ['American Samoa', '+1684', '🇦🇸'],
      ['Australia', '+61', '🇦🇺'], ['Canada', '+1', '🇨🇦'], ['China', '+86', '🇨🇳'], ['Hong Kong', '+852', '🇭🇰'], ['Japan', '+81', '🇯🇵'], ['Singapore', '+65', '🇸🇬'], ['Taiwan', '+886', '🇹🇼'], ['United Kingdom', '+44', '🇬🇧'], ['United States', '+1', '🇺🇸']
    ];
    current.innerHTML = '<button type="button" class="country-trigger" aria-label="Select a country code" aria-expanded="false"><span class="country-globe"><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M11.5,19 C11.331,19 11.166,18.985 11,18.975 L11,16.5 C11,16.224 10.776,16 10.5,16 L9.5,16 C9.224,16 9,15.775 9,15.5 L9,12.5 C9,12.366 8.947,12.238 8.852,12.145 L4.804,8.14 C6.04,5.688 8.573,4 11.5,4 C12.76,4 13.946,4.315 14.989,4.866 L15,6.497 C15.001,6.631 14.949,6.757 14.855,6.853 C14.76,6.947 14.634,7 14.5,7 L12.339,7 C12.207,7 12.08,7.053 11.986,7.146 L10.146,8.983 C10.053,9.077 10,9.204 10,9.337 L10,10.5 C10,11.325 10.672,11.999 11.499,12 L15.293,12 L17,13.707 L17,16.582 C15.629,18.064 13.674,19 11.5,19 M4,11.5 C4,10.673 4.14,9.879 4.388,9.135 L8,12.709 L8,15.5 C8,16.327 8.673,17 9.5,17 L10,17 L10,18.849 C6.581,18.152 4,15.122 4,11.5 M19,11.5 C19,12.856 18.632,14.127 18,15.226 L18,13.5 C18,13.367 17.947,13.24 17.854,13.146 L15.854,11.146 C15.76,11.053 15.633,11 15.5,11 L11.5,11 C11.224,11 11,10.775 11,10.5 L11,9.544 L12.546,8 L14.5,8 C14.902,8 15.281,7.843 15.564,7.557 C15.848,7.271 16.003,6.892 16,6.49 L15.993,5.51 C17.814,6.879 19,9.051 19,11.5 M11.5,3 C6.813,3 3,6.813 3,11.5 C3,16.187 6.813,20 11.5,20 C16.187,20 20,16.187 20,11.5 C20,6.813 16.187,3 11.5,3"/></svg></span><span class="country-caret" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="m4 7 6 6 6-6" stroke="currentColor" stroke-width="1.2"/></svg></span></button>';
    const panel = document.createElement('div');
    panel.className = 'country-picker';
    panel.id = 'quoteCountryPicker';
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
      const rect = field.getBoundingClientRect();
      const width = Math.min(320, innerWidth - 24);
      const height = Math.min(290, innerHeight - 24);
      const below = innerHeight - rect.bottom - 12;
      panel.style.width = `${width}px`;
      panel.style.height = `${height}px`;
      panel.style.left = `${Math.max(12, Math.min(rect.left, innerWidth - width - 12))}px`;
      panel.style.top = `${Math.max(12, below >= height ? rect.bottom : rect.top >= height + 12 ? rect.top - height : innerHeight - height - 12)}px`;
    };
    const close = focus => { panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); if (focus) trigger.focus({ preventScroll: true }); };
    choices.forEach(([name, code, flag], index) => {
      const countryCode = [...flag].map(char => String.fromCharCode(char.codePointAt(0) - 0x1f1e6 + 97)).join('');
      const flagMarkup = `<img class="country-flag" src="assets/flags/${countryCode}.png" alt="" width="24" height="15">`;
      phoneSelect.add(new Option(`${name} ${code}`, code));
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'country-option'; button.setAttribute('role', 'option'); button.setAttribute('aria-selected', 'false');
      button.innerHTML = `<span aria-hidden="true">${flagMarkup}</span><span>${name} ${code}</span>`;
      button.addEventListener('click', () => {
        phoneSelect.selectedIndex = index;
        options.querySelectorAll('button').forEach(item => item.setAttribute('aria-selected', String(item === button)));
        current.querySelector('.country-globe').innerHTML = flagMarkup;
        trigger.setAttribute('aria-label', `${name} ${code}, change country code`);
        phoneSelect.dispatchEvent(new Event('change', { bubbles: true }));
        close(true);
      });
      options.append(button);
    });
    phoneSelect.selectedIndex = -1;
    const filter = () => {
      const query = search.value.trim().toLowerCase();
      const buttons = [...options.children];
      buttons.forEach(button => { button.hidden = !button.textContent.toLowerCase().includes(query); button.classList.remove('is-active'); });
      const first = buttons.find(button => !button.hidden);
      if (first) first.classList.add('is-active');
      panel.querySelector('.country-empty').hidden = !!first;
      options.scrollTop = 0;
    };
    trigger.addEventListener('click', () => {
      if (!panel.hidden) return close();
      search.value = ''; filter(); panel.hidden = false; trigger.setAttribute('aria-expanded', 'true'); position(); search.focus({ preventScroll: true });
    });
    search.addEventListener('input', filter);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); close(true); }
      const buttons = [...options.children].filter(button => !button.hidden);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const index = buttons.indexOf(document.activeElement);
        buttons[event.key === 'ArrowDown' ? Math.min(index + 1, buttons.length - 1) : Math.max(index - 1, 0)]?.focus();
      }
      if (event.key === 'Enter' && event.target === search) { event.preventDefault(); buttons[0]?.click(); }
    });
    document.addEventListener('pointerdown', event => { if (!field.contains(event.target) && !panel.contains(event.target)) close(); });
    document.addEventListener('focusin', event => { if (!field.contains(event.target) && !panel.contains(event.target)) close(); });
    addEventListener('resize', position);
    addEventListener('scroll', position, true);
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = [...form.elements].filter(control => control.willValidate && !control.checkValidity());
    if (invalid.length) {
      invalid.forEach(showValidation);
      invalid[0].focus({ preventScroll: true });
      validationContainer(invalid[0])?.scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    const data = new FormData(form);
    const lines = [
      `Project type: ${data.get('projectType')}`,
      `Company / shopping mall / building: ${data.get('company')}`,
      `Area (sqft): ${data.get('area')}`,
      `Other requirement: ${data.get('requirement')}`,
      `Name: ${data.get('name')}`,
      `Contact number: ${data.get('countryCode')} ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `How did you hear about Once Design? ${data.getAll('source').join(', ')}`,
      `Floor plan: ${data.get('floorPlan') || 'None'}`
    ];
    document.getElementById('quoteEmail').href = `mailto:info@once-hk.com?subject=${encodeURIComponent('Project quote inquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
    document.getElementById('quoteResponse').hidden = false;
  });
})();
