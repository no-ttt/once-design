共用頁面元件

目標畫面復刻網址：https://liaovaco.wixstudio.com/oncedesign

## 桌面版保留基準

修改首頁手機版之前，先讀 [首頁桌面版保留紀錄](HOMEPAGE-DESKTOP.md)。其中記錄桌面欄寬、字型、SERVICES 手動換行、動畫設定與既有文件／程式差異；手機修改不得直接覆蓋這些桌面設定。

## 固定視覺與互動規範

- **SEE MORE 按鈕**：首頁 About、Portfolio、Services 使用同一套 Portfolio 規格：Gotham Book、直向分隔線、兩行 `SEE / MORE`、右側細長箭頭；文字、分隔線與箭頭的間距不可各區塊自行改寫。樣式集中在 `assets/css/style.css` 的 `.portfolio-action` 與首頁共用覆寫。
- **區塊標籤**：左上角黑底標籤統一使用 Aboreto、白字、固定高度與區塊寬度；新增區塊先沿用既有 badge 規則。
- **進場動畫**：需要翻入效果時使用原站的 80° arc、約 1.2 秒；需要文字揭示時使用 `clip-path: inset(0 100% 0 0)` 到 `inset(0 0% 0 0)`，並以 ScrollTrigger `scrub: true`，確保往回捲能反向收回。動畫完成時間要和下一個 sticky panel 的交接點對齊。
- **SERVICES**：每個 service panel 的文字、圖片、SEE MORE 必須共用同一個 ScrollTrigger 進度；不要為單一項目另設不同速度或觸發方式。手動換行使用 HTML `<br>`，若需要固定換行，先確認文字欄寬足夠。
- **HONORS 輪播**：依原站使用持續等速向左移動（40px／秒），不可改成定時逐張切換；循環銜接須保留當前位移。滑鼠停留、鍵盤聚焦與 reduced-motion 時暫停自動播放。
- **HONORS 獎項列表**：名稱與右側說明各自做 80° arc 翻入（1.2 秒，另以 0.84 秒淡入），說明延遲 0.2 秒；分隔線保持固定，不要對整列套用上移或翻轉。
- **FAQS**：使用 `position: relative` 一般捲動，不固定在視窗頂端；標題以 1.5 秒 arc 翻入、延遲 0.2 秒，問答列表整組以 1.2 秒 arc 翻入。展開／收合採 250ms ease-out 高度動畫，完成後刷新 ScrollTrigger 位置；答案採 IvyOra Regular 15px／1.3、字距 0.03em、#5b564c，第一與第三題含 18px Medium 引導文字及左側直線重點區。
- **修改前檢查**：先讀本文件、`assets/css/style.css` 及 `assets/js/script.js`，優先調整既有共用 selector，不要新增相似但重複的按鈕或動畫 class。

- `assets/js/common.js`：共用 header、導覽抽屜、footer、回頂部、選單焦點管理、背景影片、諮詢表單及進場效果。HTML 放置 `[data-site-header]`、`[data-site-footer]`、`[data-site-contact]`，並在頁面專屬 script 前載入此檔。
- `assets/css/style.css`：既有字型、基本樣式與首頁樣式；新頁面沿用其中的 header、drawer、footer 樣式。
- `assets/css/common.css`：共用 section-label、page-kicker、text-link、skip-link、目前頁面狀態及 reduced-motion 樣式，在 style.css 後載入。
- `assets/css/about.css`：只處理 About 頁面，所有樣式限制在 about 元件範圍。
- `assets/js/script.js`：首頁專屬 hero、輪播與捲動互動；About 不載入。

首頁手機版以 750px 為斷點，修正集中在 `style.css` 底部並限定 `body[data-page="home"]`。Hero、About、Portfolio 使用參考站的寬度比例；手機 Hero 使用 `mobile-banner.png`，以 66% 圖片透明度疊於 `#362e2c` 底色，停用黑色遮罩與影片；服務文字在手機取消桌面手動換行，改用原站 IvyOra 字型與 0.02em 字距，介紹文、Retail、一般服務及 ESG 分別按原站文字欄寬比例排版；勿統一段落 max-width，避免換行偏離。動畫於 panel 抵達 sticky 位置時完成。作品與服務圖片透過 `<picture>` 使用 `assets/images/home/mobile-*.jpg`（來源為 Wix 參考首頁的手機裁切），桌面仍使用原圖。手機 Contact 參考 oncechinese：置中小 Logo → 置中諮詢標題 → 六項聯絡資訊 → 表單；資訊列距 60px、表單上方留白 60px。script.js 在手機斷點移動諮詢標題，回到桌機時還原至右欄。保留英文文案，雙欄表單縮入螢幕內，避免原站右側裁切。

新增頁面時，在 body 設定 `data-page`，共用導覽目前支援首頁、About、Work、Trends 與 Quote 的 active 狀態。需進場效果的元素加上 `data-reveal`，未啟用 JavaScript 時內容仍會顯示。

About 已依 Wix About 頁面文案、圖片與影片製作，包含 Story、Studio、Founder 與共用諮詢區塊。表單沿用現有 email 草稿流程，未連接寄件後端。

手機 About／Founder 主標依參考版以 5.128205vw 縮放，About 的「design practice」保持同組；內文維持 13px。已於 320、390、430px 逐行核對。共用 Contact 的 CONTACT／FIND US 僅在手機隱藏，桌機原本有標籤的頁面繼續顯示。

About 手機版（750px 以下）依 `/oncedesign/blank` 校正：影片 object-position 為 63% 0%，不套用桌面亮度濾鏡；STORY 標籤初始即完整顯示。Story 主標寬 66.515vw；Studio 文字欄寬約 72.25vw；Founder 取消桌面手動斷行，文字色為 #362e2c。Story 與 Founder 的 `<picture>` 使用手機裁切圖，`source` 必須隱藏以免在 grid 產生空白列。手機 Story 揭示進度以進入視窗的位置計算，三個文字區塊的翻入動畫結束後不保留 3D transform，避免文字模糊。依使用者最新要求，About 手機諮詢區與首頁共用 Contact 樣式，包含 Logo、標題、六項聯絡資訊及完整表單，不再保留原站大幅留白與右側裁切。手機 Menu 為靠右 315px 半透明面板；觸控模式停用 hover 旋轉，關閉圖示保持 X。Wix 平台頂端的 30px 宣傳列不納入本機頁面。

Work 使用 `work.html`、`assets/css/work.css` 與 `assets/js/work.js`，五種類別包含 19 個作品。圖片位於 `assets/images/work/` 與 `assets/images/projects/`，影片位於 `assets/videos/`；作品詳情共用 `nebu.html` 與 `assets/data/nebu-projects.js`。分類使用可鍵盤操作的 tabs，停用 JavaScript 時顯示所有分類。共用 WORK 導覽連到 `work.html`；首頁全部 SEE MORE（About、Portfolio、Services）統一連到 `about.html`。

Trends 使用 `trends.html`、`assets/css/trends.css` 和 `assets/js/trends.js`，依 Wix 原版提供 TRENDS（9 張卡片）與 PRESS（2 張卡片）分類，支援鍵盤切換。圖片位於 `assets/images/trends/`，影片位於 `assets/videos/`；列表與子頁由 `assets/data/trends-articles.json` 統一提供資料，詳情使用 `trend.html?article=文章ID`。新增方式見 `TRENDS.md`。停用 JavaScript 時顯示兩類內容。

Quote 使用 `quote.html`、`assets/css/quote.css` 和 `assets/js/quote.js`，包括原版影片主視覺、Landlord Submission Services、三個服務圖示、聯絡資訊和獨立報價表單。共用 QUOTE 導覽連至 `quote.html`。表單支援專案類型、面積、聯絡資訊、選填樓層圖和多選得知管道；SUBMIT 產生 email 草稿連結，附件需手動加入 email，尚無寄件後端。

Work 手機版（750px 以下）依 `/oncedesign/blank-2`：主視覺高 98.205128vw、手機專用斜線紋理、25px 主標、分類採 flex 自然換行（水平間距固定 27px、列距 2px；390px 為 3+2，430px 為 4+1），作品固定單欄，左右邊界 12.05%，作品名稱 20px。保留既有 Logo 與桌機樣式；Contact 與 About 共用手機樣式，work.js 在手機將諮詢標題移至 Logo 下方，回桌機還原。

NEBU 手機版對照 `/oncedesign/blank-1`，保留作品內容；NEBU 手機相簿依使用者確認改成單欄，照片按 1–8 順序排列，回桌機還原雙欄。Banner 圖片及遮罩在手機停用下移，完整填滿頂部。依最新要求移除相簿下方的固定長留白，手機設計區由內容撐高，圖集下方留 32px 再接作品導覽；mobile-gallery-* 使用原站手機裁切，桌機與燈箱仍用原圖。主標 6.410256vw、引言 5.128205vw，主視覺最小高度 452.72px。Logo 尺寸、位置與圖檔沿用 Work；表單使用既有 data-page="work" 共用樣式，nebu.js 於手機移動諮詢標題，切換專案與回到桌機時均保持正確排列。所有新增版面規則限 750px 以下。

Trends 手機版依 `/oncedesign/blank-2-1` 的 iPhone 顯示校正：Banner 主標 6.410256vw，文章主標 3.333333vw、欄寬 64.871795vw；卡片維持單欄、直角圖片，Tab 使用文字自然寬度加 flex 分配及固定 27px 間距。手機 Logo／Contact 使用 Work 共用樣式與排列，桌機規則不變。保留現有 37 篇文章及日期排序，因此列表內容與 Wix 示範卡片不同。若 JSON 沒有 PRESS 分類，保留 HTML 既有兩張作品卡片，連到 nebu.html 對應 project，避免載入後清空或導向不存在的文章。

Work 主頁手機卡片校正（2026-10-03）：Banner 左下文字依原站為 2.051282vw；作品名稱 5.128205vw，標題使用整個 caption 寬度，箭頭絕對定位於右側，不再壓縮標題。箭頭使用 mobile-card-arrow.png 原站圖，寬 4.615385vw；卡片列距 12.820513vw，圖片寬 75.553846vw。僅修改 750px 以下，保留桌機、Logo 與表單。

作品詳情手機字體（2026-10-03）：所有 19 頁的署名使用 Aboreto，by 單獨套用原站 Caudex WOFF2（project-caudex-mobile.woff2）；一般署名 2.564103vw，Klasse14 Banner 為 3.076923vw。設計說明統一 IvyOra Story 13px／1.3、0.02em 字距，小標 IvyOra Wix Bold 13px／1，標題下 4px、文章間 10px、連續段落及清單項目間 1.3em。簡介預設 13px，Klasse14 與 Murad Counter 保留 12px；NEBU 文字欄寬按原站還原。以上僅套用 750px 以下，Logo、表單、單欄相簿和桌機維持既有版本。
