# 首頁桌面版保留紀錄

記錄日期：2026-09-30。記錄來源為目前工作目錄的 `index.html`、`assets/css/style.css`、`assets/js/script.js`、`assets/js/common.js`，不是重新推測參考站的設定。

本次手機調整開始前的 Git 基準為 `ccc0698`。目前工作目錄另有尚未提交的手機修改；這份文件是維護紀錄，不是完整程式備份。可用 `git show ccc0698:assets/css/style.css` 等唯讀指令查閱先前版本，不要直接覆蓋目前檔案。

## 後續修改原則

- 使用者要求保留先前完成的桌面排版。只改手機時，規則限制在 `@media (max-width: 750px)`，首頁 selector 加上 `body[data-page="home"]`。
- 需要改桌面時，使用 `@media (min-width: 751px)`，另確認既有 751–1100px 的 SERVICES 平板規則，以及 900px 的其他響應式覆寫。
- 不因手機需要而直接修改共用字型、字級、字距、欄寬、圖片來源、HTML 無條件 `<br>` 或 GSAP 桌面觸發位置。
- `style.css` 也供其他頁面使用。讀取完整 cascade 與 `common.css` 後再修改，不只看第一個同名 selector。
- 換行取決於字型檔、字重、字級、字距、欄寬與手動斷行；應一起保留，不以全站統一寬度處理。

## 現有桌面設定

| 區塊 | 需保留的設定 | 定位方式 |
| --- | --- | --- |
| Banner | 背景影片 `homepage-banner.mp4`、原 poster、20% 黑色遮罩、點陣貼圖；四行標題結構與 Didot 斜體 | `.bg-photo`、`.vignette-overlay`、`.banner-line`、`.italic-script` |
| About | 四個 `.quote-reveal-line` 分行；逐行擦拭揭示；SEE MORE 對齊及間距 | `#about`、`.about-quote`、`.about-action` |
| Portfolio | 桌面圖片 `section-2-pic1` 至 `pic5`；360px 卡片與 30px 左右內距；標題、副標、底部獎項分區 | `.portfolio-card`、`.card-title`、`.awards-list` |
| Portfolio 字型 | 桌面品牌使用 `Ivy Ora Display Bold`；地點用 `Didot-W01-Italic`；說明用 IvyOra Medium，原字距 0.05em | `.brand-name`、`.location-name`、`.awards-list li` |
| Services 介紹 | 桌面靠右欄，`max-width: 28.615vw`；內文 `white-space: pre`，保留 HTML 手動換行 | `.services-intro-copy`、`.services-description` |
| Services panels | 左文右圖，欄寬 43% / 45.06%；sticky top 35vh；原圖比例 1 / 0.63647 | `.service-panel`、`.service-panel-inner`、`.service-image` |
| Services 動畫 | desktop ScrollTrigger 從 `top 95%` 到 `top 55%`；沿用文字 clip-path 與圖片淡入 | `script.js` 的 service-panel timeline |
| 共用按鈕、標籤及動畫 | 保留已設定的 SEE MORE、Aboreto 標籤、arc 與輪播節奏 | `COMPONENTS.md` 的固定視覺與互動規範 |
| Honors / FAQ / Partners / Contact / Footer | 保留既有桌面欄位、字型、間距、動畫與共用模板 | 對應 section selector、`common.js` |

以上數值描述目前一般桌面規則；實際顯示仍受斷點與後段覆寫影響。

## Services 桌面手動換行

以下逐行抄錄目前 HTML 中的斷行位置，不代表任何寬度下都能禁止額外自然換行。桌面標記為 `<br class="services-tablet-break">`，手機用 `display: none !important` 隱藏；移動標記時保留字詞間空格。ESG 引導文字後另外有一個兩種版面共用的 `<br>`。

### 介紹文

```text
we provide end-to-end spatial solutions driven by commercial
intelligence. we believe that the design process must be built
upon rigorous research, such as brand identity, traffic flow and
product positioning analysis.
```

### Retail & Shopping space

```text
Translating brand DNA into immersive, high-performance
physical environments that captivate audiences.
```

### Fine Dining & Hospitality

```text
Crafting bespoke gastronomic environments that
seamlessly blend atmospheric aesthetics with operational
efficiency, elevating the overall culinary journey.
```

### Corporate Workspaces

```text
Designing intelligent, sophisticated offices that foster
productivity, collaboration, and company culture.
```

### Comprehensive Project Management

```text
Overseeing the entire lifecycle of a project—from
concept to final execution—ensuring quality, timeline,
and budget are strictly honored.
```

### Sustainable Design & ESG Certification

```text
Environmental - Social - Governance
Partnering with ESG consultancies, we integrate environmentally
responsible practices into the built environment. we expertly
guide clients through rigorous ESG compliance and green
building certifications, ensuring every project is not only
aesthetically profound but also future-proof.
```

## 手機已分開處理的項目

- Banner：手機靜態圖、66% 圖片透明度與深棕底；桌面影片與遮罩保留。
- Portfolio：手機 `<picture><source media="(max-width: 750px)">` 裁切；原 `<img>` 作為桌面來源。KLASSE 14 單行、手機品牌字型與 AMORE 說明欄寬均限制在手機 media query。
- Services：手機隱藏桌面換行標記，使用不同段落欄寬及 0.02em 字距；介紹文與五項服務在 320、390、430px 已逐行比對參考站。
- AMORE 說明在 320、390、430px 已逐行比對；不代表其餘所有首頁文字都已核對。

## 驗證與已知差異

本次手機調整過程曾比對修改前後 1440px 桌面的主要區塊、service image 與 description 元素尺寸，結果一致；這不是整頁像素、所有文字斷行或所有桌面寬度的一致性保證。

後續手機變更應檢查 320、390、430px；桌面以 1440px 相同視窗高度、字型載入完成及相同捲動位置做修改前後比對，涉及平板時另檢查 900 / 1100px。檢查文字行、卡片高度、圖片構圖與動畫，不只檢查是否水平溢出。

既有文件與程式有兩處差異，先記錄、不在這次文件工作中改動：

- `COMPONENTS.md` 原規範說 FAQ 一般捲動，但目前桌面 `.inquiries-section` 仍是 sticky，只有手機覆寫 relative。
- 原規範說 SERVICES 文字、圖片、SEE MORE 同步；目前程式的 SEE MORE clip-path tween 僅在手機建立，桌面保留原行為。
