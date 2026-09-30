# 新增 Trends / Press 文章

所有內容放在 `assets/data/trends-articles.json`，列表與子頁會自動讀取。新增文章不用複製 HTML，也不用修改 JavaScript。請用本機網站伺服器（例如 VS Code Live Server）預覽；JSON 需要透過 HTTP 載入。

在最外層陣列新增物件（與上一筆之間記得加逗號）：

```json
{
  "id": "new-story",
  "category": "trends",
  "title": "New Design Story",
  "thumbnail": "assets/images/trends/new-story-cover.jpg",
  "date": "2026-09-28",
  "author": "ONCE DESIGN",
  "readTime": "3 MIN READ",
  "hero": "assets/images/trends/new-story-cover.jpg",
  "description": "文章搜尋摘要",
  "blocks": [
    {
      "type": "text",
      "heading": "Section heading",
      "paragraphs": ["第一段文字", "第二段文字"]
    },
    {
      "type": "image",
      "src": "assets/images/trends/new-story-01.jpg",
      "alt": "圖片說明",
      "width": 1728,
      "height": 972
    }
  ]
}
```

- `id` 必須唯一，使用英文小寫與連字號；網址為 `trend.html?article=new-story`，可以直接分享、重新整理。
- `category` 使用 `trends` 或 `press`，決定列表分頁。
- 列表依 `date` 由新到舊排列，沒有日期的文章放最後；同日期維持 JSON 順序。文章內的前後篇順序依 JSON 排列。
- `date`、`readTime` 可留空；`label` 可顯示沒有日期時的卡片副標。
- `blocks` 可自由增減或交錯排列文字／圖片。段落可包含 `<a href="https://...">文字</a>` 與 `<br>`。
- 圖片區塊可加上 `caption`，圖說會置中顯示於圖片下方，不需另建文字區塊。
- 圖片預設不超過原始寬度，避免小圖和直式流程圖被放大。可加上 `displayWidth`（例如 `500`，單位為 px）調整顯示寬度上限；手機版會自動縮至版面內。`width` / `height` 仍填原始尺寸。
- 圖片先放進 `assets/images/trends/`（或共用的 `assets/images/projects/專案名稱/`），再填入相對路徑。
- Moorgen 的 `titleImage` 是參考頁原本的整張標題圖。新文章不需要此欄，會自動排版標題；若修改 Moorgen 標題／日期，也請移除 `titleImage`，避免圖片文字仍是舊內容。
- Moorgen 的 `layout`、`variant`、`reference` 保留參考頁精確間距。新增段落不必設定，版面會依內容長度自動延伸。

既有 `moorgen.html` 網址仍可使用，共用相同 JSON 與版型。Work 的資料檔維持獨立。

- 若原文在首圖之前有引言，可設定 `heroInBlocks: true`，並把首圖依原文位置放入 `blocks`；`hero` 與 `thumbnail` 仍保留本機圖片路徑。

- 自動排版文章沿用 Moorgen 的間距比例：桌面圖片交界約 3.98329vw、標題接內文 1.5625vw；手機圖片之間 5vw、圖片與文字交界約 5vw + 20px、標題接內文約 19px。引言／標題接條列維持 20px，Photo Credit 維持統一署名样式。Moorgen 固定 `layout` 不受影響。

- `readTime` 以英文正文（含小標題與圖說，排除 HTML 標籤）每分鐘 200 字估算，向上取整，至少 1 分鐘；格式為 `3 MIN READ`。不含觀看影片的時間。
