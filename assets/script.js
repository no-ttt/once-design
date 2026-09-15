/**
 * OnceDesign - Luxury Hero Banner Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.querySelector('.site-header');
  const textSlab = document.getElementById('textSlab');
  const authorCredit = document.getElementById('authorCredit');
  const bgPhoto = document.getElementById('bgPhoto');
  const bottomStatement = document.getElementById('bottomStatement');
  const gridOverlay = document.getElementById('gridOverlay');
  
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navDrawer = document.getElementById('navDrawer');

  // ==========================================================================
  // 1. GSAP Entrance Sequence
  // ==========================================================================
  if (typeof gsap !== 'undefined') {
    const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Logo 3D 往前翻捲進場
    // 註：Menu 按鈕不帶進場動畫，載入即靜態常駐
    entranceTl.fromTo(
      '#brandLogo',
      {
        rotationX: 95,
        y: -40,
        z: -120,
        opacity: 0,
        transformOrigin: 'top center'
      },
      {
        rotationX: 0,
        y: 0,
        z: 0,
        opacity: 1,
        duration: 2.65,
        ease: 'sine.inOut'
      },
      0.15
    );

    // 2. 左側垂直線向下慢速延展
    entranceTl.fromTo(
      '.architectural-line-v',
      { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
      { scaleY: 1, opacity: 1, duration: 2.0, ease: 'power2.out' },
      0.25
    );

    // 3. 右側水平線：由右向左平緩進行 (從螢幕右側往左延展至中島櫃檯)
    entranceTl.fromTo(
      '.architectural-line-h',
      { scaleX: 0, opacity: 0, transformOrigin: 'right center' },
      { scaleX: 1, opacity: 1, duration: 2.2, ease: 'power2.out' },
      0.35
    );

    // 4. 主標題整組與 Logo 同步緩慢翻入
    entranceTl.fromTo(
      textSlab,
      {
        rotationX: 95,
        y: -60,
        z: -150,
        opacity: 0,
        transformOrigin: 'top center'
      },
      {
        rotationX: 0,
        y: 0,
        z: 0,
        opacity: 1,
        duration: 2.65,
        ease: 'sine.inOut'
      },
      0.25
    );

    entranceTl.fromTo(
      authorCredit,
      { rotationX: 95, y: -20, z: -60, opacity: 0, transformOrigin: 'top center' },
      { rotationX: 0, y: 0, z: 0, opacity: 1, duration: 2.65, ease: 'sine.inOut' },
      0.35
    );

  } else if (authorCredit) {
    authorCredit.style.opacity = '1';
  }

  // ==========================================================================
  // 3. Navigation Drawer Toggle & Close Handlers
  // ==========================================================================
  const navCloseBtn = document.getElementById('navCloseBtn');
  const navDrawerBackdrop = document.getElementById('navDrawerBackdrop');

  if (menuToggleBtn && navDrawer) {
    const navCloseIcon = navCloseBtn ? navCloseBtn.querySelector('.nav-close-icon') : null;

    function openMenu() {
      menuToggleBtn.classList.add('is-active');
      navDrawer.classList.add('open');
      if (navDrawerBackdrop) navDrawerBackdrop.classList.add('open');
      if (navCloseIcon) navCloseIcon.classList.remove('spin-to-cross', 'spin-back');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuToggleBtn.classList.remove('is-active');
      navDrawer.classList.remove('open');
      if (navDrawerBackdrop) navDrawerBackdrop.classList.remove('open');
      if (navCloseIcon) navCloseIcon.classList.remove('spin-to-cross', 'spin-back');
      document.body.style.overflow = '';
    }

    menuToggleBtn.addEventListener('click', () => {
      if (navDrawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', closeMenu);

      if (navCloseIcon) {
        navCloseBtn.addEventListener('mouseenter', () => {
          navCloseIcon.classList.remove('spin-back');
          navCloseIcon.classList.add('spin-to-cross');
        });

        navCloseBtn.addEventListener('mouseleave', () => {
          navCloseIcon.classList.remove('spin-to-cross');
          navCloseIcon.classList.add('spin-back');
        });
      }
    }

    if (navDrawerBackdrop) {
      navDrawerBackdrop.addEventListener('click', closeMenu);
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close when clicking nav links
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

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
  addBadgeGrowOnEntrance(portfolioBadge, portfolioSection);

  const portfolioHeading = document.querySelector('.portfolio-heading');
  if (portfolioSection && portfolioHeading && 'IntersectionObserver' in window) {
    portfolioHeading.classList.add('is-awaiting');
    const headingObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      portfolioHeading.classList.remove('is-awaiting');
      portfolioHeading.classList.add('is-revealing');
      headingObserver.disconnect();
    }, { threshold: 0.25 });
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
