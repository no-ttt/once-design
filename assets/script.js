/**
 * OnceDesign - Luxury Hero Banner Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Shared Wix-style arc used by the FIND US logo and links. The element
  // rotates around a point half its own height behind its centre.
  const arcTransform = (element, angle) => {
    const radius = element.offsetHeight / 2;
    return `perspective(800px) translateZ(${-radius}px) rotateX(${angle}deg) translateZ(${radius}px)`;
  };
  // Elements
  const header = document.querySelector('.site-header');
  const textSlab = document.getElementById('textSlab');
  const authorCredit = document.getElementById('authorCredit');
  const bgPhoto = document.getElementById('bgPhoto');
  const bottomStatement = document.getElementById('bottomStatement');
  const gridOverlay = document.getElementById('gridOverlay');
  
  let entranceTl;

  // ==========================================================================
  // 1. GSAP Entrance Sequence
  // ==========================================================================
  if (typeof gsap !== 'undefined') {
    // Wix uses a short 80° arc reveal with a linear 1.2s motion and a
    // separate 840ms fade. Keep the banner entrance compact and synchronized.
    entranceTl = gsap.timeline({ paused: true });

    // 1. Logo 3D 往前翻捲進場
    // 註：Menu 按鈕不帶進場動畫，載入即靜態常駐
    entranceTl.fromTo(
      '#brandLogo',
      {
        transform: () => arcTransform(document.querySelector('#brandLogo'), 80),
        opacity: 0
      },
      {
        transform: () => arcTransform(document.querySelector('#brandLogo'), 0),
        opacity: 1,
        duration: 1.2,
        ease: 'none'
      },
      0.01
    );

    // 2. 左側垂直線向下慢速延展
    entranceTl.fromTo(
      '.architectural-line-v',
      { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
      { scaleY: 1, opacity: 1, duration: 1.2, ease: 'none' },
      0.01
    );

    // 3. 右側水平線：由右向左平緩進行 (從螢幕右側往左延展至中島櫃檯)
    entranceTl.fromTo(
      '.architectural-line-h',
      { scaleX: 0, opacity: 0, transformOrigin: 'right center' },
      { scaleX: 1, opacity: 1, duration: 1.2, ease: 'none' },
      0.01
    );

    // 4. 主標題整組與 Logo 同步緩慢翻入
    entranceTl.fromTo(
      textSlab,
      {
        transform: () => arcTransform(textSlab, 80),
        opacity: 0
      },
      {
        transform: () => arcTransform(textSlab, 0),
        opacity: 1,
        duration: 1.2,
        ease: 'none'
      },
      0.01
    );

    entranceTl.fromTo(
      authorCredit,
      { transform: () => arcTransform(authorCredit, 80), opacity: 0 },
      { transform: () => arcTransform(authorCredit, 0), opacity: 1, duration: 1.2, ease: 'none' },
      0.01
    );

    entranceTl.progress(0).pause();

  } else if (authorCredit) {
    authorCredit.style.opacity = '1';
  }

  let entranceStarted = false;
  const revealHero = () => {
    window.clearTimeout(window.heroRevealFallback);
    document.documentElement.classList.remove('hero-loading');
    if (entranceTl && !entranceStarted) {
      entranceStarted = true;
      entranceTl.play(0);
    }
  };
  window.revealHeroAfterImage = revealHero;

  const waitForImage = image => {
    if (image.decode) return image.decode().catch(() => {});
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  };

  const heroImageUrl = document.getElementById('heroImagePreload')?.href;
  if (heroImageUrl) {
    const heroImage = new Image();
    heroImage.src = heroImageUrl;
    const logoImage = document.querySelector('.brand-logo img');
    const images = logoImage ? [heroImage, logoImage] : [heroImage];
    Promise.all(images.map(waitForImage)).then(revealHero);
  } else {
    revealHero();
  }

  // ==========================================================================
  // 3. Navigation Drawer Toggle & Close Handlers
  // ==========================================================================
  // Shared navigation is initialized by common.js.

  // ==========================================================================
  // 4. About Section - GSAP ScrollTrigger Entrance Reveal (Sticky Stack)
  // ==========================================================================
  const aboutSection = document.getElementById('about');
  const quoteLines = document.querySelectorAll('.quote-reveal-line');
  const aboutBadge = document.querySelector('.about-badge');

  // 通用：黑底標籤隨區塊「進場」由左往右長出，區塊頂部貼齊視窗頂端時剛好長滿。
  // 掛在傳入的 timeline 上（與該區塊其他進場動畫共用同一個 ScrollTrigger），
  // 若沒有提供 timeline 則自行建立一個獨立的。
  function addBadgeGrowOnEntrance(badge, section, timeline) {
    if (!badge || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const badgeState = { grow: 0 };
    function applyBadge() {
      badge.style.setProperty('--badge-grow', `${(badgeState.grow * 100).toFixed(2)}%`);
    }

    const tl = timeline || gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: true
      }
    });

    tl.to(badgeState, { grow: 1, duration: 0.25, ease: 'none', onUpdate: applyBadge }, 0);
  }

  if (aboutSection && quoteLines.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const lineStates = Array.from(quoteLines, () => ({ progress: 0 }));

    function applyLine(index) {
      quoteLines[index].style.setProperty('--reveal-progress', `${(lineStates[index].progress * 100).toFixed(2)}%`);
    }

    // 文字特效只在區塊「進場」的過程中跑：從區塊頂部進入視窗底部開始，
    // 到區塊頂部貼齊視窗頂端 (sticky 生效的瞬間) 剛好全部完成，貼頂後不再繼續播放。
    // 區塊本身改用 CSS position:sticky 貼在頂部，之後由下一個區塊自然往上蓋過去。
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top bottom',
        end: 'top top',
        scrub: true
      }
    });

    // ABOUT 標籤在進場前段就長出黑底
    addBadgeGrowOnEntrance(aboutBadge, aboutSection, aboutTl);

    // 4 行依序連續揭示，帶有些微交疊過渡，於貼頂瞬間全部完成
    const ranges = [
      [0.00, 0.28],
      [0.22, 0.52],
      [0.46, 0.76],
      [0.70, 1.00]
    ];

    quoteLines.forEach((line, index) => {
      const [rStart, rEnd] = ranges[index] || [0, 1];
      aboutTl.to(
        lineStates[index],
        { progress: 1, duration: rEnd - rStart, ease: 'none', onUpdate: () => applyLine(index) },
        rStart
      );
    });
  }

  // ==========================================================================
  // 5. Portfolio Section - PORTFOLIO 標籤進場長出效果
  // ==========================================================================
  const portfolioSection = document.getElementById('work');
  const portfolioBadge = document.querySelector('.portfolio-badge');
  if (portfolioSection && portfolioBadge && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Keep the PORTFOLIO tag hidden until its section actually enters the viewport.
    portfolioBadge.style.setProperty('--badge-grow', '0%');
    addBadgeGrowOnEntrance(portfolioBadge, portfolioSection);
  }

  const servicesSection = document.getElementById('services');
  const servicesIntro = document.querySelector('.services-intro');
  const servicesBadge = document.querySelector('.services-badge');
  if (servicesSection && servicesBadge && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    servicesBadge.style.setProperty('--badge-grow', '0%');
    addBadgeGrowOnEntrance(servicesBadge, servicesIntro);
  }

  const portfolioHeading = document.querySelector('.portfolio-heading');
  const honorsSection = document.getElementById('honors');
  const inquiriesSection = document.getElementById('faqs');
  const inquiriesBadge = document.querySelector('.inquiries-badge');
  const partnersSection = document.getElementById('partners');
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    // Match the reference's motion-arcIn: pivot half an element-height
    // behind its centre, with independent linear rotation and eased opacity.
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = [...contactSection.querySelectorAll('.contact-logo, .contact-links')];
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        target.style.opacity = '';
        const arc = target.animate([
          { transform: arcTransform(target, 80) }, { transform: arcTransform(target, 0) }
        ], { duration: 1200, delay: 1, easing: 'linear', fill: 'backwards' });
        const fade = target.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 840, delay: 1, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'backwards'
        });
        [arc, fade].forEach(animation => {
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      });
    });
    if (!motionPreference.matches) elements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
    motionPreference.addEventListener('change', ({ matches }) => {
      if (!matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      elements.forEach(element => { element.style.opacity = ''; });
    });
  }
  if (contactSection) {
    // Long forms scroll fully into view before sticking; footer follows the bottom edge.
    const updateContactSticky = () => {
      contactSection.style.setProperty('--contact-sticky-top', `${Math.min(0, window.innerHeight - contactSection.offsetHeight)}px`);
    };
    updateContactSticky();
    window.addEventListener('resize', updateContactSticky);
    if ('ResizeObserver' in window) new ResizeObserver(updateContactSticky).observe(contactSection);
  }
  const contactBadge = document.querySelector('.contact-badge');
  if (contactSection && contactBadge && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    contactBadge.style.setProperty('--badge-grow', '0%');
    addBadgeGrowOnEntrance(contactBadge, contactSection);
  }
  const partnersBadge = document.querySelector('.partners-badge');
  if (partnersSection && partnersBadge && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    partnersBadge.style.setProperty('--badge-grow', '0%');
    addBadgeGrowOnEntrance(partnersBadge, partnersSection);
  }
  if (inquiriesSection && inquiriesBadge && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    inquiriesBadge.style.setProperty('--badge-grow', '0%');
    addBadgeGrowOnEntrance(inquiriesBadge, inquiriesSection);
  }
  const honorsBadge = document.querySelector('.honors-badge');
  if (honorsSection && honorsBadge && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    honorsBadge.style.setProperty('--badge-grow', '0%');
    addBadgeGrowOnEntrance(honorsBadge, honorsSection);
  }

  // Content reveals follow scroll entrance; keep sticky positioning on the outer panels.
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const entranceMedia = gsap.matchMedia();
    entranceMedia.add('(prefers-reduced-motion: no-preference)', () => {
      const addFindUsArc = (element, trigger = element, delay = 0) => {
        if (!element) return;
        const reveal = gsap.timeline({ scrollTrigger: {
          trigger, start: 'top 90%', toggleActions: 'play none none reverse', invalidateOnRefresh: true
        } });
        reveal.fromTo(element,
          { transform: () => arcTransform(element, 80) },
          { transform: () => arcTransform(element, 0), duration: 1.2, ease: 'none' }, delay);
        reveal.fromTo(element, { opacity: 0 },
          { opacity: 1, duration: 0.84, ease: 'power1.in' }, delay);
      };
      if (contactSection) {
        addFindUsArc(contactSection.querySelector('.contact-title'));
      }
      if (inquiriesSection) {
        // The reference reveals the heading and accordion as separate arc entrances.
        for (const [selector, duration, delay] of [
          ['.inquiries-title', 1.5, 0.2],
          ['.inquiries-list', 1.2, 0.001]
        ]) {
          const element = inquiriesSection.querySelector(selector);
          const reveal = gsap.timeline({ scrollTrigger: {
            trigger: element, start: 'top bottom',
            toggleActions: 'play none none reverse', invalidateOnRefresh: true
          } });
          reveal.fromTo(element,
            { transform: () => arcTransform(element, 80) },
            { transform: () => arcTransform(element, 0), duration, ease: 'none' }, delay);
          reveal.fromTo(element, { opacity: 0 },
            { opacity: 1, duration: duration * 0.7, ease: 'power1.in' }, delay);
        }
      }
      if (partnersSection) {
        addFindUsArc(partnersSection.querySelector('.partners-title'));
      }
      if (servicesIntro) {
        servicesIntro.querySelectorAll('.services-intro-copy > :not(.services-description)')
          .forEach(element => addFindUsArc(element, servicesIntro));
        const introDescription = document.querySelector('.services-intro-copy > .services-description');
        if (introDescription) {
          const introReveal = gsap.timeline({ scrollTrigger: {
            trigger: servicesIntro,
            // Use the section's full entrance range so the same progress is
            // available in reverse when the user scrolls back upward.
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true
          } });
          // Same reveal model as each service panel: one reversible clip-path
          // tween, so scrolling back cleanly shortens the visible text.
          introReveal.fromTo(introDescription,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'none' }, 0);
        }
      }
      document.querySelectorAll('.service-panel').forEach(panel => {
        const entrance = gsap.timeline({ scrollTrigger: {
          trigger: panel, start: 'top 95%',
          // Finish when the sticky panel reaches its hand-off line, so the
          // next service replaces it exactly as the reveal completes.
          end: () => window.innerWidth <= 750 ? 'top 18%' : 'top 55%',
          scrub: true
        } });
        entrance.fromTo(panel.querySelector('.service-copy'),
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'none' }, 0);
        entrance.fromTo(panel.querySelector('.service-image'),
          { opacity: 0.35 }, { opacity: 1, duration: 1, ease: 'none' }, 0);
      });
      if (honorsSection) {
        addFindUsArc(honorsSection.querySelector('.honors-title'));
        gsap.fromTo('.honors-gallery',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: {
            trigger: '.honors-gallery', start: 'top 90%', toggleActions: 'play none none reverse'
          } });
        document.querySelectorAll('.honors-award').forEach(award => {
          // Animate the two text blocks independently; the divider stays still.
          const reveal = gsap.timeline({ scrollTrigger: {
            trigger: award, start: 'top bottom',
            toggleActions: 'play none none reverse', invalidateOnRefresh: true
          } });
          award.querySelectorAll('h3, p').forEach(text => {
            const delay = text.tagName === 'P' ? 0.2 : 0.001;
            reveal.fromTo(text,
              { transform: () => arcTransform(text, 80) },
              { transform: () => arcTransform(text, 0), duration: 1.2, ease: 'none' }, delay);
            reveal.fromTo(text,
              { opacity: 0 },
              { opacity: 1, duration: 0.84, ease: 'power1.in' }, delay);
          });
        });
      }
    });
  }

  if (inquiriesSection) {
    const faqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let faqRefreshFrame;
    const refreshInquiriesLayout = () => {
      // Refresh after the accordion settles, rather than during every animation frame.
      if (inquiriesSection.querySelector('[data-expanding]')) return;
      window.cancelAnimationFrame(faqRefreshFrame);
      faqRefreshFrame = window.requestAnimationFrame(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    };
    inquiriesSection.querySelectorAll('details').forEach(item => {
      const summary = item.querySelector('summary');
      let animation;
      let expanded = item.open;
      const finish = () => {
        if (animation) {
          animation.onfinish = null;
          animation.cancel();
          animation = null;
        }
        item.open = expanded;
        item.classList.toggle('is-open', expanded);
        item.style.removeProperty('overflow');
        delete item.dataset.expanding;
        summary.removeAttribute('aria-expanded');
        refreshInquiriesLayout();
      };
      summary.addEventListener('click', event => {
        event.preventDefault();
        if (!animation) expanded = item.open;
        expanded = !expanded;
        // Keep the accordion to one open item, with the previous item closing
        // through the same height animation before the new answer settles.
        if (expanded) {
          inquiriesSection.querySelectorAll('.inquiry-item.is-open, .inquiry-item[open]').forEach(other => {
            if (other !== item && typeof other.__closeInquiry === 'function') other.__closeInquiry();
          });
        }
        // Read the current animated height before canceling to allow smooth reversals.
        const from = parseFloat(getComputedStyle(item).height);
        if (animation) {
          animation.onfinish = null;
          animation.cancel();
        }
        if (faqMotion.matches || typeof item.animate !== 'function') {
          finish();
          return;
        }
        item.open = true;
        const border = parseFloat(getComputedStyle(item).borderBottomWidth) || 0;
        const to = expanded ? item.offsetHeight : summary.offsetHeight + border;
        item.style.overflow = 'hidden';
        item.dataset.expanding = '';
        summary.setAttribute('aria-expanded', String(expanded));
        animation = item.animate([
          { height: `${from}px` }, { height: `${to}px` }
        ], { duration: 250, easing: 'ease-out', fill: 'both' });
        animation.onfinish = finish;
      });
      item.__closeInquiry = () => {
        if (!item.open && !animation) return;
        summary.click();
      };
      item.addEventListener('toggle', () => {
        if (!animation) expanded = item.open;
        refreshInquiriesLayout();
      });
      window.addEventListener('resize', () => { if (animation) finish(); });
      faqMotion.addEventListener('change', () => { if (animation) finish(); });
    });
    if ('ResizeObserver' in window) {
      new ResizeObserver(refreshInquiriesLayout).observe(inquiriesSection);
    }
  }

  const honorsLogos = document.getElementById('honorsLogos');
  const honorsPrev = document.querySelector('.honors-prev');
  const honorsNext = document.querySelector('.honors-next');
  if (honorsLogos && honorsPrev && honorsNext) {
    const originalLogos = [...honorsLogos.children];
    const logoCount = originalLogos.length;
    // Surround the original sequence with copies so either direction loops smoothly.
    for (const prepend of [true, false]) {
      const copies = originalLogos.map(logo => {
        const copy = logo.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelector('img').alt = '';
        return copy;
      });
      if (prepend) honorsLogos.prepend(...copies);
      else honorsLogos.append(...copies);
    }
    let changingLogos = false;
    let manualFrame;
    let autoplayFrame;
    let lastFrameTime;
    let offset = 0;
    let cycleWidth = 0;
    const logoOffset = index => honorsLogos.children[index].offsetLeft - honorsLogos.firstElementChild.offsetLeft;
    const paintLogos = () => {
      if (!cycleWidth) return;
      offset = cycleWidth + ((offset - cycleWidth) % cycleWidth + cycleWidth) % cycleWidth;
      honorsLogos.scrollLeft = offset;
    };
    const positionLogos = () => {
      const progress = cycleWidth ? (offset - cycleWidth) / cycleWidth : 0;
      window.cancelAnimationFrame(manualFrame);
      changingLogos = false;
      cycleWidth = logoOffset(logoCount);
      offset = cycleWidth * (1 + progress);
      paintLogos();
    };
    const scrollHonors = direction => {
      if (changingLogos || !cycleWidth) return;
      const stops = [...honorsLogos.children].map((_, index) => logoOffset(index));
      const target = direction > 0
        ? stops.find(stop => stop > offset + 1)
        : stops.reverse().find(stop => stop < offset - 1);
      if (target === undefined) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        offset = target;
        paintLogos();
        return;
      }
      changingLogos = true;
      const from = offset;
      const started = performance.now();
      const advance = now => {
        const progress = Math.min(1, (now - started) / 1000);
        const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
        offset = from + (target - from) * eased;
        honorsLogos.scrollLeft = offset;
        if (progress < 1) manualFrame = window.requestAnimationFrame(advance);
        else {
          paintLogos();
          changingLogos = false;
        }
      };
      manualFrame = window.requestAnimationFrame(advance);
    };
    originalLogos.forEach(logo => logo.querySelector('img').addEventListener('load', positionLogos));
    positionLogos();
    honorsPrev.addEventListener('click', () => scrollHonors(-1));
    honorsNext.addEventListener('click', () => scrollHonors(1));
    window.addEventListener('resize', positionLogos);
    honorsLogos.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      scrollHonors(event.key === 'ArrowRight' ? 1 : -1);
    });
    let touchStart;
    honorsLogos.addEventListener('touchstart', event => {
      touchStart = event.changedTouches[0];
    }, { passive: true });
    honorsLogos.addEventListener('touchend', event => {
      const touch = event.changedTouches[0];
      if (!touchStart) return;
      const dx = touch.clientX - touchStart.clientX;
      const dy = touch.clientY - touchStart.clientY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) scrollHonors(dx < 0 ? 1 : -1);
      touchStart = null;
    }, { passive: true });

    const gallery = honorsLogos.closest('.honors-gallery');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let galleryVisible = false;
    const stopAutoplay = () => {
      window.cancelAnimationFrame(autoplayFrame);
      lastFrameTime = undefined;
    };
    const advanceAutoplay = now => {
      if (lastFrameTime !== undefined && !changingLogos) {
        // Wix's continuous slideshow travels at 40 CSS pixels per second.
        offset += Math.min(now - lastFrameTime, 100) * 0.04;
        paintLogos();
      }
      lastFrameTime = now;
      autoplayFrame = window.requestAnimationFrame(advanceAutoplay);
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (!galleryVisible || reducedMotion.matches || document.hidden ||
          gallery.matches(':hover') || gallery.contains(document.activeElement)) return;
      autoplayFrame = window.requestAnimationFrame(advanceAutoplay);
    };
    gallery.addEventListener('mouseenter', stopAutoplay);
    gallery.addEventListener('mouseleave', startAutoplay);
    gallery.addEventListener('focusin', stopAutoplay);
    gallery.addEventListener('focusout', () => window.setTimeout(startAutoplay, 0));
    gallery.addEventListener('touchstart', stopAutoplay, { passive: true });
    gallery.addEventListener('touchend', startAutoplay, { passive: true });
    reducedMotion.addEventListener('change', () => {
      window.cancelAnimationFrame(manualFrame);
      changingLogos = false;
      paintLogos();
      startAutoplay();
    });
    document.addEventListener('visibilitychange', startAutoplay);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        galleryVisible = entries[0].isIntersecting;
        startAutoplay();
      }, { threshold: 0.5 }).observe(gallery);
    } else {
      galleryVisible = true;
      startAutoplay();
    }
  }

  const partnersGallery = document.querySelector('.partners-gallery');
  if (partnersGallery) {
    const track = partnersGallery.querySelector('.partners-track');
    const viewport = partnersGallery.querySelector('.partners-viewport');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let manualOffset = 0;
    const updatePlayback = () => {
      track.style.animationPlayState = visible && !motionPreference.matches && !document.hidden &&
        !partnersGallery.matches(':hover') && !partnersGallery.contains(document.activeElement) ? 'running' : 'paused';
    };
    const moveClients = direction => {
      const group = track.firstElementChild;
      const distance = group.getBoundingClientRect().width;
      const step = group.children[1].offsetLeft - group.children[0].offsetLeft;
      const animation = track.getAnimations()[0];
      if (animation) {
        const duration = animation.effect.getTiming().duration;
        animation.currentTime = ((Number(animation.currentTime) + direction * duration * step / distance) % duration + duration) % duration;
      } else {
        manualOffset = ((manualOffset + direction * step) % distance + distance) % distance;
        track.style.transform = `translateX(${-manualOffset}px)`;
      }
    };
    partnersGallery.querySelector('.partners-prev').addEventListener('click', () => moveClients(-1));
    partnersGallery.querySelector('.partners-next').addEventListener('click', () => moveClients(1));
    viewport.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveClients(event.key === 'ArrowRight' ? 1 : -1);
    });
    partnersGallery.addEventListener('mouseenter', updatePlayback);
    partnersGallery.addEventListener('mouseleave', updatePlayback);
    partnersGallery.addEventListener('focusin', updatePlayback);
    partnersGallery.addEventListener('focusout', () => window.setTimeout(updatePlayback, 0));
    motionPreference.addEventListener('change', () => {
      track.style.removeProperty('transform');
      manualOffset = 0;
      updatePlayback();
    });
    document.addEventListener('visibilitychange', updatePlayback);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        updatePlayback();
      }, { threshold: 0.5 }).observe(viewport);
    }
  }


  if (portfolioSection && portfolioHeading && 'IntersectionObserver' in window) {
    portfolioHeading.classList.add('is-awaiting');
    const headingObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      portfolioHeading.classList.remove('is-awaiting');
      portfolioHeading.classList.add('is-revealing');
      headingObserver.disconnect();
    }, { threshold: 0.25, rootMargin: '0px 0px -12% 0px' });
    headingObserver.observe(portfolioSection);
  }

  // ==========================================================================
  // 6. Portfolio Slideshow
  // ==========================================================================
  const portfolioProjects = [
    {
      num: '01',
      category: 'RETAIL DESIGN',
      brand: 'NEBU',
      location: 'Grand Plaza',
      awardsStyle: 'bullets',
      awards: [
        'A’ Design Award 2025',
        'Muse Design awards 2025',
        'NT award 2025',
        'BLT Design Award 2025',
        "APIDA 2025"
      ]
    },
    {
      num: '02',
      category: 'RETAIL DESIGN',
      brand: 'Klasse 14',
      location: 'K11 Art Mall',
      awardsStyle: 'description',
      awards: [
        'Home Journal Award 2022 - Retail Design (Gold)'
      ]
    },
    {
      num: '03',
      category: 'RETAIL DESIGN',
      brand: 'Amore pacific',
      location: 'Ocean Centre',
      awardsStyle: 'description',
      awards: [
        "Retail design plays an indispensable role in the retail industry"
      ]
    },
    {
      num: '04',
      category: 'RETAIL DESIGN',
      brand: 'Tatcha',
      location: 'Harbour City',
      awardsStyle: 'description',
      awards: [
        "Retail design plays an indispensable role in the retail industry"
      ]
    },
    {
      num: '05',
      category: 'RETAIL DESIGN',
      brand: 'Murad',
      location: 'Harbour City',
      awardsStyle: 'description',
      awards: [
        'Murad HK Harbour City Lane Crawford Counter'
      ]
    }
  ];

  let currentSlide = 0;
  let isAnimating = false;

  const slidePhotos = document.querySelectorAll('#portfolioSlidesBg .portfolio-photo');
  const firstCard = document.getElementById('portfolioCard');
  const prevBtn = document.getElementById('portfolioPrevBtn');
  const nextBtn = document.getElementById('portfolioNextBtn');

  function fillCard(card, project) {
    card.querySelector('.num').textContent = project.num;
    card.querySelector('.category').textContent = project.category;
    card.querySelector('.brand-name').textContent = project.brand;
    const location = card.querySelector('.location-name');
    location.textContent = project.location;
    const awards = card.querySelector('.awards-list');
    awards.classList.toggle('is-description', project.awardsStyle === 'description');
    awards.innerHTML = project.awards.map(item => `<li>${item}</li>`).join('');
  }

  // Each Wix slide contains its own card, so the glass panel and all its text fade as one.
  const slideCards = portfolioProjects.map((project, index) => {
    const card = index === 0 ? firstCard : firstCard.cloneNode(true);
    if (index > 0) {
      card.removeAttribute('id');
      card.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      firstCard.parentNode.insertBefore(card, firstCard.nextSibling);
    }
    fillCard(card, project);
    card.classList.toggle('active', index === 0);
    return card;
  });

  function goToSlide(newIndex) {
    if (isAnimating || !firstCard || slidePhotos.length !== portfolioProjects.length) return;
    const total = portfolioProjects.length;
    const targetIndex = (newIndex + total) % total;
    if (targetIndex === currentSlide) return;
    isAnimating = true;
    const outgoing = [slidePhotos[currentSlide], slideCards[currentSlide]];
    const incoming = [slidePhotos[targetIndex], slideCards[targetIndex]];
    incoming.forEach(element => element.classList.add('active', 'is-entering'));
    outgoing.forEach(element => element.classList.add('is-leaving'));

    window.setTimeout(() => {
      outgoing.forEach(element => element.classList.remove('active', 'is-leaving'));
      incoming.forEach(element => element.classList.remove('is-entering'));
      currentSlide = targetIndex;
      isAnimating = false;
    }, 1000);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    });
  }

  // 支援左右滑動手勢
  if (portfolioSection) {
    let touchStartX = 0;
    let touchEndX = 0;
    portfolioSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    portfolioSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        goToSlide(currentSlide + 1);
      } else if (touchEndX - touchStartX > 50) {
        goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }
});
