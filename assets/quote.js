/* Quote inquiry: prepare a complete email draft using the site's existing flow. */
(() => {
  const animated = document.querySelectorAll('.quote-services .quote-enter, .quote-benefits .quote-enter, .quote-vision .quote-enter, .quote-request .quote-enter');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('quote-enter-done');
      observer.unobserve(entry.target);
    }), { threshold: .12 });
    animated.forEach(element => observer.observe(element));
  } else {
    animated.forEach(element => element.classList.add('quote-enter-done'));
  }
  const quoteSection = document.getElementById('quote-services');
  const quoteTag = quoteSection?.querySelector('.quote-tag');
  if (quoteSection && quoteTag) {
    const updateQuoteTag = () => {
      const top = quoteSection.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * .25)));
      quoteTag.style.setProperty('--tag-grow', `${(progress * 100).toFixed(2)}%`);
    };
    updateQuoteTag();
    addEventListener('scroll', updateQuoteTag, { passive: true });
    addEventListener('resize', updateQuoteTag);
  }
  const form = document.getElementById('quoteForm');
  if (!form) return;
  const fileInput = form.elements.floorPlan;
  fileInput.addEventListener('change', () => {
    document.getElementById('quoteFloorPlanName').textContent = fileInput.files[0]?.name || '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      `Project type: ${data.get('projectType')}`,
      `Company / shopping mall / building: ${data.get('company')}`,
      `Area (sqft): ${data.get('area')}`,
      `Other requirement: ${data.get('requirement')}`,
      `Name: ${data.get('name')}`,
      `Contact number: ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `How did you hear about Once Design? ${data.getAll('source').join(', ')}`,
      `Floor plan: ${fileInput.files[0]?.name || 'None'}${fileInput.files.length ? ' (please attach this file)' : ''}`
    ];
    document.getElementById('quoteEmail').href = `mailto:info@once-hk.com?subject=${encodeURIComponent('Project quote inquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
    document.getElementById('quoteResponse').hidden = false;
  });
})();
