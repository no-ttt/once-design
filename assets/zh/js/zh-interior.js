/* Chinese interior pages only; the English shell and homepage are independent. */
(() => {
  const labels = {
    HOME: '故事', ABOUT: '關於', WORK: '作品', TRENDS: '趨勢', FAQS: '問答', CONTACT: '聯絡', QUOTE: '報價',
    'BACK TO TOP': '返回頂端', 'FIND US': '設計諮詢', 'START A CONSULTATION': '預約設計諮詢',
    'FIRST NAME': '名字', 'LAST NAME': '姓氏', EMAIL: '電子信箱', 'PHONE NUMBER': '聯絡電話',
    'COMPANY NAME': '公司名稱', 'DESIGN REQUIREMENT / PROJECT TYPE': '設計需求 / 空間類型',
    'UPLOAD FLOOR PLAN ( JPG / PDF )': '上傳平面圖 ( JPG / PDF )', SUBMIT: '確認送出',
    'Continue by email and attach your floor plan.': '請透過電子郵件繼續諮詢，並附上平面圖。',
    'OPEN EMAIL ↗': '開啟電子郵件 ↗', 'No results found': '找不到符合的結果'
  };
  const hasChineseContact = ['about', 'work', 'trends'].includes(document.body.dataset.page);
  const roots = document.querySelectorAll(hasChineseContact
    ? '[data-site-header], #navDrawer, [data-site-footer], [data-site-contact], .country-picker'
    : '[data-site-header], #navDrawer, .country-picker');
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const key = node.textContent.trim();
      if (labels[key]) node.textContent = node.textContent.replace(key, labels[key]);
    }
  }
  const page = location.pathname.split('/').pop() + location.search;
  document.querySelectorAll('.lang-item').forEach(link => {
    const chinese = link.lang === 'zh-Hant';
    link.href = chinese ? page : '../en/' + page;
    link.classList.toggle('active', chinese);
    if (chinese) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const aria = {
    'ONCE DESIGN Home': 'ONCE DESIGN 首頁', 'Toggle navigation menu': '開啟導覽選單',
    'Close navigation menu': '關閉導覽選單', Navigation: '導覽選單', 'Language Selector': '選擇語言',
    'Footer navigation': '頁尾導覽', 'Country code': '國際電話區號',
    'Select a country code': '選擇國際電話區號', 'Search countries': '搜尋國家或地區', Countries: '國家或地區',
    'Choose floor plan, JPG or PDF': '選擇平面圖，JPG 或 PDF'
  };
  document.querySelectorAll('[aria-label]').forEach(element => {
    const translation = aria[element.getAttribute('aria-label')];
    if (translation) element.setAttribute('aria-label', translation);
  });
  document.querySelectorAll('.country-search input').forEach(input => { input.placeholder = '搜尋'; });
  if (!hasChineseContact) return;
  const mobile = matchMedia('(max-width: 750px)');
  const consultation = document.querySelector('.contact-consultation');
  const links = document.querySelector('.contact-layout .contact-links');
  const arrangeContact = () => {
    if (mobile.matches && consultation && links) consultation.before(links);
  };
  arrangeContact();
  mobile.addEventListener('change', arrangeContact);
  document.getElementById('consultationForm')?.addEventListener('submit', () => {
    document.querySelectorAll('.contact-error-text').forEach(error => {
      error.textContent = error.closest('.contact-field').querySelector('[name="email"]')
        ? '請輸入有效的電子信箱，例如 example@mysite.com。' : '請上傳平面圖。';
    });
  });
})();
