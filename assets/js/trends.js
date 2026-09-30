/* Enhance the readable article sections into accessible category tabs. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const entrances = [
    [document.querySelector('.trends-hero-copy > div'), 'arc'],
    [document.querySelector('.trends-hero h1'), 'arc'],
    [document.querySelector('.trends-scroll'), 'reveal'],
    [document.querySelector('.trends-contact .contact-logo'), 'arc'],
  ].filter(([element]) => element);
  if (!motion.matches && 'IntersectionObserver' in window) {
    const effects = new Map(entrances);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        const height = target.offsetHeight;
        target.classList.remove('trends-motion-pending');
        if (motion.matches) return;
        if (effects.get(target) === 'reveal') {
          target.animate([
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
          ], { duration: 1200, delay: 1, fill: 'backwards', easing: 'linear' });
        } else {
          target.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 840, delay: 1, fill: 'backwards', easing: 'cubic-bezier(.47, 0, .745, .715)',
          });
          target.animate([
            { transform: `perspective(800px) translateZ(${-height / 2}px) rotateX(80deg) translateZ(${height / 2}px)` },
            { transform: `perspective(800px) translateZ(${-height / 2}px) rotateX(0deg) translateZ(${height / 2}px)` },
          ], { duration: 1200, delay: 1, fill: 'backwards', easing: 'linear' });
        }
      });
    });
    entrances.forEach(([element]) => {
      element.classList.add('trends-motion-pending');
      observer.observe(element);
    });
    motion.addEventListener('change', () => {
      if (!motion.matches) return;
      observer.disconnect();
      entrances.forEach(([element]) => {
        element.classList.remove('trends-motion-pending');
        element.getAnimations().forEach(animation => animation.finish());
      });
    });
  }
  const projects = document.querySelector('.trends-articles');
  if (!projects) return;
  const list = projects.querySelector('.trends-tabs');
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
  projects.classList.add('trends-tabs-ready');
})();
