/* Chinese project pages share local navigation and the translated site shell. */
(() => {
  const projects = window.projectReferences;
  const root = document.getElementById('projectContent');
  const mobile = matchMedia('(max-width: 750px)');
  const params = new URLSearchParams(location.search);
  let current = projects.find(p => p.id === params.get('project')) || projects[0];
  const logo = document.querySelector('.brand-logo img');
  if (logo) logo.src = '../assets/images/shared/once-logo-horizontal.png';
  const arrow = '<svg viewBox="19.962 87.5 160.038 25" fill="currentColor" aria-hidden="true"><path d="M21.612 101.609h153.045l-7.656 8.117c-.55.583-.661 1.499-.172 2.135.623.81 1.789.845 2.46.133l10.272-10.891a1.606 1.606 0 0 0 0-2.206l-10.272-10.891a1.613 1.613 0 0 0-2.393.051c-.556.637-.458 1.619.122 2.234l7.639 8.099H21.612a1.61 1.61 0 1 0 0 3.219z"/></svg>';
  const circleArrow = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="20" cy="20" r="18.5"/><path d="M20 29V11m-8 8 8-8 8 8"/></svg>';
  // A wrapped mobile path centers the arrows on its lines; single lines keep the reference position.
  function centerBreadcrumbNav() {
    const nav = root.querySelector('.project-breadcrumb .project-circle-nav');
    if (!nav) return;
    nav.style.removeProperty('top');
    nav.style.removeProperty('bottom');
    const path = [...nav.parentElement.querySelectorAll('.project-block')].find(block => block.textContent.includes('>'));
    if (!mobile.matches || !path) return;
    const lineHeight = parseFloat(getComputedStyle(path.querySelector('p') || path).lineHeight);
    if (!(path.offsetHeight > lineHeight * 1.5)) return;
    nav.style.bottom = 'auto';
    nav.style.top = (path.offsetTop + (path.offsetHeight - nav.offsetHeight) / 2) + 'px';
  }
  // Place the mobile gallery below the rendered text and size the section to fit it.
  function fitDesignGallery(section) {
    const gallery = section.querySelector('.project-design-gallery');
    if (!gallery || !section.isConnected) return;
    const vw = px => px / innerWidth * 100 + 'vw';
    const text = [...section.querySelectorAll('.project-design-article > *')];
    if (text.length) gallery.style.top = vw(Math.max(...text.map(e => e.parentElement.offsetTop + e.offsetTop + e.offsetHeight)) + innerWidth * 0.14);
    section.style.height = vw(gallery.offsetTop + gallery.offsetHeight + innerWidth * 0.16);
  }
  // Pull a lone last-line character back up by tightening the paragraph's letter-spacing slightly.
  const spacingOrigins = new WeakMap();
  const punctuation = /[\s，。、；：？！「」『』（）《》〈〉…—．,.;:?!()"'“”‘’]/;
  function hasOrphan(paragraph) {
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    const chars = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeName === 'BR') chars.push({br:true});
      else if (node.nodeType === Node.TEXT_NODE) {
        for (let i = 0; i < node.data.length; i++) if (node.data[i].trim()) chars.push({node, i});
      }
    }
    const range = document.createRange();
    const top = ({node, i}) => {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      return range.getBoundingClientRect().top;
    };
    if (!chars.length || chars.at(-1).br) return false;
    const lastTop = top(chars.at(-1));
    let count = 0;
    for (let k = chars.length - 1; k >= 0; k--) {
      const char = chars[k];
      if (char.br) return false;
      if (Math.abs(top(char) - lastTop) > 2) return count <= 1;
      if (!punctuation.test(char.node.data[char.i])) count++;
      if (count > 1) return false;
    }
    return false;
  }
  function fixOrphans() {
    root.querySelectorAll('.project-overview .project-block p, .project-design-article p').forEach(paragraph => {
      const elements = [paragraph, ...paragraph.querySelectorAll('*')];
      elements.forEach(el => { if (spacingOrigins.has(el)) el.style.letterSpacing = spacingOrigins.get(el); });
      if (!paragraph.offsetWidth || !hasOrphan(paragraph)) return;
      const metrics = elements.map(el => {
        if (!spacingOrigins.has(el)) spacingOrigins.set(el, el.style.letterSpacing);
        const style = getComputedStyle(el);
        return [el, parseFloat(style.letterSpacing) || 0, parseFloat(style.fontSize)];
      });
      for (let step = .005; step <= .1; step += .005) {
        metrics.forEach(([el, base, size]) => { el.style.letterSpacing = (base - step * size) + 'px'; });
        if (!hasOrphan(paragraph)) return;
      }
      metrics.forEach(([el]) => { el.style.letterSpacing = spacingOrigins.get(el); });
    });
  }
  function render(focus = false) {
    const view = current.views[mobile.matches ? '390' : '1440'];
    document.title = current.title.replace(/\n/g, ' ') + ' | ONCE DESIGN';
    document.body.dataset.project = current.id;
    const overview = view[2].blocks.find(b => b.type === 'text' && b.text.length > 60);
    document.querySelector('meta[name="description"]').content = overview?.text || current.title + ' — 一場設計作品';
    root.replaceChildren();
    view.forEach((data, index) => {
      const section = document.createElement('section');
      section.className = 'project-section project-' + data.kind;
      section.style.height = data.height + 'vw';
      section.setAttribute('aria-label', ['作品主視覺', '作品導覽', '項目資料', '設計理念', '設計詳情'][index] || '作品導覽');
      const renderedBlocks = new Map();
      for (const block of data.blocks) {
        const element = document.createElement(block.type === 'image' ? 'img' : 'div');
        element.className = 'project-block';
        renderedBlocks.set(block, element);
        Object.assign(element.style, {left:block.x+'vw',top:block.y+'vw',width:block.width+'vw'});
        if (block.type === 'image') {
          element.src = block.src;
          element.alt = block.alt;
          element.style.height = block.height + 'vw';
          if (block.position) element.style.objectPosition = block.position;
          element.loading = index === 0 ? 'eager' : 'lazy';
          if (index === 0) element.fetchPriority = 'high';
        } else {
          element.innerHTML = block.html;
          // Banner copy is plain text, never a link.
          if (index === 0) element.querySelectorAll('a').forEach(link => link.replaceWith(...link.childNodes));
          if (data.kind === 'breadcrumb' && block.text.includes('>')) {
            const categories = { '零售商店': 'retail', '餐飲空間': 'food', '娛樂休閒': 'hospitality', '辦公空間': 'corporate', '教育文化': 'education' };
            const parts = element.textContent.split('>').map(text => text.trim());
            element.querySelectorAll('a').forEach(link => link.replaceWith(...link.childNodes));
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            let part = 0;
            nodes.forEach(node => {
              const fragment = document.createDocumentFragment();
              node.data.split(/(>)/).forEach(text => {
                if (text === '>') {
                  part++;
                  fragment.append(document.createTextNode(text));
                } else if (text.trim()) {
                  const link = document.createElement('a');
                  const panel = categories[parts[part]];
                  link.href = part === 0 ? 'index.html' : part === parts.length - 1
                    ? 'project.html?project=' + encodeURIComponent(current.id)
                    : 'work.html' + (panel ? '#panel-' + panel : '');
                  if (part === parts.length - 1) link.setAttribute('aria-current', 'page');
                  link.textContent = text;
                  fragment.append(link);
                } else fragment.append(document.createTextNode(text));
              });
              node.replaceWith(fragment);
            });
          }

          // Keep a space inside both quotation marks without changing inline markup.
          if (data.kind === 'quote') {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              walker.currentNode.textContent = walker.currentNode.textContent
                .replace(/「\s*/g, '「\u00a0').replace(/\s*」/g, '\u00a0」');
            }
          }
          for (const [key,value] of Object.entries(block.style)) element.style.setProperty(key,value);
          if (index === 0 && !block.text.toLowerCase().includes('by once')) {
            const original = element.querySelector('h1,h2,h3');
            if (original) {
              const title = document.createElement('h1');
              title.style.cssText = original.style.cssText;
              title.id = 'projectTitle';
              title.append(...original.childNodes);
              original.replaceWith(title);
              section.setAttribute('aria-labelledby', title.id);
            }
          }
          if (block.text === '查詢更多資訊') {
            const link = document.createElement('a');
            link.href = '#contact';
            link.append(...element.childNodes);
            element.append(link);
            element.classList.add('project-inquiry');
          }
          if (block.text === '設計詳情') {
            element.classList.add('project-detail-label');
            element.textContent = block.text;
            element.removeAttribute('style');
          }
          if (block.text.toLowerCase() === 'by once design') element.classList.add('project-byline');
          if (data.kind === 'overview' && block.text.length > 60 && !/<h[1-6]/.test(block.html)) element.classList.add('project-article-copy');
          if (data.kind === 'navigation') {
            const link = element.querySelector('a');
            if (link) {
              if (block.text.includes('下一則')) {
                if (!current.next) continue;
                link.href = 'project.html?project=' + current.next;
              } else if (block.text.includes('返回')) {
                link.href = 'work.html';
              }
              const icon = document.createElement('span');
              icon.className = 'project-nav-icon' + (block.text.includes('返回') ? ' project-nav-back' : '');
              icon.innerHTML = arrow;
              link.append(icon);
            }
          }
        }
        section.append(element);
      }
      if (data.kind === 'breadcrumb') {
        const nav = document.createElement('nav');
        nav.className = 'project-circle-nav';
        nav.setAttribute('aria-label','作品切換');
        for (const [id,label] of [[current.previous,current.previous ? '上一個作品' : '返回作品列表'],[current.next,'下一個作品']]) {
          if (!id && label === '下一個作品') continue;
          const link = document.createElement('a');
          link.href = id ? 'project.html?project='+id : 'work.html';
          link.setAttribute('aria-label',label);
          link.innerHTML = circleArrow;
          nav.append(link);
        }
        section.append(nav);
      }
      if (data.kind === 'overview') {
        const heading = data.blocks.find(b => b.type === 'text' && /<h[1-3]/.test(b.html));
        if (heading) {
          const inquiry = document.createElement('a');
          inquiry.className = 'project-heading-arrow';
          inquiry.href = '#contact';
          inquiry.setAttribute('aria-label','查詢更多資訊');
          inquiry.style.left = (mobile.matches ? 64.6 : 24.5)+'vw';
          inquiry.style.top = (mobile.matches ? heading.y+1 : heading.y+heading.height-1.8)+'vw';
          if (['klasse14', 'tatcha-ifc'].includes(current.id)) {
            // Coordinates and size from this project's reference at 1440/390px.
            const [left, top, size] = mobile.matches
              ? [64.6634615385, 14.375, 3.5817307692]
              : [27.7354600694, 8.9377170139, 1.3118489583];
            Object.assign(inquiry.style, { left:left+'vw', top:top+'vw', width:size+'vw', height:size+'vw' });
            if (current.id === 'tatcha-ifc' && mobile.matches) inquiry.style.top = '22.3397435897vw';
          }          inquiry.innerHTML = '<svg viewBox="19.2 22.3 160.1 158.5" fill="currentColor" aria-hidden="true"><path d="M88.5 22.3v5.8h80.9L19.2 176.7l4.1 4.1L173.6 32.1v80.2h5.7v-90H88.5z"/></svg>';
          if (['amorepacific', 'stem-classroom', 'computer-classroom', 'junior-versity', 'stem-computer-lab'].includes(current.id)) {
            const canvas = mobile.matches ? 390 : 1440;
            const [x, y, size] = current.id === 'stem-computer-lab'
              ? (mobile.matches ? [295.9375, 56.078125, 16.671875] : [452.359375, 128.6875, 22.171875])
              : current.id === 'junior-versity'
              ? (mobile.matches ? [337.078125, 89.46875, 16.625] : [454.515625, 78, 22.640625])
              : current.id === 'computer-classroom'
              ? (mobile.matches ? [297.90625, 121.796875, 16.796875] : [474.640625, 165.5, 23.890625])
              : current.id === 'stem-classroom'
              ? (mobile.matches ? [295.703125, 122.59375, 16] : [462.984375, 169.578125, 23.171875])
              : mobile.matches
              ? [252.1875, 90.125, 13.96875]
              : [422.703125, 128.6875, 20.328125];
            Object.assign(inquiry.style, {
              left:x/canvas*100+'vw', top:y/canvas*100+'vw',
              width:size/canvas*100+'vw', height:size/canvas*100+'vw'
            });
          }
          const titleBlock = [...section.querySelectorAll('.project-block')].find(element => element.querySelector('h1,h2,h3'));
          if (titleBlock) {
            inquiry.style.left = (parseFloat(inquiry.style.left) - heading.x) + 'vw';
            inquiry.style.top = (parseFloat(inquiry.style.top) - heading.y) + 'vw';
            titleBlock.append(inquiry);
          } else {
            section.append(inquiry);
          }
        }
        // Include the opening rule as well as the separators below each fact.
        const labels = data.blocks.filter(b => b.type === 'text' && ['項目地區','完工年份','項目類型','空間面積'].includes(b.text.trim()));
        if (labels.length) {
          const rule = document.createElement('div');
          rule.className = 'project-fact-rule project-facts-top-rule';
          rule.setAttribute('aria-hidden', 'true');
          rule.style.left = labels[0].x + 'vw';
          rule.style.width = (mobile.matches ? 84 : 42.7) + 'vw';
          rule.style.top = (labels[0].y - 1.1) + 'vw';
          section.append(rule);
        }
        labels.forEach((block,i) => {
          const rowTop = block.y - 1.1;
          const rowBottom = labels[i+1] ? labels[i+1].y - 1.1 : block.y + block.height + 1.3;
          data.blocks.filter(item => item.type === 'text' && item.x >= block.x - .1 &&
            item.y >= rowTop && item.y < rowBottom).forEach(item => {
            const cell = renderedBlocks.get(item);
            cell.classList.add('project-fact-cell');
            cell.style.top = rowTop + 'vw';
            cell.style.height = (rowBottom - rowTop) + 'vw';
          });
          const rule=document.createElement('div');
          rule.className='project-fact-rule';
          rule.style.left=block.x+'vw';
          rule.style.width=(mobile.matches ? 84 : 42.7)+'vw';
          rule.style.top=(labels[i+1] ? labels[i+1].y-1.1 : block.y+block.height+1.3)+'vw';
          section.append(rule);
        });
        const awards = data.blocks.find(b => b.type === 'text' && b.text.trim() === '榮獲獎項');
        if (awards) {
          const awardRows = data.blocks.filter(b => b.type === 'text' && b.x >= awards.x && b.y >= awards.y);
          const rule = document.createElement('div');
          rule.className = 'project-fact-rule project-awards-rule';
          rule.setAttribute('aria-hidden', 'true');
          rule.style.left = awards.x + 'vw';
          rule.style.width = (mobile.matches ? 84 : 42.7) + 'vw';
          rule.style.top = (Math.max(...awardRows.map(b => b.y + b.height)) + 1.3) + 'vw';
          section.append(rule);
        }
      }
      if (data.kind === 'quote') {
        const blocks = [...section.querySelectorAll('.project-block')];
        if (blocks.length) {
          const x = Math.min(...blocks.map(e => parseFloat(e.style.left)));
          const y = Math.min(...blocks.map(e => parseFloat(e.style.top)));
          const width = Math.max(...data.blocks.map(b => b.x+b.width))-x;
          const height = Math.max(...data.blocks.map(b => b.y+b.height))-y;
          const group = document.createElement('div');
          group.className = 'project-quote-copy';
          Object.assign(group.style,{left:x+'vw',top:y+'vw',width:width+'vw',height:height+'vw'});
          blocks.forEach(e => {
            e.style.left = (parseFloat(e.style.left)-x)+'vw';
            e.style.top = (parseFloat(e.style.top)-y)+'vw';
            group.append(e);
          });
          section.append(group);
        }
      }
      if (data.kind === 'design') {
        let article;
        [...section.querySelectorAll('.project-block:not(img):not(.project-detail-label)')].forEach(element => {
          if (!article || element.querySelector('h1,h2,h3,h4,h5,h6') || element.textContent.trim().startsWith('如欲了解更多')) {
            article = document.createElement('div');
            article.className = 'project-design-article';
            section.append(article);
          }
          article.append(element);
        });
        section.querySelectorAll('.project-design-article').forEach(article => {
          const children = [...article.children];
          const left = Math.min(...children.map(e => parseFloat(e.style.left)));
          const top = Math.min(...children.map(e => parseFloat(e.style.top)));
          const right = Math.max(...children.map(e => parseFloat(e.style.left) + parseFloat(e.style.width)));
          Object.assign(article.style, {position:'absolute', left:left+'vw', top:top+'vw', width:(right-left)+'vw'});
          children.forEach(e => {
            e.style.left = (parseFloat(e.style.left)-left)+'vw';
            e.style.top = (parseFloat(e.style.top)-top)+'vw';
          });
        });
        // Mobile matches the English page: one full-width column at each photo's own proportions.
        const images = [...section.querySelectorAll('img.project-block')]
          .sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top) || parseFloat(a.style.left) - parseFloat(b.style.left));
        if (mobile.matches && images.length) {
          const gallery = document.createElement('div');
          gallery.className = 'project-design-gallery';
          gallery.style.top = Math.min(...images.map(e => parseFloat(e.style.top))) + 'vw';
          images.forEach(image => {
            ['left', 'top', 'width', 'height'].forEach(key => image.style.removeProperty(key));
            image.addEventListener('load', () => fitDesignGallery(section), {once:true});
            gallery.append(image);
          });
          section.append(gallery);
        }
      }
      root.append(section);
    });
    // Keep language switching on this particular project.
    document.querySelectorAll('.lang-item').forEach(link => {
      link.href = (link.lang === 'zh-Hant' ? '' : '../en/') + 'project.html?project=' + current.id;
    });
    root._stopMotion?.();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const articles = [...root.querySelectorAll('.project-design-article')];
    const targets = [...document.querySelectorAll('.brand-logo, .contact-logo'), ...root.querySelectorAll('.project-hero .project-block:not(img), .project-overview .project-block, .project-quote-copy, .project-quote .project-byline, .project-design-article, .project-design img.project-block, .project-detail-label')];
    let observer;
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      targets.forEach(element => { element.style.opacity = ''; });
    };
    const play = (element, frames, options) => {
      const animation = element.animate(frames, {fill:'backwards', ...options});
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const onPreference = () => { if (motion.matches) stop(); };
    motion.addEventListener('change', onPreference);
    const cleanupMotion = () => { stop(); motion.removeEventListener('change', onPreference); };
    root._stopMotion = cleanupMotion;
    document.fonts.ready.then(() => {
      if (root._stopMotion !== cleanupMotion) return;
      fixOrphans();
      if (!mobile.matches) {
        root.querySelectorAll('.project-overview').forEach(section => {
          const inquiry = section.querySelector('.project-inquiry');
          const rules = [...section.querySelectorAll('.project-fact-rule')];
          if (!inquiry || !rules.length) return;
          const bottom = Math.max(...rules.map(rule => parseFloat(rule.style.top)));
          inquiry.style.top = (bottom - inquiry.offsetHeight / innerWidth * 100) + 'vw';
        });
      }
      articles.forEach(article => {
        article.style.height = Math.max(...[...article.children].map(e => e.offsetTop + e.offsetHeight)) + 'px';
      });
      if (mobile.matches) {
        root.querySelectorAll('.project-overview').forEach(section => {
          const content = [...section.querySelectorAll(':scope > .project-block, :scope > .project-fact-rule')];
          if (!content.length) return;
          const bottom = Math.max(...content.map(element => element.offsetTop + element.offsetHeight));
          section.style.height = (bottom + innerWidth * 0.18) + 'px';
        });
        root.querySelectorAll('.project-design').forEach(fitDesignGallery);
      }
      centerBreadcrumbNav();
    });
    if (!motion.matches) {
      targets.forEach(element => { element.style.opacity = '0'; });
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        const element = entry.target;
        if (!entry.isIntersecting) return;
        observer.unobserve(element);
        element.style.opacity = '';
        if (element.classList.contains('project-detail-label')) {
          play(element, [{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}], {duration:1000,easing:'linear'});
        } else if (element.tagName === 'IMG') {
          play(element, [{opacity:0},{opacity:1}], {duration:1200,easing:'ease-in'});
        } else {
          const depth = element.offsetHeight / 2;
          const byline = element.classList.contains('project-byline');
          const delay = byline ? 100 : ([0,120,140][articles.indexOf(element)] || 0);
          play(element, [
            {transform:`perspective(800px) translateZ(-${depth}px) rotateX(80deg) translateZ(${depth}px)`},
            {transform:`perspective(800px) translateZ(-${depth}px) rotateX(0deg) translateZ(${depth}px)`}
          ], {duration:1200,delay,easing:byline ? 'cubic-bezier(0.55, 0.055, 0.675, 0.19)' : 'linear'});
          play(element, [{opacity:0},{opacity:1}], {duration:840,delay,easing:'cubic-bezier(.47,0,.745,.715)'});
        }
      }), {threshold:0});
      document.fonts.ready.then(() => {
        if (!motion.matches && root._stopMotion === cleanupMotion) {
          targets.forEach(element => {
            if (element.getBoundingClientRect().bottom <= 0) element.style.opacity = '';
            else observer.observe(element);
          });
        }
      });
    }
    if (focus) {
      const title = root.querySelector('h1') || root;
      title.tabIndex = -1;
      title.focus({preventScroll:true});
    }
  }
  root.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname) return;
    const next = projects.find(p => p.id === url.searchParams.get('project'));
    if (!next || next.id === current.id) return;
    event.preventDefault();
    current = next;
    history.pushState(null,'',url);
    render(true);
    scrollTo({top:0,behavior:'instant'});
    scheduleHero();
  });
  addEventListener('popstate',()=>{
    current = projects.find(p=>p.id===new URLSearchParams(location.search).get('project')) || projects[0];
    render(true);
    scheduleHero();
  });
  // Banner parallax follows the English project page timeline.
  const heroMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let heroFrame = 0;
  const shiftHero = () => {
    heroFrame = 0;
    const hero = root.querySelector('.project-hero');
    if (!hero || heroMotion.matches) {
      document.body.style.removeProperty('--zh-hero-shift');
      return;
    }
    const height = hero.offsetHeight;
    const viewport = innerHeight;
    const shift = mobile.matches
      ? Math.min(scrollY, height) * .2
      : viewport * (Math.max(0, Math.min(1, (1.5 * viewport - 30 + scrollY) / (height + 2 * viewport))) - .5);
    document.body.style.setProperty('--zh-hero-shift', shift.toFixed(2) + 'px');
  };
  const scheduleHero = () => { if (!heroFrame) heroFrame = requestAnimationFrame(shiftHero); };
  addEventListener('scroll', scheduleHero, {passive:true});
  addEventListener('resize', scheduleHero, {passive:true});
  addEventListener('resize', centerBreadcrumbNav, {passive:true});
  let orphanTimer;
  addEventListener('resize', () => { clearTimeout(orphanTimer); orphanTimer = setTimeout(fixOrphans, 150); }, {passive:true});
  heroMotion.addEventListener('change', scheduleHero);
  mobile.addEventListener('change',()=>{ render(); scheduleHero(); });
  render();
  shiftHero();
})();
