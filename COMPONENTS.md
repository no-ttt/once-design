共用頁面元件

目標畫面復刻網址：https://liaovaco.wixstudio.com/oncedesign

## 固定視覺與互動規範

- **SEE MORE 按鈕**：首頁 About、Portfolio、Services 使用同一套 Portfolio 規格：Gotham Book、直向分隔線、兩行 `SEE / MORE`、右側細長箭頭；文字、分隔線與箭頭的間距不可各區塊自行改寫。樣式集中在 `assets/style.css` 的 `.portfolio-action` 與首頁共用覆寫。
- **區塊標籤**：左上角黑底標籤統一使用 Aboreto、白字、固定高度與區塊寬度；新增區塊先沿用既有 badge 規則。
- **進場動畫**：需要翻入效果時使用原站的 80° arc、約 1.2 秒；需要文字揭示時使用 `clip-path: inset(0 100% 0 0)` 到 `inset(0 0% 0 0)`，並以 ScrollTrigger `scrub: true`，確保往回捲能反向收回。動畫完成時間要和下一個 sticky panel 的交接點對齊。
- **SERVICES**：每個 service panel 的文字、圖片、SEE MORE 必須共用同一個 ScrollTrigger 進度；不要為單一項目另設不同速度或觸發方式。手動換行使用 HTML `<br>`，若需要固定換行，先確認文字欄寬足夠。
- **HONORS 輪播**：依原站使用持續等速向左移動（40px／秒），不可改成定時逐張切換；循環銜接須保留當前位移。滑鼠停留、鍵盤聚焦與 reduced-motion 時暫停自動播放。
- **HONORS 獎項列表**：名稱與右側說明各自做 80° arc 翻入（1.2 秒，另以 0.84 秒淡入），說明延遲 0.2 秒；分隔線保持固定，不要對整列套用上移或翻轉。
- **FAQS**：使用 `position: relative` 一般捲動，不固定在視窗頂端；標題以 1.5 秒 arc 翻入、延遲 0.2 秒，問答列表整組以 1.2 秒 arc 翻入。展開／收合採 250ms ease-out 高度動畫，完成後刷新 ScrollTrigger 位置；答案採 IvyOra Regular 15px／1.3、字距 0.03em、#5b564c，第一與第三題含 18px Medium 引導文字及左側直線重點區。
- **修改前檢查**：先讀本文件、`assets/style.css` 及 `assets/script.js`，優先調整既有共用 selector，不要新增相似但重複的按鈕或動畫 class。

- `assets/common.js`：共用 header、導覽抽屜、footer、回頂部、選單焦點管理、背景影片、諮詢表單及進場效果。HTML 放置 `[data-site-header]`、`[data-site-footer]`、`[data-site-contact]`，並在頁面專屬 script 前載入此檔。
- `assets/style.css`：既有字型、基本樣式與首頁樣式；新頁面沿用其中的 header、drawer、footer 樣式。
- `assets/common.css`：共用 section-label、page-kicker、text-link、skip-link、目前頁面狀態及 reduced-motion 樣式，在 style.css 後載入。
- `assets/about.css`：只處理 About 頁面，所有樣式限制在 about 元件範圍。
- `assets/script.js`：首頁專屬 hero、輪播與捲動互動；About 不載入。

新增頁面時，在 body 設定 `data-page`，共用導覽目前支援首頁、About、Work、Trends 與 Quote 的 active 狀態。需進場效果的元素加上 `data-reveal`，未啟用 JavaScript 時內容仍會顯示。

About 已依 Wix About 頁面文案、圖片與影片製作，包含 Story、Studio、Founder 與共用諮詢區塊。表單沿用現有 email 草稿流程，未連接寄件後端。

Work 使用 `work.html`、`assets/work.css` 與 `assets/work.js`，五種類別包含 19 個作品。圖片及 Hero 影片存在 assets，詳細頁連至原 Wix 專案頁。分類使用可鍵盤操作的 tabs，停用 JavaScript 時顯示所有分類。共用 WORK 導覽及首頁作品區 SEE MORE 連到 `work.html`。

Trends 使用 `trends.html`、`assets/trends.css` 和 `assets/trends.js`，依 Wix 原版提供 TRENDS（9 張卡片）與 PRESS（2 張卡片）分類，支援鍵盤切換。圖片及抽象主視覺影片存在 assets；文章連至原 Wix 詳細頁。移除原版未完成的 Add a Title 佔位文字，Start Now 接到對應詳細頁。停用 JavaScript 時顯示兩類內容。

Quote 使用 `quote.html`、`assets/quote.css` 和 `assets/quote.js`，包括原版影片主視覺、Landlord Submission Services、三個服務圖示、聯絡資訊和獨立報價表單。共用 QUOTE 導覽連至 `quote.html`。表單支援專案類型、面積、聯絡資訊、選填樓層圖和多選得知管道；SUBMIT 產生 email 草稿連結，附件需手動加入 email，尚無寄件後端。
