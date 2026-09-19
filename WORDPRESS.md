# ONCE DESIGN：用 HTML 區塊放入 WordPress

採用「每個頁面貼 HTML，共用 CSS／JavaScript 集中管理」的方式。不必將整個網站改成自訂佈景主題，仍可重用導覽、頁尾、表單與互動。

本文件是移植步驟。目前 `index.html`、`about.html` 和 assets 還是靜態網站版本，尚未轉換成可直接貼入的 WordPress 版本。

## 1. 整體放法

| 內容 | 放置位置 |
| --- | --- |
| 首頁內容 HTML | WordPress「首頁」的自訂 HTML 區塊 |
| About 內容 HTML | WordPress「About」的自訂 HTML 區塊 |
| CSS／JavaScript／字型／圖片／影片 | 子主題的 `assets/` 資料夾 |
| 共用 CSS／JS 載入設定 | 子主題的 `functions.php` |
| 導覽、頁尾、諮詢表單 | 共用 `common.js` 產生，頁面內只放掛載容器 |

以下採用「子主題載入素材」來說明。不修改父主題，避免更新父主題時覆蓋檔案。如果已有子主題，直接使用現有的即可。

若無法存取主機檔案，也可改用能集中載入 CSS／JS 的專用外掛；仍需要一個位置存放圖片、影片和字型。

## 2. 準備全寬或空白頁面

先在 WordPress 建立「首頁」和「About」，About 的固定網址代稱設為 `about`。

每個頁面需設定：

- 使用全寬或空白模板，名稱與是否提供取決於目前主題。
- 隱藏頁面預設標題、側欄。
- 讓內容容器沒有最大寬度限制，左右間距為 0。
- 使用 ONCE DESIGN 的導覽和頁尾時，隱藏目前主題的導覽和頁尾，避免重複。

若目前主題沒有空白模板，可在子主題建立一份只輸出頁面內容的模板：

```php
<?php
/* Template Name: ONCE HTML Canvas */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php while (have_posts()) : the_post(); ?>
    <?php the_content(); ?>
<?php endwhile; ?>
<?php wp_footer(); ?>
</body>
</html>
```

將檔案存為子主題根目錄的 `page-once-canvas.php`，再在兩個頁面的模板設定選擇 `ONCE HTML Canvas`。這份模板會使用你在後台貼入的內容，並保留 WordPress 的載入掛鉤。

## 3. 哪些 HTML 可以貼？

使用「自訂 HTML」區塊，不是顯示原始碼用的「程式碼」區塊。

從原始檔取出 body 裡的頁面內容，排除：

- `<!DOCTYPE html>`、`html`、`head`、`body` 標籤。
- 原本的 stylesheet、script 載入標籤。
- 已由 WordPress 或共用元件處理的重複區塊。

HTML 外層加上專案容器，以便限制樣式範圍與判斷目前頁面。

### About 頁面結構示意

```html
<div class="once-site about-page" data-page="about">
  <a class="skip-link" href="#once-main">Skip to content</a>
  <div data-site-header></div>

  <main id="once-main">
    <!-- 放入 about.html 的 Hero、Story、Studio、Founder 區塊 -->
    <div class="about-contact" data-site-contact></div>
  </main>

  <div data-site-footer></div>
</div>
```

### 首頁結構示意

```html
<div class="once-site" data-page="home">
  <div data-site-header></div>

  <!-- 放入 index.html 的背景照片、main 與各內容區塊 -->
  <!-- 保留原本 contact-stage 中的 data-site-contact 掛載容器 -->

  <div data-site-footer></div>
</div>
```

上面是結構示意，不是完整的頁面內容。建議每頁先用一個自訂 HTML 區塊放完整內容，避免區塊包裝破壞 sticky 區塊與背景的層級。

## 4. 上傳共用素材

將專案的 assets 資料夾放到子主題中：

```text
wp-content/themes/你的子主題/
├── style.css
├── functions.php
├── page-once-canvas.php          # 主題沒有空白模板時才需要
└── assets/
    ├── style.css
    ├── common.css
    ├── about.css
    ├── common.js
    ├── script.js
    ├── fonts/
    └── …                        # 圖片、SVG、影片
```

`assets/style.css` 是目前專案樣式，不能拿它覆蓋子主題根目錄的 `style.css`。

如果尚未建立子主題，先依目前父主題的子主題文件建立；不要直接在父主題內加入這些檔案。

## 5. 修改素材與連結路徑

頁面網址是 `/about/` 時，`assets/about-story.jpg` 會解析到錯誤位置。HTML 與 common.js 裡的素材網址要改成可公開存取的完整網址。

例如：

```html
<img
  src="https://你的網域/wp-content/themes/你的子主題/assets/about-story.jpg"
  alt="NEBU retail interior by Once Design Studio"
>
```

需要修改的項目包含：

- HTML 裡的圖片 `src`、影片 `src`／`poster`。
- `common.js` 內 Logo、contact 圖片和 SVG 的路徑。
- 首頁 hero preload 的 href。
- `about.html`、`index.html#work` 等網站內連結。

連結改為：

```html
<a href="/">HOME</a>
<a href="/about/">ABOUT</a>
<a href="/#work">WORK</a>
<a href="/#contact">CONTACT</a>
<a href="/#quote">QUOTE</a>
```

上例假設 WordPress 安裝在網域根目錄。若安裝在 `/website/` 等子目錄，請加上該前綴，或使用完整網址。

CSS 裡的 `url('fonts/…')`、`url('about-paper.avif')` 是相對於 CSS 檔案的位置解析。assets 結構維持原樣即可。

## 6. 調整目前 CSS／JS 以支援 HTML 區塊

這些調整需先完成，才能正常貼入 WordPress。

### CSS 範圍

目前有 `html`、`body`、`:root` 和全域 reset，直接載入可能影響 WordPress 主題的其他內容。

- 將專案變數移到 `.once-site`。
- 將字體、底色等 body 樣式改套在 `.once-site`。
- 將 reset 和一般元素樣式限制在 `.once-site` 內。
- `@font-face` 仍可維持頂層宣告。
- About 的 `.about-page` 改由外層容器承接。

### JavaScript 的頁面判斷

目前 `common.js` 使用：

```js
const isAbout = document.body.dataset.page === 'about';
```

移植後改為：

```js
const site = document.querySelector('.once-site');
const isAbout = site?.dataset.page === 'about';
```

導覽 active 狀態原本比對 `about.html`、`index.html#home`，也要配合新連結修改。

### 首頁載入遮罩與預載入

首頁有 `html.hero-loading`、解除遮罩備援程式及 `heroImagePreload`。不能將原本 head 內容直接貼進頁面。

建議移植版先讓 HTML 正常顯示，保留圖片預載入與入場動畫；若要保留整頁載入遮罩，需要在 WordPress 的 head 與專案容器另外實作，並保留失敗解除機制。

### 固定背景與 sticky

WordPress 的內容包裝可能帶有 `overflow`、`transform`、寬度限制，影響 fixed 背景和 sticky 區塊。需在前台檢查，使用上面的空白模板可減少這類包裝。

## 7. 統一載入 CSS／JavaScript

在子主題的 `functions.php` 加入載入設定，不要將 PHP 貼入自訂 HTML 區塊。

以下範例假設首頁是後台設定的靜態首頁，About 代稱為 `about`，assets 已完成上述調整：

```php
add_action('wp_enqueue_scripts', function () {
    if (!is_front_page() && !is_page('about')) {
        return;
    }

    $version = '1.0.0';
    $assets = trailingslashit(get_stylesheet_directory_uri()) . 'assets/';

    wp_enqueue_style('once-base', $assets . 'style.css', [], $version);
    wp_enqueue_style('once-common', $assets . 'common.css', ['once-base'], $version);

    if (is_page('about')) {
        wp_enqueue_style('once-about', $assets . 'about.css', ['once-common'], $version);
    }

    wp_enqueue_script('once-common', $assets . 'common.js', [], $version, true);

    if (is_front_page()) {
        wp_enqueue_script('once-gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', [], '3.12.5', true);
        wp_enqueue_script('once-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', ['once-gsap'], '3.12.5', true);
        wp_enqueue_script('once-home', $assets . 'script.js', ['once-common', 'once-scrolltrigger'], $version, true);
    }
});
```

如果 `functions.php` 已經有 `<?php` 開頭，直接加入以上程式，不要再多貼一個 PHP 開頭標籤。保留原本父主題／子主題的必要載入設定。

首頁原本也使用 Google Fonts；需要相同外觀時，再將原本 Google Fonts stylesheet 加入 enqueue。

每次更新 CSS／JS 後，提高 `$version`，並清除網站快取。`common.js` 要先於首頁 `script.js` 執行，且在頁面 HTML 出現後執行。

官方載入方式：[Including Assets](https://developer.wordpress.org/themes/core-concepts/including-assets/)。

## 8. 共用元件怎麼維護？

每個頁面只放三個掛載容器：

```html
<div data-site-header></div>
<div data-site-contact></div>
<div data-site-footer></div>
```

`common.js` 會插入共用內容，並初始化選單、表單等互動。修改一次共用檔案，首頁與 About 就會一起更新。

每頁的諮詢表單只放一次，避免重複 id。共用內容由 JavaScript 產生，停用 JavaScript 時不會出現；若需要由伺服器直接輸出，可後續改成短代碼，頁面內容仍留在編輯器中。

## 9. 後台操作順序

1. 準備子主題、空白模板和已修改的 assets，啟用子主題。
2. 編輯「首頁」，選擇空白模板，新增「自訂 HTML」區塊，貼入首頁內容。
3. 編輯「About」，同樣選擇空白模板，貼入 About 內容。
4. 發佈兩個頁面。
5. 設定 → 閱讀，首頁顯示選擇「靜態頁面」，指定剛建立的首頁。
6. 在網站前台開啟首頁及 `/about/` 檢查結果。

編輯器預覽不一定會執行前台載入的 JavaScript，互動請以實際前台頁面確認。

自訂 HTML 的標籤和 JavaScript 支援會受使用者權限與網站設定影響，因此此方案將 script 集中在子主題載入。官方說明：[Custom HTML](https://wordpress.org/documentation/article/custom-html/)。

## 10. 諮詢表單與驗收

目前 SUBMIT 會顯示 OPEN EMAIL，開啟寄往 `info@once-hk.com` 的草稿。檔案只顯示檔名，仍需使用者在 email 中手動附加。

貼入 WordPress 不會自動變成後端寄件表單。需要直接送出時，需接表單外掛或後端，並替換原本 email 草稿的 submit handler。

完成後檢查：

- 頁面全寬，沒有重複導覽、頁尾或頁面標題。
- 圖片、字型、影片正常載入，紙紋比例與位置正確。
- ABOUT、WORK、CONTACT、QUOTE 連到正確頁面或區塊。
- 選單、鍵盤操作、輪播、背景影片和捲動動畫正常。
- 手機沒有水平溢出，表單可以填寫與選檔。
- 登入後的 WordPress 管理工具列不會遮住固定按鈕；必要時補上 `.admin-bar` 的位置調整。
- 網站其他頁面不受專案 CSS 影響。

## 11. 後續新增頁面

新頁面各自貼入內容 HTML，沿用 `.once-site` 容器與共用掛載容器，再加入需要的頁面 CSS 和載入條件。

用這種方式可以直接在後台修改 HTML 文案，但不是可視化拖拉編輯。若希望客戶用欄位修改文案、換圖，之後再增加區塊或自訂欄位。

## 12. WORK 頁面

靜態版新增 `work.html`，沿用共用 header、footer、諮詢表單，使用 `assets/work.css` 和 `assets/work.js`。19 張作品圖片為 `work-1.jpg` 至 `work-19.jpg`，主視覺為 `work-hero.jpg` 和 `work-hero.mp4`。詳細作品目前連到原 Wix 頁面。

移植時建立代稱為 `work` 的頁面，body 內容放進 `.once-site.work-page` 容器並設定 `data-page="work"`。共用導覽的 `work.html` 改成 `/work/`，並以外層容器的 `data-page` 判斷 active 狀態。

第 7 節的載入條件需加入 `is_page('work')`，再於 WORK 頁載入：

```php
if (is_page('work')) {
    wp_enqueue_style('once-work', $assets . 'work.css', ['once-common'], $version);
    wp_enqueue_script('once-work', $assets . 'work.js', ['once-common'], $version, true);
}
```

將 WORK 的素材路徑改成子主題 assets 的完整網址。分類切換支援左右方向鍵、Home、End；停用 JavaScript 時顯示全部分類。

## 13. TRENDS 頁面

建立代稱為 `trends` 的 WordPress 頁面，將 `trends.html` 的 body 內容放進 `.once-site.trends-page` 容器，設定 `data-page="trends"`。共用導覽 `trends.html` 改成 `/trends/`，素材路徑改成子主題 assets 的完整網址。

第 7 節載入條件加入 `is_page('trends')`，並加入：

```php
if (is_page('trends')) {
    wp_enqueue_style('once-trends', $assets . 'trends.css', ['once-common'], $version);
    wp_enqueue_script('once-trends', $assets . 'trends.js', ['once-common'], $version, true);
}
```

圖片為 `trends-1.jpg` 至 `trends-11.jpg`，主視覺為 `trends-hero.jpg` 與 `trends-hero.mp4`。TRENDS／PRESS 支援方向鍵、Home、End；文章詳細頁目前連至原 Wix 網站。諮詢表單沿用共用 email 草稿流程。

## 14. QUOTE 頁面

建立代稱為 `quote` 的頁面，將 `quote.html` 的 body 內容放進 `.once-site.quote-page` 容器，設定 `data-page="quote"`。共用導覽 `quote.html` 改成 `/quote/`，並將素材路徑改成子主題 assets 的完整網址。

第 7 節載入條件加入 `is_page('quote')`，並加入：

```php
if (is_page('quote')) {
    wp_enqueue_style('once-quote', $assets . 'quote.css', ['once-common'], $version);
    wp_enqueue_script('once-quote', $assets . 'quote.js', ['once-common'], $version, true);
}
```

Quote 使用獨立報價表單，不需 `data-site-contact` 容器。素材包含 `quote-hero.jpg`、`quote-hero.mp4`、`quote-logo.png`、`quote-blueprint.jpg` 與三個服務圖示。必填專案類型、公司／商場／建築名稱、面積、姓名、電話；email 及樓層圖為選填。SUBMIT 顯示 OPEN EMAIL 草稿連結，所選附件需手動附加；若需直接送出，需接後端或表單外掛。
