# Once Design

靜態網站，HTML 保留在根目錄，直接使用原本的頁面網址。用 VS Code Live Server 或 `python3 -m http.server 8000` 預覽，再開啟 `http://localhost:8000`。Trends 透過 fetch 讀取 JSON，請勿直接用 file:// 開啟。

## 目錄

```text
├── *.html                       頁面入口，原網址不變
├── assets/
│   ├── css/                     共用及各頁樣式
│   ├── js/                      共用及各頁互動程式
│   ├── data/
│   │   ├── nebu-projects.js      Work 作品資料（window.nebuProjects）
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

- 首頁排版：先讀 [桌面版保留紀錄](HOMEPAGE-DESKTOP.md)，手機樣式修改須保留既有桌面排版。

- 新增文章：編輯 `assets/data/trends-articles.json`，詳見 [TRENDS.md](TRENDS.md)。
- 修改作品：編輯 `assets/data/nebu-projects.js`。它是 JavaScript 資料檔，保留 `window.nebuProjects =`。
- 新增圖片：放進對應頁面或 `assets/images/projects/專案名稱/`，檔名使用英文小寫及連字號。
- HTML、JS、JSON 裡的素材路徑以頁面根目錄為基準，例如 `assets/images/trends/new-story.jpg`。
- CSS 的 `url()` 以 CSS 所在目錄為基準，例如 `../images/shared/logo.png`、`../fonts/gotham-quote.woff2`。
- 搬動或新增素材後執行 `python3 scripts/check-assets.py`，再用瀏覽器檢查頁面與互動。

本次整理保留全部原始圖片與影片，包含目前未引用的素材，沒有刪除或重新壓縮圖片。作品與文章共用同一份專案圖片，避免重複存放。
