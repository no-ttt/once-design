/* Match the Work banner's Wix entrance effects, once per visible element. */
(() => {
  const hero = document.querySelector('.work-hero');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero || motion.matches) return;

  const logo = document.querySelector('.work-page .brand-logo img');
  if (logo) logo.dataset.workMotion = 'arc';
  const elements = [...document.querySelectorAll('[data-work-motion]')];
  elements.forEach(element => { element.dataset.workEnter = 'pending'; });

  let observer;
  const finish = element => { element.dataset.workEnter = 'done'; };
  const start = element => {
    if (element.dataset.workEnter !== 'pending') return;
    // Use each untransformed element's height, as Wix does for the arc radius.
    element.style.setProperty('--work-motion-height', `${element.getBoundingClientRect().height}px`);
    element.addEventListener('animationend', event => {
      if (event.target === element && event.animationName !== 'work-fade-in') finish(element);
    });
    element.dataset.workEnter = 'running';
  };
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    observer?.disconnect();
    elements.forEach(finish);
  });

  document.fonts.ready.then(() => {
    if (motion.matches) return;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          start(entry.target);
          observer.unobserve(entry.target);
        });
      });
      elements.forEach(element => observer.observe(element));
    } else {
      elements.forEach(start);
    }
  });
})();

/* Homepage contact entrance: logo and contact links arc in as they enter view. */
(() => {
  const section = document.getElementById('contact');
  if (!section) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...section.querySelectorAll('.contact-logo, .contact-links')];
  const arc = (element, degrees) => {
    const half = element.getBoundingClientRect().height / 2;
    return `perspective(800px) translateZ(-${half}px) rotateX(${degrees}deg) translateZ(${half}px)`;
  };
  const reveal = element => {
    if (reduce.matches || element.dataset.contactMotion === 'done') return;
    element.dataset.contactMotion = 'done';
    element.animate([{transform: arc(element, 80)}, {transform: arc(element, 0)}], {
      duration: 1200, delay: 1, easing: 'linear', fill: 'backwards'
    });
    const fade = element.animate([{opacity: 0}, {opacity: 1}], {
      duration: 840, delay: 1, easing: 'cubic-bezier(.47, 0, .745, .715)', fill: 'backwards'
    });
    fade.onfinish = () => { element.style.opacity = ''; };
  };
  if (reduce.matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    reveal(entry.target);
  }), {threshold: .12});
  elements.forEach(element => { element.style.opacity = '0'; observer.observe(element); });
  reduce.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    elements.forEach(element => { element.style.opacity = ''; });
  });
})();

(() => {
  const section = document.getElementById('contact');
  if (!section) return;
  const update = () => section.style.setProperty('--contact-sticky-top', `${Math.min(0, innerHeight - section.offsetHeight)}px`);
  update();
  addEventListener('resize', update);
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(section);
})();

/* Enhance the readable project sections into accessible category tabs. */
(() => {
  const projects = document.querySelector('.work-projects');
  if (!projects) return;
  const list = projects.querySelector('.work-tabs');
  const tabs = [...list.querySelectorAll('button')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  list.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  const select = index => {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
  select(0);
  projects.classList.add('work-tabs-ready');
})();
