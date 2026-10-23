/* One JSON source supplies the listing and every article permalink. */
(async () => {
  const content = document.getElementById('trend-content');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const href = item => `article.html?article=${encodeURIComponent(item.id)}`;
  const date = value => value ? new Date(value + 'T12:00:00').toLocaleDateString('zh-HK', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  // Article paragraphs support only editorial links and line breaks.
  const paragraph = value => {
    const template = document.createElement('template');
    template.innerHTML = value;
    const clean = node => {
      if (node.nodeType === Node.TEXT_NODE) return escape(node.textContent);
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const text = [...node.childNodes].map(clean).join('');
      if (node.tagName === 'BR') return '<br>';
      if (node.tagName === 'STRONG') return `<strong>${text}</strong>`;
      if (node.tagName === 'A' && /^(https?:\/\/|[^:/]+\.html(?:[?#]|$))/.test(node.getAttribute('href') || '')) return `<a href="${escape(node.getAttribute('href'))}"${node.classList.contains('trend-journey-link') ? ' class="trend-journey-link"' : ''}>${text}</a>`;
      return text;
    };
    return [...template.content.childNodes].map(clean).join('');
  };
  try {
    const response = await fetch('../assets/zh/data/trends-articles.json?v=3');
    if (!response.ok) throw new Error(`Articles: ${response.status}`);
    const items = await response.json();
    if (!Array.isArray(items) || !items.length || new Set(items.map(i => i.id)).size !== items.length) throw new Error('Invalid article IDs');
    if (!content) {
      const newestFirst = [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      for (const category of ['trends', 'press']) {
        const grid = document.querySelector(`#panel-${category} .trends-card-grid`);
        const categoryItems = newestFirst.filter(item => item.category === category);
        // Keep the authored Press projects when the article feed has no Press entries.
        if (!categoryItems.length) continue;
        grid.innerHTML = categoryItems.map(item => `<article class="trends-card">
          <a class="trends-card-image" href="${href(item)}" aria-label="閱讀 ${escape(item.title)}"><img src="${escape(item.thumbnail || item.hero)}" alt="${escape(item.title)}" width="1000" height="970" loading="lazy"></a>
          <div class="trends-card-meta">${item.date ? `<time datetime="${escape(item.date)}">${escape(date(item.date))}</time>` : `<span>${escape(item.label)}</span>`}<a class="trends-card-arrow" href="${href(item)}" aria-label="閱讀 ${escape(item.title)}">↗</a></div>
          <h3><a href="${href(item)}">${escape(item.title)}</a></h3><a class="trends-read-more" href="${href(item)}">了解更多</a></article>`).join('');
      }
      return;
    }
    const id = new URLSearchParams(location.search).get('article') || 'moorgen';
    const index = items.findIndex(item => item.id === id);
    if (index < 0) {
      document.title = '找不到文章 | ONCE DESIGN';
      content.innerHTML = '<div class="trend-loading"><h1>找不到文章</h1><a href="trends.html">返回所有文章</a></div>';
      return;
    }
    const item = items[index];
    // Previous/next follow the listing: same category, newest first.
    const listed = [...items].sort((a, b) => (b.date || '').localeCompare(a.date || '')).filter(entry => entry.category === item.category);
    const position = listed.indexOf(item);
    document.title = `${item.title} | ONCE DESIGN`;
    document.querySelector('meta[name="description"]').content = item.description || item.title;
    const meta = [date(item.date), item.author, item.readTime].filter(Boolean).join(' · ');
    const details = [item.author, item.readTime].filter(Boolean).join(' · ');
    const visibleMeta = (item.date ? `<time class="trend-meta-date" datetime="${escape(item.date)}">${escape(date(item.date))}</time>` : '') + (details ? `<span class="trend-meta-details">${escape(details)}</span>` : '');
    const header = item.titleImage ? `<header class="moorgen-title"><h1 class="moorgen-sr-only">${escape(item.title)}</h1><p class="moorgen-sr-only">${escape(meta)}</p><img src="${escape(item.titleImage)}" alt="" fetchpriority="high"></header>` : `<header class="moorgen-title trend-text-title"><p class="trend-kicker">${item.category === 'press' ? '媒體採訪' : '設計潮流'}</p><h1>${escape(item.title)}</h1><span class="trend-title-rule" aria-hidden="true"></span><p class="trend-meta">${visibleMeta}</p></header>`;
    const hero = item.heroInBlocks ? '' : `<figure class="moorgen-hero"><img src="${escape(item.hero)}" alt="${escape(item.title)}" fetchpriority="high"></figure>`;
    const blocks = item.blocks.map(block => {
      const layout = escape(block.layout || '');
      if (block.type === 'image') {
        const imageWidth = Math.max(1, Number(block.displayWidth) || Number(block.width) || 1728);
        return `<figure class="moorgen-photo ${block.layout ? '' : 'trend-auto-photo'}" style="--image-max-width:${imageWidth}px;${layout}" data-reference="${escape(block.reference)}"><img src="${escape(block.src)}" alt="${escape(block.alt || item.title)}" width="${Number(block.width) || 1728}" height="${Number(block.height) || 972}" loading="lazy">${block.caption ? `<figcaption>${escape(block.caption)}</figcaption>` : ''}</figure>`;
      }
      return `<section class="moorgen-copy ${escape(block.variant || '')} ${block.layout ? '' : 'trend-auto-copy'}" style="${layout}">${block.heading ? `<h2>${escape(block.heading)}</h2>` : ''}<div class="moorgen-prose">${(block.paragraphs || []).map(p => `<p>${paragraph(p)}</p>`).join('')}</div></section>`;
    });
    // Keep the article header first; only move leading body copy below its first image.
    if (item.heroInBlocks) {
      const firstImage = item.blocks.findIndex(block => block.type === 'image');
      if (firstImage > 0) blocks.unshift(blocks.splice(firstImage, 1)[0]);
    }
    const opening = header + hero + blocks.join('');
    content.innerHTML = opening + `<div class="moorgen-back"><a href="trends.html#articles">返回所有文章</a></div>` + (listed.length > 1 ? `<nav class="moorgen-navigation" aria-label="文章導覽">${[[-1,'上一篇'],[1,'下一篇']].map(([step,label]) => { const next = listed[(position + step + listed.length) % listed.length]; return `<a href="${href(next)}"><span>${label}</span><p>${escape(next.title)}</p></a>`; }).join('')}</nav>` : '');
    const motion = document.createElement('script');
    motion.src = '../assets/zh/js/article.js?v=efe9e52b';
    document.body.append(motion);
  } catch (error) {
    console.error(error);
    if (content?.querySelector('.trend-loading')) content.innerHTML = '<div class="trend-loading" role="alert"><h1>暫時無法載入文章</h1><p>請重新整理頁面後再試。</p><a href="trends.html">返回所有文章</a></div>';
  } finally {
    content?.removeAttribute('aria-busy');
  }
})();
