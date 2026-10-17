/* Homepage-only localization; preserve the shared shell's controls and handlers. */
(() => {
  const labels = {
    HOME: '故事', ABOUT: '關於', WORK: '作品', TRENDS: '動勢', FAQs: '問答', CONTACT: '聯絡', QUOTE: '報價',
    'BACK TO TOP': '返回頂端', 'FIND US': '設計諮詢', 'START A CONSULTATION': '預約設計諮詢',
    'FIRST NAME': '名字', 'LAST NAME': '姓氏', EMAIL: '電子信箱', 'PHONE NUMBER': '聯絡電話',
    'COMPANY NAME': '公司名稱', 'DESIGN REQUIREMENT / PROJECT TYPE': '設計需求 / 空間類型',
    'UPLOAD FLOOR PLAN ( JPG / PDF )': '上傳平面圖 ( JPG / PDF )', SUBMIT: '確認送出',
    'Continue by email and attach your floor plan.': '請透過電子郵件繼續諮詢，並附上平面圖。', 'OPEN EMAIL ↗': '開啟電子郵件 ↗'
  };
  for (const root of document.querySelectorAll('[data-site-header], .site-navigation-layer, [data-site-footer], [data-site-contact]')) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const key = node.textContent.trim();
      if (labels[key]) node.textContent = node.textContent.replace(key, labels[key]);
    }
  }
  document.getElementById('contactTitle').textContent = '聯絡我們';
  document.querySelectorAll('.lang-item').forEach(link => {
    const chinese = link.lang === 'zh-Hant';
    link.href = chinese ? 'index.html' : '../en/index.html';
    link.classList.toggle('active', chinese);
    if (chinese) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  // The Chinese reference footer contains six navigation links.
  document.querySelector('.footer-nav a[href="quote.html"]')?.remove();
  const aria = {
    'ONCE DESIGN Home': 'ONCE DESIGN 首頁', 'Toggle navigation menu': '切換導覽選單',
    'Close navigation menu': '關閉導覽選單', Navigation: '導覽選單', 'Language Selector': '選擇語言',
    'Footer navigation': '頁尾導覽', 'Country code': '國際電話區號', 'Choose floor plan, JPG or PDF': '選擇平面圖，JPG 或 PDF',
    'Previous project': '上一個作品', 'Next project': '下一個作品', 'Previous award logos': '上一組獎項',
    'Next award logos': '下一組獎項', 'Previous client logos': '上一組客戶', 'Next client logos': '下一組客戶',
    'Hero Banner': '設計理念', 'About Section': '一場故事', Portfolio: '精選作品'
  };
  document.querySelectorAll('[aria-label]').forEach(el => {
    const text = aria[el.getAttribute('aria-label')];
    if (text) el.setAttribute('aria-label', text);
  });
  // Runs after shared script.js builds the five carousel cards; every slide shares the same category.
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.portfolio-card .category').forEach(category => (category.textContent = '商業設計'));
  });
  // The Chinese reference places business details before the form on mobile.
  // The shared breakpoint listener restores the desktop order first.
  const mobileContact = matchMedia('(max-width: 750px)');
  const arrangeChineseContact = () => {
    if (!mobileContact.matches) return;
    const consultation = document.querySelector('.contact-consultation');
    const links = document.querySelector('.contact-links');
    if (consultation && links) consultation.before(links);
  };
  arrangeChineseContact();
  mobileContact.addEventListener('change', arrangeChineseContact);
  const form = document.getElementById('consultationForm');
  form.addEventListener('submit', () => {
    form.querySelectorAll('.contact-error-text').forEach(error => {
      error.textContent = error.closest('.contact-field').querySelector('[name="email"]')
        ? '請輸入有效的電子信箱，例如 example@mysite.com。' : '請上傳平面圖。';
    });
  });
})();
