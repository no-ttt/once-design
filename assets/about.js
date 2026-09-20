(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const storyLabel = document.querySelector('.about-story .section-label');
  if (storyLabel) {
    // Match the homepage badges: the black tag expands from left to right,
    // directly following scroll progress and reversing when the user scrolls back.
    const setStoryBadgeProgress = () => {
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, scrollY / (innerHeight * .25)));
      storyLabel.style.setProperty('--badge-grow', `${(progress * 100).toFixed(2)}%`);
    };
    setStoryBadgeProgress();
    addEventListener('scroll', setStoryBadgeProgress, { passive: true });
    addEventListener('resize', setStoryBadgeProgress);
    motion.addEventListener('change', setStoryBadgeProgress);
  }
  const targets = document.querySelectorAll('.about-page .brand-logo, .about-hero-heading, #about-title');
  const arrow = document.querySelector('.about-scroll');
  const storyCopy = document.querySelector('.about-story [data-story-copy]');
  const storyImage = document.querySelector('.about-story img[data-reveal]');
  const storyTextBlock = document.querySelector('#story-title')?.parentElement;
  const story = document.querySelector('.about-story');
  if (story && (storyCopy || storyImage || storyTextBlock)) {
    storyImage?.classList.remove('reveal-pending');
    const updateStoryReveal = () => {
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, scrollY / Math.max(1, story.offsetTop)));
      if (storyCopy) storyCopy.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      if (storyImage) storyImage.style.clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
    };
    updateStoryReveal();
    addEventListener('scroll', updateStoryReveal, { passive: true });
    addEventListener('resize', updateStoryReveal);
    motion.addEventListener('change', updateStoryReveal);
  }
  if (storyTextBlock && !motion.matches && Element.prototype.animate) {
    storyTextBlock.style.opacity = '0';
    const storyTextObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      storyTextObserver.disconnect();
      const depth = storyTextBlock.offsetHeight / 2;
      const arc = angle => `perspective(800px) translateZ(-${depth}px) rotateX(${angle}deg) translateZ(${depth}px)`;
      storyTextBlock.animate([{ transform: arc(80) }, { transform: arc(0) }], {
        duration: 1200, delay: 1, easing: 'linear', fill: 'forwards'
      });
      storyTextBlock.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 840, delay: 1, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'forwards'
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    storyTextObserver.observe(storyTextBlock);
  }
  const studioLayout = document.querySelector('.about-studio-layout');
  if (studioLayout && !motion.matches && Element.prototype.animate) {
    studioLayout.style.opacity = '0';
    const studioObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      studioObserver.disconnect();
      const depth = studioLayout.offsetHeight / 2;
      const arc = angle => `perspective(800px) translateZ(-${depth}px) rotateX(${angle}deg) translateZ(${depth}px)`;
      studioLayout.animate([{ transform: arc(80) }, { transform: arc(0) }], {
        duration: 1200, delay: 1, easing: 'linear', fill: 'forwards'
      });
      studioLayout.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 840, delay: 1, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'forwards'
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    studioObserver.observe(studioLayout);
  }
  const founder = document.querySelector('.about-founder');
  const founderImage = document.querySelector('.about-founder img[data-reveal]');
  const founderCopy = document.querySelector('.about-founder [data-founder-copy]');
  const founderTextBlock = document.querySelector('#founder-title')?.parentElement;
  if (founder && (founderImage || founderCopy)) {
    founderImage?.classList.remove('reveal-pending');
    const updateFounderReveal = () => {
      const imageTop = founderImage?.getBoundingClientRect().top ?? innerHeight;
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, (innerHeight - imageTop) / (innerHeight * .78)));
      if (founderImage) founderImage.style.clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
      if (founderCopy) founderCopy.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
    };
    updateFounderReveal();
    addEventListener('scroll', updateFounderReveal, { passive: true });
    addEventListener('resize', updateFounderReveal);
    motion.addEventListener('change', updateFounderReveal);
  }
  if (founderTextBlock && !motion.matches && Element.prototype.animate) {
    founderTextBlock.style.opacity = '0';
    const founderTextObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      founderTextObserver.disconnect();
      const depth = founderTextBlock.offsetHeight / 2;
      const arc = angle => `perspective(800px) translateZ(-${depth}px) rotateX(${angle}deg) translateZ(${depth}px)`;
      founderTextBlock.animate([{ transform: arc(80) }, { transform: arc(0) }], { duration: 1200, delay: 1, easing: 'linear', fill: 'forwards' });
      founderTextBlock.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 840, delay: 1, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'forwards' });
    }, { rootMargin: '0px 0px -20% 0px' });
    founderTextObserver.observe(founderTextBlock);
  }
  // The About contact block uses the same Wix arc + fade entrance as Home.
  const contactSection = document.querySelector('.about-contact #contact');
  if (contactSection && Element.prototype.animate) {
    const contactElements = [...contactSection.querySelectorAll('.contact-logo, .contact-links')];
    const contactAnimations = new Set();
    const contactObserver = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      contactObserver.unobserve(target);
      target.style.opacity = '';
      const depth = target.offsetHeight / 2;
      const arc = angle => `perspective(800px) translateZ(-${depth}px) rotateX(${angle}deg) translateZ(${depth}px)`;
      const arcAnimation = target.animate([{ transform: arc(80) }, { transform: arc(0) }], {
        duration: 1200, delay: 1, easing: 'linear', fill: 'backwards'
      });
      const fadeAnimation = target.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 840, delay: 1, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'backwards'
      });
      [arcAnimation, fadeAnimation].forEach(animation => {
        contactAnimations.add(animation);
        animation.onfinish = () => contactAnimations.delete(animation);
      });
    }));
    if (!motion.matches) contactElements.forEach(element => {
      element.style.opacity = '0';
      contactObserver.observe(element);
    });
    motion.addEventListener('change', ({ matches }) => {
      if (!matches) return;
      contactObserver.disconnect();
      contactAnimations.forEach(animation => animation.cancel());
      contactAnimations.clear();
      contactElements.forEach(element => { element.style.opacity = ''; });
    });
  }
  if (motion.matches || !Element.prototype.animate) return;
  const animations = new Set();
  const track = animation => {
    animations.add(animation);
    animation.onfinish = () => animations.delete(animation);
  };
  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (motion.matches) continue;
      if (target === arrow) {
        track(target.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], {
          duration: 1200, delay: 100, easing: 'linear', fill: 'backwards'
        }));
        continue;
      }
      const depth = target.offsetHeight / 2;
      const transform = angle => `perspective(800px) translateZ(-${depth}px) rotateX(${angle}deg) translateZ(${depth}px)`;
      track(target.animate([{ transform: transform(80) }, { transform: transform(0) }], {
        duration: 1200, delay: 1, easing: 'linear', fill: 'backwards'
      }));
      track(target.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 840, delay: 1, easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)', fill: 'backwards'
      }));
    }
  });
  targets.forEach(target => observer.observe(target));
  if (arrow) observer.observe(arrow);
  motion.addEventListener('change', ({ matches }) => {
    if (!matches) return;
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();
