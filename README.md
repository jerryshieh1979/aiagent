作業 3：建立迷你知識庫
任務描述：
使⽤課程教的向量資料庫，建⽴⼀個⼩型知識庫並測試搜尋功能。
主題選項（三選⼀）：
1. 程式語⾔介紹（JavaScript、Python、Ruby 等 5 種語⾔的簡介）
2. 台灣城市介紹（台北、台中、⾼雄等 5 個城市的特⾊）
3. 咖啡飲品介紹（美式、拿鐵、卡布奇諾等 5 種咖啡的說明）
步驟指引：
1. 參考課程的 Embeddings 和向量資料庫程式碼
2. 建⽴知識庫初始化程式，準備 5 筆知識內容
3. 執⾏程式將知識加⼊向量資料庫
4. 建⽴搜尋測試程式
5. ⽤ 3 種不同問法搜尋，驗證結果相關性
繳交內容：
Embeddings 相關程式
向量資料庫操作程式
知識庫初始化程式
搜尋測試程式
驗收標準：
知識庫包含 5 筆以上資料
執⾏搜尋測試程式能搜尋到相關結果

 qdrant 備用機制，使用本機儲存體


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
