(() => {
  const logo = document.querySelector('.brand-logo img');
  if (logo) logo.src = '../assets/images/shared/quote-logo.png';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Wix applies Arc to the text group, not the heading alone.
  const groups = [...document.querySelectorAll('.moorgen-copy')].filter(section => section.querySelector('h2')).map(section => {
    const group = document.createElement('div');
    group.className = 'moorgen-copy-group';
    group.append(...section.children);
    section.append(group);
    return group;
  });
  const entrances = [...groups, document.querySelector('.brand-logo'), document.querySelector('.contact-logo')].filter(Boolean);
  const wipes = [...document.querySelectorAll('.moorgen-prose, .moorgen-back a, .moorgen-navigation span')];
  const active = new Set();
  const revealed = new WeakSet();
  let observer;
  let frame;
  let fallback = false;
  const play = (element, frames, options) => {
    const animation = element.animate(frames, options);
    active.add(animation);
    animation.oncancel = () => active.delete(animation);
    if (!options.timeline) animation.onfinish = () => active.delete(animation);
    return animation;
  };
  // Measure layout coordinates, unaffected by the parent group's Arc transform.
  const top = element => {
    let y = 0;
    for (let node = element; node; node = node.offsetParent) y += node.offsetTop;
    return y;
  };
  function update() {
    frame = 0;
    if (!fallback || reduced.matches) return;
    wipes.forEach(element => {
      const progress = Math.min(1, Math.max(0, (scrollY + innerHeight - top(element)) / ((innerHeight + element.offsetHeight) * .15)));
      element.style.setProperty('--reveal-clip', `${(1 - progress) * 100}%`);
    });
  }
  function schedule() { if (!frame && fallback) frame = requestAnimationFrame(update); }
  function start() {
    observer?.disconnect();
    [...active].forEach(animation => animation.cancel());
    cancelAnimationFrame(frame);
    frame = 0;
    fallback = false;
    entrances.forEach(element => element.classList.remove('moorgen-motion-pending'));
    wipes.forEach(element => { element.classList.remove('moorgen-scroll-reveal'); element.style.removeProperty('--reveal-clip'); });
    if (reduced.matches || !Element.prototype.animate || !('IntersectionObserver' in window)) return;
    wipes.forEach(element => {
      element.classList.add('moorgen-scroll-reveal');
      if ('ViewTimeline' in window) {
        play(element, [
          { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }
        ], { timeline: new ViewTimeline({ subject: element, axis: 'block' }), rangeStart: 'cover 0%', rangeEnd: 'cover 15%', fill: 'both', easing: 'linear' });
      } else {
        fallback = true;
      }
    });
    update();
    observer = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      revealed.add(target);
      target.classList.remove('moorgen-motion-pending');
      const depth = target.getBoundingClientRect().height / 2;
      play(target, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 840, delay: 1, fill: 'backwards', easing: 'cubic-bezier(.47, 0, .745, .715)'
      });
      play(target, [
        { transform: 'none', offset: 0 },
        { transform: `perspective(800px) translateZ(-${depth}px) rotateX(80deg) translateZ(${depth}px)`, offset: .000001 },
        { transform: `perspective(800px) translateZ(-${depth}px) rotateX(0deg) translateZ(${depth}px)`, offset: 1 }
      ], { duration: 1200, delay: 1, fill: 'backwards', easing: 'linear' });
    }));
    entrances.forEach(element => {
      if (revealed.has(element) || element.getBoundingClientRect().bottom <= 0) return;
      element.classList.add('moorgen-motion-pending');
      observer.observe(element);
    });
  }
  document.addEventListener('focusin', event => {
    entrances.forEach(element => {
      if (!element.contains(event.target)) return;
      observer?.unobserve(element);
      revealed.add(element);
      element.classList.remove('moorgen-motion-pending');
      [...active].filter(animation => animation.effect.target === element).forEach(animation => animation.cancel());
    });
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  document.fonts?.ready.then(schedule);
  reduced.addEventListener('change', start);
  start();
})();
