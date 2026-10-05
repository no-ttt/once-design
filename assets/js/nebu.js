(() => {
  const projects = window.nebuProjects;
  if (!projects?.length) return;
  const main = document.querySelector('main');
  const contact = main.querySelector('.nebu-contact');
  const container = document.createElement('div');
  container.id = 'nebuProjectContent';
  main.insertBefore(container, main.firstChild);
  [...main.children].filter(node => node !== container && node !== contact).forEach(node => container.append(node));
  const template = container.innerHTML;
  const logo = document.querySelector('.brand-logo img');
  if (logo) { logo.src = 'assets/images/shared/logo.png'; logo.width = 181; logo.height = 83; }
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const lines = text => escape(text).replace(/\n+/g, '<br>');
  // Keep a separator with its preceding word without changing desktop wrapping.
  const titleMarkup = text => escape(text).replace(/(\S+[^\S\n]+\|)/g, '<span class="nebu-title-separator">$1</span>');
  let dispose;
  let current;
  function render(id, focus = false) {
    const project = projects.find(item => item.id === id) || projects[0];
    if (current === project.id) return;
    dispose?.();
    document.querySelector('.nebu-lightbox')?.close();
    container.innerHTML = template;
    current = project.id;
    document.body.classList.remove('klasse14-page', 'tatcha-page');
    document.body.classList.toggle('project-gallery-only', !project.articles.length);
    document.body.classList.toggle('project-mobile-standard', projects.indexOf(project) >= projects.findIndex(item => item.id === 'murad-counter'));
    document.body.dataset.project = current;
    document.title = project.title + ' | ONCE DESIGN';
    document.querySelector('meta[name="description"]').content = project.intro || project.title + ' — Once Design Studio project.';
    for (const [key,value] of Object.entries(project.layout)) container.style.setProperty('--project-' + key, value + 'vw');
    for (const [key,value] of Object.entries(project.mobile)) container.style.setProperty('--project-mobile-' + key, value + 'vw');
    const hero = container.querySelector('.nebu-hero img');
    hero.src = project.hero; hero.alt = project.title;
    const title = container.querySelector('h1');
    title.innerHTML = titleMarkup(project.heroTitle || project.title);
    const heading = container.querySelector('.nebu-heading h2');
    const inquiry = heading.querySelector('a');
    heading.innerHTML = titleMarkup(project.heading).replace(/\n+/g, '<br>') + ' ';
    if (project.id === 'sheng-chim') {
      heading.innerHTML = heading.innerHTML.replace('HONG KONG', '<span class="nebu-title-separator">HONG KONG</span>');
      title.innerHTML = title.innerHTML.replace('HONG KONG', '<span class="nebu-title-separator">HONG KONG</span>');
    }
    heading.append(inquiry);
    const crumbs = project.breadcrumb.split('>').map(text => text.trim());
    container.querySelector('.nebu-breadcrumb p').innerHTML = crumbs.map((text,index) => index === crumbs.length-1 ? '<strong>' + escape(text) + '</strong>' : '<a href="' + (index === 0 ? 'index.html' : 'work.html') + '">' + escape(text) + '</a>').join(' &gt; ');
    const intro = container.querySelector('.nebu-intro');
    intro.textContent = project.intro; intro.hidden = !project.intro;
    const facts = project.facts.map(([label,value]) => '<div><dt>' + escape(label) + '</dt><dd>' + escape(value) + '</dd></div>').join('');
    const awards = project.awards.length ? '<div class="nebu-awards"><dt>AWARDS</dt><dd>' + project.awards.map(text => '<p>' + escape(text) + '</p>').join('') + '</dd></div>' : '';
    container.querySelector('.nebu-facts').innerHTML = facts + awards;
    container.querySelector('blockquote').innerHTML = lines(project.quote);
    container.querySelector('.nebu-design-copy').innerHTML = project.articles.map(article => '<article><h2>' + lines(article.title) + '</h2>' + article.paragraphs.map((text, index) => {
      const listStart = article.listStart || 0;
      const isListItem = article.list && index >= listStart;
      let html = escape(text);
      for (const phrase of article.emphasis || []) {
        const escapedPhrase = escape(phrase);
        html = html.split(escapedPhrase).join('<strong>' + escapedPhrase + '</strong>');
      }
      for (const phrase of article.mediumEmphasis || []) {
        const escapedPhrase = escape(phrase);
        html = html.split(escapedPhrase).join('<span class="nebu-text-medium">' + escapedPhrase + '</span>');
      }
      const paragraphClass = /^\d+\.\s+/.test(text.trim()) ? ' class="nebu-text-medium"' : '';
      return (isListItem && index === listStart ? '<ul>' : '') + (isListItem ? '<li>' : '') + '<p' + paragraphClass + '>' + html + '</p>' + (isListItem ? '</li>' : '');
    }).join('') + (article.list ? '</ul>' : '') + '</article>').join('');
    if (project.id === 'nebu') {
      const studioTitle = container.querySelector('.nebu-design-copy article:last-child h2');
      const titleLines = ['Once Design Studio | Commercial Interior Design', 'and Store Construction'];
      if (studioTitle && studioTitle.textContent === titleLines.join(' ')) {
        studioTitle.innerHTML = titleLines.map(text => '<span class="nebu-mobile-title-line">' + escape(text) + '</span>').join(' ');
      }
    }
    // Preserve desktop markup; these neutral spans gain font variants only on mobile.
    for (const [phrase, variant] of window.projectMobileEmphasis?.[project.id] || []) {
      container.querySelectorAll('.nebu-intro, .nebu-design-copy p').forEach(paragraph => {
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
          if (node.parentElement.closest('[data-mobile-font]')) return;
          const index = project.id === 'murad-counter'
            ? node.textContent.lastIndexOf(phrase) : node.textContent.indexOf(phrase);
          if (index < 0) return;
          const match = node.splitText(index);
          match.splitText(phrase.length);
          const span = document.createElement('span');
          span.dataset.mobileFont = variant;
          match.replaceWith(span);
          span.append(match);
        });
      });
    }
    if (project.id === 'sheng-chim') {
      const paragraph = container.querySelector('.nebu-design-copy article:first-child p:nth-of-type(2)');
      if (paragraph?.firstChild?.nodeType === Node.TEXT_NODE && paragraph.textContent.startsWith('Just like')) {
        const initial = paragraph.firstChild;
        initial.splitText(1);
        const span = document.createElement('span');
        span.className = 'project-mobile-initial';
        initial.replaceWith(span);
        span.append(initial);
      }
    }
    const gallery = container.querySelector('.nebu-gallery');
    gallery.setAttribute('aria-label', project.title + ' photographs');
    gallery.innerHTML = '<div class="nebu-gallery-column"></div><div class="nebu-gallery-column"></div>';
    project.photos.forEach((photo,index) => {
      const link = document.createElement('a');
      link.href = photo.src; link.dataset.index = index;
      link.innerHTML = '<img src="' + photo.src + '" width="' + photo.width + '" height="' + photo.height + '" alt="' + escape(project.title + ', photograph ' + (index+1)) + '" loading="lazy">';
      if (project.id === 'nebu') {
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.media = '(max-width: 750px)';
        source.srcset = 'assets/images/projects/nebu/mobile-gallery-' + (index + 1) + '.jpg';
        picture.append(source, link.querySelector('img'));
        link.append(picture);
      }
      gallery.children[index % 2].append(link);
    });
    for (const [position,target] of [['first',project.previous],['last',project.next]]) {
      container.querySelectorAll('.nebu-arrows a:' + position + '-child, .nebu-project-nav a:' + position + '-child').forEach(link => {
        const label = target ? projects.find(p => p.id === target).title : '';
        link.hidden = position === 'last' && !target;
        link.href = target ? 'nebu.html?project=' + encodeURIComponent(target) : 'work.html#panel-retail';
        if (target) link.dataset.project = target;
        else delete link.dataset.project;
        link.setAttribute('aria-label', target ? (position === 'first' ? 'Previous project: ' : 'Next project: ') + label : 'Back to commercial projects');
        const span = link.querySelector('span');
        if (span) span.innerHTML = position === 'first' ? (target ? 'PREVIOUS<br>PROJECT' : 'BACK TO<br>COMMERCIAL') : 'NEXT<br>PROJECT';
      });
    }
    if (project.id === 'nebu') {
      container.querySelectorAll('.nebu-project-nav svg').forEach(svg => {
        svg.setAttribute('viewBox', '19.962 87.5 160.038 25');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('stroke', 'none');
        svg.querySelector('path').setAttribute('d', 'M21.612 101.609h153.045l-7.656 8.117c-.55.583-.661 1.499-.172 2.135.623.81 1.789.845 2.46.133l10.272-10.891a1.606 1.606 0 0 0 0-2.206l-10.272-10.891a1.613 1.613 0 0 0-2.393.051c-.556.637-.458 1.619.122 2.234l7.639 8.099H21.612a1.61 1.61 0 1 0 0 3.219z');
      });
      container.querySelector('.nebu-project-nav a:first-child svg').style.rotate = '180deg';
    }
    scrollTo({top:0, behavior:'instant'});
    if (focus) { title.tabIndex = -1; title.focus({preventScroll:true}); }
    dispose = initialize();
    history.replaceState({...history.state, nebuProject: current}, '', location.pathname);
  }
  container.addEventListener('click', event => {
    const link = event.target.closest('a[data-project]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState({nebuProject:link.dataset.project}, '', location.pathname);
    render(link.dataset.project, true);
  });
  addEventListener('popstate', event => render(event.state?.nebuProject || 'nebu', true));
  function initialize() {
    const listeners = new AbortController();
    const listen = (target, type, handler, options = {}) => target.addEventListener(type, handler, {...options, signal:listeners.signal});
  const consultationTitle = document.querySelector('.nebu-contact h3');
  const consultation = document.querySelector('.nebu-contact .contact-consultation');
  const contactLinks = document.querySelector('.nebu-contact .contact-links');
  const mobile = matchMedia('(max-width: 750px)');
  const arrangeContact = () => {
    if (mobile.matches) contactLinks.before(consultationTitle);
    else consultation.prepend(consultationTitle);
  };
  arrangeContact();
  listen(mobile, 'change', arrangeContact);
  consultationTitle.id = 'nebuConsultationTitle';
  document.querySelector('.nebu-contact .contact-section').setAttribute('aria-labelledby', consultationTitle.id);
  const dialog = document.querySelector('.nebu-lightbox');
  let fullscreenViewer = dialog.querySelector('.nebu-lightbox-viewer');
  if (!fullscreenViewer) {
    fullscreenViewer = document.createElement('div');
    fullscreenViewer.className = 'nebu-lightbox-viewer';
    fullscreenViewer.append(...dialog.childNodes);
    dialog.append(fullscreenViewer);
  }
  const preview = dialog.querySelector('img');
  const gallery = document.querySelector('.nebu-gallery');
  const galleryLinks = [...gallery.querySelectorAll('a')].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
  let selectedPhoto = 0;
  let photoRequest = 0;
  let photoAnimation;
  const showPhoto = async index => {
    const request = ++photoRequest;
    const previousPhoto = selectedPhoto;
    selectedPhoto = Math.max(0, Math.min(galleryLinks.length - 1, index));
    const link = galleryLinks[selectedPhoto];
    dialog.querySelector('.nebu-lightbox-prev').hidden = selectedPhoto === 0;
    dialog.querySelector('.nebu-lightbox-next').hidden = selectedPhoto === galleryLinks.length - 1;
    dialog.querySelector('.nebu-lightbox-counter').textContent = `${selectedPhoto + 1} / ${galleryLinks.length}`;
    const loaded = new Image();
    loaded.src = link.href;
    try { await loaded.decode(); } catch {}
    if (request !== photoRequest || listeners.signal.aborted || !dialog.open) return;
    const animate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    photoAnimation?.cancel();
    if (animate && preview.getAttribute('src') && previousPhoto !== selectedPhoto) {
      photoAnimation = preview.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards', easing: 'ease-out' });
      try { await photoAnimation.finished; } catch { return; }
      if (request !== photoRequest || !dialog.open) return;
    }
    preview.src = link.href;
    preview.alt = link.querySelector('img').alt;
    photoAnimation?.cancel();
    if (animate) photoAnimation = preview.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-in-out' });
  };
  galleryLinks.forEach((link, index) => {
    listen(link, 'click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      dialog.showModal();
      showPhoto(index);
    });
  });
  listen(dialog.querySelector('.nebu-lightbox-close'), 'click', () => dialog.close());
  listen(dialog.querySelector('.nebu-lightbox-prev'), 'click', () => showPhoto(selectedPhoto - 1));
  listen(dialog.querySelector('.nebu-lightbox-next'), 'click', () => showPhoto(selectedPhoto + 1));
  listen(dialog, 'keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showPhoto(selectedPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  const expand = dialog.querySelector('.nebu-lightbox-expand');
  const syncExpanded = () => {
    const expanded = document.fullscreenElement === fullscreenViewer || dialog.classList.contains('is-expanded');
    expand.setAttribute('aria-pressed', String(expanded));
    expand.setAttribute('aria-label', expanded ? 'Exit fullscreen photograph' : 'Expand photograph to fullscreen');
    expand.title = expanded ? 'Exit fullscreen' : 'Open in fullscreen';
    expand.querySelector('path').setAttribute('d', expanded
      ? 'M19 2v9h9m-9 0 9-9M11 28v-9H2m9 0-9 9'
      : 'M20 2h8v8m0-8-9 9M10 28H2v-8m0 8 9-9');
  };
  expand.hidden = false;
  syncExpanded();
  listen(document, 'fullscreenchange', syncExpanded);
  listen(expand, 'click', async () => {
    if (document.fullscreenElement === fullscreenViewer) {
      await document.exitFullscreen().catch(() => {});
    } else if (dialog.classList.contains('is-expanded')) {
      dialog.classList.remove('is-expanded');
    } else {
      try {
        if (!document.fullscreenEnabled || !fullscreenViewer.requestFullscreen) throw new Error('Fullscreen unavailable');
        await fullscreenViewer.requestFullscreen();
      } catch { dialog.classList.add('is-expanded'); }
    }
    syncExpanded();
  });
  listen(dialog, 'close', () => {
    ++photoRequest;
    photoAnimation?.cancel();
    preview.removeAttribute('src');
    dialog.classList.remove('is-expanded');
    syncExpanded();
    if (document.fullscreenElement === fullscreenViewer) document.exitFullscreen().catch(() => {});
  });
  listen(dialog, 'click', event => { if (event.target === dialog) dialog.close(); });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.nebu-hero');
  const overview = document.querySelector('.nebu-overview');
  const quotation = document.querySelector('.nebu-quotation');
  const configurations = new Map();
  const active = new Set();
  const revealed = new WeakSet();
  const flipEase = 'linear';
  const fadeEase = 'cubic-bezier(0.47, 0, 0.745, 0.715)';
  const register = (selector, options = {}) => {
    document.querySelectorAll(selector).forEach(element => {
      configurations.set(element, { type: 'flip', duration: 1200, delay: 0, easing: 'linear', ...options });
    });
  };
  register('.brand-logo, .nebu-hero h1, .nebu-heading, .nebu-quotation-copy, .nebu-contact .contact-logo');
  register('.nebu-intro:not([hidden])', { easing: flipEase });
  register('.nebu-byline, .nebu-quotation-copy > p', { delay: 100, easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)' });
  register('.nebu-facts dt, .nebu-facts > div:not(.nebu-awards) dd, .nebu-awards dd p', { easing: flipEase });
  document.querySelectorAll('.nebu-design-copy article').forEach((element, index) => {
    configurations.set(element, { type: 'flip', duration: 1200, delay: [0, 120, 140][index] || 0, easing: flipEase });
  });
  document.querySelectorAll('.nebu-gallery a').forEach(element => {
    const index = Number(element.dataset.index);
    configurations.set(element, { type: 'fade', duration: 1100 + (index % 3) * 100, delay: 0, easing: 'ease-in', repeat: true });
  });

  // Keep the rules and borders stationary while their text flips/reveals.
  const wipes = [...document.querySelectorAll('.nebu-facts dt, .nebu-facts > div:not(.nebu-awards) dd, .nebu-detail-label')];
  let observer;
  let frame = 0;
  let needsMeasure = true;
  let viewportHeight = innerHeight;
  let heroHeight = 0;
  let quoteTop = 0;
  let quoteHeight = 0;
  let wipeBounds = [];
  const clamp = value => Math.max(0, Math.min(1, value));
  const layoutGallery = () => {
    const columns = [...gallery.querySelectorAll('.nebu-gallery-column')];
    const widths = columns.map(column => Math.round(column.getBoundingClientRect().width));
    galleryLinks.forEach((link, index) => {
      // Keep paired photos in source order; an unpaired final image stays left.
      const column = mobile.matches && current !== 'nebu' ? 0 : index % 2;
      const image = link.querySelector('img');
      const ratio = current === 'stem-classroom' || (current === 'glamour' && index < 2) ? 3 / 4 : Number(image.getAttribute('height')) / Number(image.getAttribute('width'));
      const height = Math.round(widths[column] * ratio);
      image.style.height = `${height}px`;
      if (link.parentElement !== columns[column] || columns[column].lastElementChild !== link) columns[column].append(link);
    });
  };
  // Layout offsets are unaffected by the entrance transforms.
  const documentTop = element => {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  };
  const measure = () => {
    layoutGallery();
    viewportHeight = innerHeight;
    heroHeight = hero.offsetHeight;
    quoteTop = documentTop(overview) + overview.offsetHeight;
    quoteHeight = quotation.offsetHeight;
    wipeBounds = wipes.map(element => ({ element, top: documentTop(element), height: element.offsetHeight, range: element.matches('.nebu-detail-label') ? .43 : .15 }));
    needsMeasure = false;
  };
  const render = () => {
    frame = 0;
    document.body.style.setProperty('--nebu-page-scroll', `${scrollY}px`);
    if (motion.matches) return;
    if (needsMeasure) measure();
    // Wix extends both ends of the cover timeline by 50vh. The 30px inset
    // belongs to its host banner, which is excluded from this site's shell.
    const progress = clamp((1.5 * viewportHeight - 30 + scrollY) / (heroHeight + 2 * viewportHeight));
    const shift = viewportHeight * (progress - .5);
    document.body.style.setProperty('--nebu-hero-shift', `${shift.toFixed(2)}px`);
    document.body.style.setProperty('--nebu-mobile-image-shift', `${(40.922 * viewportHeight / 844 + Math.min(scrollY, heroHeight) * .2).toFixed(2)}px`);
    wipeBounds.forEach(({ element, top, height, range }) => {
      const progress = clamp((viewportHeight + scrollY - top) / ((viewportHeight + height) * range));
      element.style.setProperty('--nebu-clip', `${((1 - progress) * 100).toFixed(2)}%`);
    });
    // Reference fade completes halfway through the section's cover timeline.
    const paper = clamp((viewportHeight + scrollY - quoteTop) / ((viewportHeight + quoteHeight) / 2));
    // Match the reference's eased background fade, including its host-banner inset.
    let paperOpacity = paper;
    {
      const progress = clamp((viewportHeight + scrollY - quoteTop - 30) / ((viewportHeight + quoteHeight) / 2));
      let low = 0, high = 1;
      for (let i = 0; i < 16; i++) {
        const t = (low + high) / 2;
        const x = 3 * (1 - t) ** 2 * t * .47 + 3 * (1 - t) * t ** 2 * .745 + t ** 3;
        if (x < progress) low = t; else high = t;
      }
      const t = (low + high) / 2;
      paperOpacity = 3 * (1 - t) * t ** 2 * .715 + t ** 3;
    }
    quotation.style.setProperty('--nebu-paper-opacity', paperOpacity.toFixed(3));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const track = (element, frames, options) => {
    const animation = element.animate(frames, { fill: 'backwards', ...options });
    active.add(animation);
    const release = () => { active.delete(animation); };
    animation.onfinish = release;
    animation.oncancel = release;
    return animation;
  };
  const enter = element => {
    const config = configurations.get(element);
    if (!config || motion.matches) return;
    element.classList.remove('nebu-motion-pending');
    if (config.mobileOnly && innerWidth > 750) return;
    revealed.add(element);
    if (config.type === 'fade') {
      track(element, [{ opacity: 0 }, { opacity: 1 }], config);
      return;
    }
    const depth = config.depth ?? element.offsetHeight / 2;
    track(element, [
      { transform: `perspective(800px) translateZ(-${depth}px) rotateX(80deg) translateZ(${depth}px)` },
      { transform: `perspective(800px) translateZ(-${depth}px) rotateX(0deg) translateZ(${depth}px)` }
    ], config);
    track(element, [{ opacity: 0 }, { opacity: 1 }], { duration: 840, delay: config.delay, easing: fadeEase });
  };
  const stop = () => {
    observer?.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
    [...active].forEach(animation => animation.cancel());
    configurations.forEach((_, element) => element.classList.remove('nebu-motion-pending'));
    wipes.forEach(element => {
      element.classList.remove('nebu-scroll-reveal');
      element.style.removeProperty('--nebu-clip');
    });
    document.body.style.removeProperty('--nebu-hero-shift');
    document.body.style.removeProperty('--nebu-mobile-image-shift');
    quotation.style.removeProperty('--nebu-paper-opacity');
  };
  const start = () => {
    stop();
    layoutGallery();
    document.body.style.setProperty('--nebu-page-scroll', `${scrollY}px`);
    if (motion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    needsMeasure = true;
    wipes.forEach(element => element.classList.add('nebu-scroll-reveal'));
    render();
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const element = entry.target;
        const config = configurations.get(element);
        if (entry.isIntersecting) {
          enter(element);
          if (!config.repeat) observer.unobserve(element);
        } else if (config.repeat) {
          [...active].filter(animation => animation.effect.target === element).forEach(animation => animation.cancel());
          element.classList.add('nebu-motion-pending');
        }
      });
    }, { threshold: 0 });
    configurations.forEach((config, element) => {
      // Restored scroll positions must not leave already-passed content hidden.
      if (!config.repeat && (revealed.has(element) || element.getBoundingClientRect().bottom <= 0)) return;
      element.classList.add('nebu-motion-pending');
      observer.observe(element);
    });
  };
  listen(document, 'focusin', event => {
    configurations.forEach((_, element) => {
      if (!element.contains(event.target)) return;
      element.classList.remove('nebu-motion-pending');
      revealed.add(element);
      observer?.unobserve(element);
      [...active].filter(animation => animation.effect.target === element).forEach(animation => animation.cancel());
    });
  });
  listen(window, 'scroll', schedule, { passive: true });
  const resize = () => { needsMeasure = true; if (motion.matches) layoutGallery(); else schedule(); };
  listen(window, 'resize', resize, { passive: true });
  listen(window, 'pageshow', resize);
  let layoutObserver;
  if ('ResizeObserver' in window) {
    layoutObserver = new ResizeObserver(resize);
    [hero, overview, quotation, document.querySelector('.nebu-design')].forEach(element => layoutObserver.observe(element));
  }
  document.fonts?.ready.then(() => { if (!listeners.signal.aborted) resize(); });
  listen(motion, 'change', start);
  start();

  return () => { stop(); listeners.abort(); layoutObserver?.disconnect(); };

  }
  let saved;
  try { saved = sessionStorage.getItem('nebu-project'); sessionStorage.removeItem('nebu-project'); } catch {}
  const requested = new URLSearchParams(location.search).get('project');
  render(requested || history.state?.nebuProject || saved || document.body.dataset.project || 'nebu');
  if (requested) {
    const url = new URL(location.href);
    url.searchParams.delete('project');
    history.replaceState({ ...history.state, nebuProject: current }, '', url.pathname + url.search + url.hash);
  }
})();
