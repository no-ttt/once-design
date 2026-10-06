# Once Design

靜態網站，英文 HTML 放在 `en/`，中文版放在 `zh/`。用 VS Code Live Server 或 `python3 -m http.server 8000` 預覽，再開啟 `http://localhost:8000/en/` 或 `http://localhost:8000/zh/`。Trends 透過 fetch 讀取 JSON，請勿直接用 file:// 開啟。

## 語言版本

- `en/`：英文版，每個頁面可獨立編輯。
- `zh/`：繁體中文版。首頁、關於、作品及動勢頁的中文標題、服務、問答、共用選單與聯絡表單依 Wix 中文參考站更新；原站保留的英文標題仍保留。作品／文章內文與詢價頁主要內容仍使用既有英文資料。
- `assets/`：兩版共用素材、基礎樣式、互動程式及資料。中文版專用排版可寫在 `assets/css/zh.css`，僅由 `zh/` 載入。
- 作品與文章內容仍共用 `assets/data/projects.js`、`assets/data/trends-articles.json`，頁首、選單與聯絡區文字由 `assets/js/common.js` 依 HTML 的 `lang` 屬性產生；作品與文章內文若要翻譯，需另建中文資料或加入語言判斷，避免影響英文版。
- 站內相對連結會留在目前語言資料夾，例如英文作品為 `/en/project.html?project=tatcha`，中文作品為 `/zh/project.html?project=tatcha`。部署時一起上傳 `en/`、`zh/`、`assets/`；根目錄不設轉址入口。

## 頁面入口與命名

下表檔名在 `en/` 與 `zh/` 各有一份；維護時先選擇語言資料夾。

| 檔案 | 用途 | 網址範例 |
| --- | --- | --- |
| `index.html` | 首頁 | `index.html` |
| `about.html` | 工作室介紹 | `about.html` |
| `work.html` | Work 作品列表與分類 | `work.html` |
| `project.html` | 全部 Work 作品共用的內頁，依 `project` 參數載入資料 | `project.html?project=tatcha` |
| `trends.html` | Trends / Press 文章列表與分類 | `trends.html` |
| `article.html` | 單篇文章共用的內頁，依 `article` 參數載入資料 | `article.html?article=moorgen` |
| `quote.html` | 服務說明與詢價頁 | `quote.html` |

`trends.html` 是文章列表，`article.html` 是單篇文章內頁。列表卡片連到 `article.html?article=文章ID`，新增文章不需要另建 HTML。

共用檔案依用途命名：作品內頁使用 `project.html`、`project.css`、`project-mobile.css`、`project.js`，作品資料使用 `projects.js`；文章內頁使用 `article.html`、`article.css`、`article.js`。`trends-content.js` 負責列表與內頁共用的文章資料呈現。

作品與文章統一使用上述入口，不保留舊頁面或轉址。Moorgen 文章使用 `article.html?article=moorgen`。CSS 類別與素材資料夾中的 `nebu`、`moorgen` 名稱保留，以維持既有樣式與作品素材對應。

## 目錄

```text
├── en/*.html                    英文頁面（7 頁）
├── zh/*.html                    中文版頁面（7 頁）
├── assets/
│   ├── css/                     共用及各頁樣式
│   ├── js/                      共用及各頁互動程式
│   ├── data/
│   │   ├── projects.js           Work 作品資料（window.projects）
│   │   ├── project-mobile-emphasis.js  作品手機版文字強調設定
│   │   └── trends-articles.json  Trends / Press 文章資料
│   ├── images/
│   │   ├── shared/              共用 Logo、社群圖示、箭頭及紋理
│   │   ├── home/                首頁、服務、合作品牌及獎項圖片
│   │   ├── about/               About 圖片
│   │   ├── work/                Work 列表縮圖與主視覺
│   │   ├── trends/              Trends 列表縮圖與主視覺
│   │   │   └── moorgen/         Moorgen 文章圖片
│   │   ├── projects/            依專案名稱分資料夾，Work / Trends 共用
│   │   ├── quote/               Quote 圖片
│   │   └── flags/               電話國碼旗幟
│   ├── videos/                  各頁背景影片
│   └── fonts/                   字型與原始字型資料
├── scripts/check-assets.py      檢查本機素材引用路徑
├── TRENDS.md                    新增文章教學與 JSON 範例
├── COMPONENTS.md                共用元件與視覺規範
└── WORDPRESS.md                 WordPress 搬移說明
```

## 維護方式

### 要修改哪個檔案

| 修改項目 | 主要檔案 |
| --- | --- |
| 共用頁首、選單、聯絡區與頁尾 | `assets/js/common.js`、`assets/css/common.css` |
| 首頁排版與動畫 | `index.html`、`assets/css/style.css`、`assets/js/script.js` |
| About 頁面 | `about.html`、`assets/css/about.css`、`assets/js/about.js` |
| Work 列表 banner、作品卡片與分類 | `work.html`、`assets/css/work.css`、`assets/js/work.js` |
| Work 作品內頁文字與圖片資料 | `assets/data/projects.js` |
| Work 作品內頁 banner、內容排版與互動 | `project.html`、`assets/css/project.css`、`assets/css/project-mobile.css`、`assets/js/project.js` |
| Trends 列表 banner、卡片樣式與分類互動 | `trends.html`、`assets/css/trends.css`、`assets/js/trends.js` |
| Trends / Press 文章標題、日期、縮圖與內文 | `assets/data/trends-articles.json` |
| 單篇文章版型與樣式 | `article.html`、`assets/js/trends-content.js`、`assets/css/article.css`、`assets/js/article.js` |
| 詢價頁 | `quote.html`、`assets/css/quote.css`、`assets/js/quote.js` |
| iPad／平板專用排版 | `assets/css/tablet.css` |

`trends-content.js` 同時負責把 JSON 資料呈現在文章列表與文章內頁。修改文章內容時，優先編輯 JSON；列表 HTML 中的預設卡片可能會被載入的資料替換。Work 列表卡片則寫在 `work.html`，新增作品時需一併維護列表及作品資料。

### 排版與素材注意事項

- 首頁排版：先讀 [桌面版保留紀錄](HOMEPAGE-DESKTOP.md)，手機樣式修改須保留既有桌面排版。

- iPad／平板排版：編輯 `assets/css/tablet.css`，由所有 HTML 最後載入。僅於 751–1400px 且具觸控輸入（`any-pointer: coarse`）時生效；750px 以下保留手機版，純滑鼠桌機不套用。瀏覽器模擬時需啟用觸控，單純縮小桌機視窗不會啟用。

- 新增文章：編輯 `assets/data/trends-articles.json`，詳見 [TRENDS.md](TRENDS.md)。
- 修改作品：編輯 `assets/data/projects.js`。它是 JavaScript 資料檔，保留 `window.projects =`。
- 新增圖片：放進對應頁面或 `assets/images/projects/專案名稱/`，檔名使用英文小寫及連字號。
- HTML、JS、JSON 裡供瀏覽器載入的素材路徑以目前 HTML 所在的語言資料夾為基準，例如 `../assets/images/trends/new-story.jpg`。
- CSS 的 `url()` 以 CSS 所在目錄為基準，例如 `../images/shared/logo.png`、`../fonts/gotham-quote.woff2`。
- 搬動或新增素材後執行 `python3 scripts/check-assets.py`，再用瀏覽器檢查頁面與互動。

本次整理保留全部原始圖片與影片，包含目前未引用的素材，沒有刪除或重新壓縮圖片。作品與文章共用同一份專案圖片，避免重複存放。

### 中文版參考與字型

- 參考站：https://liaovaco.wixstudio.com/oncechinese（首頁）、`/blank`（關於）、`/blank-2`（作品）、`/blank-2-1`（動勢）。
- 中文專用字體 Mgen Light / Regular / Bold 存放在 `assets/fonts/mgen-*.woff2`，僅由 `zh.css` 載入。
- 中文排版與斷點覆寫集中在 `assets/css/zh.css`；中英切換保留目前頁面、查詢參數與錨點。
