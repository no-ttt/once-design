(() => {
  // The shared shell uses the light logo; this article uses its existing dark asset.
  document.querySelector('.brand-logo img').src = 'assets/quote-logo.png';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const prose = [...document.querySelectorAll('.moorgen-prose')];
  let scheduled = false;
  function reveal() {
    scheduled = false;
    prose.forEach(element => {
      const rect = element.getBoundingClientRect();
      const progress = reduced.matches ? 1 : Math.min(1, Math.max(0, (innerHeight - rect.top) / ((innerHeight + rect.height) * .15)));
      element.style.setProperty('--reveal-clip', `${(1 - progress) * 100}%`);
    });
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(reveal); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  reveal();
  if (!reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{ opacity: 0, transform: 'perspective(1100px) rotateX(-65deg)' }, { opacity: 1, transform: 'perspective(1100px) rotateX(0)' }], { duration: 1200, easing: 'cubic-bezier(.2,.65,.3,1)' });
      observer.unobserve(entry.target);
    }));
    document.querySelectorAll('.moorgen-copy h2, .brand-logo, .contact-logo').forEach(element => observer.observe(element));
  }
})();
