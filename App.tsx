import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';
import { Message, QdrantConfig } from './types';
import { DEFAULT_QDRANT_URL, DEFAULT_API_KEY, DEFAULT_COLLECTION_NAME, DEFAULT_MODE, TAIWAN_CITIES } from './constants';
import { getEmbedding, generateAnswer } from './services/geminiService';
import { createCollection, upsertPoints, searchPoints, checkCollectionExists, checkConnection } from './services/qdrantService';

export default function App() {
  const [qdrantConfig, setQdrantConfig] = useState<QdrantConfig>({
    mode: DEFAULT_MODE as 'local' | 'cloud',
    url: DEFAULT_QDRANT_URL,
    apiKey: DEFAULT_API_KEY,
    collectionName: DEFAULT_COLLECTION_NAME
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: '歡迎來到台灣城市嚮導！\n\n系統已預設為「本機模式」，向量資料將直接儲存在您的瀏覽器中，無須擔心連線問題。\n\n請點擊右側的「建立向量索引」來初始化資料庫。',
      timestamp: Date.now()
    }
  ]);
  
  const [isIndexing, setIsIndexing] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [indexProgress, setIndexProgress] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const checkStatus = async () => {
      // Don't check if config is clearly invalid in cloud mode
      if (qdrantConfig.mode === 'cloud' && !qdrantConfig.url) return;
      
      try {
        const exists = await checkCollectionExists(qdrantConfig);
        setIsIndexed(exists);
        // Only clear error if it was a "not found" type error previously, don't clear manual test results immediately unless successful
        if (exists) setConnectionError(null);
      } catch (err: any) {
        setIsIndexed(false);
        console.warn("Auto-check status failed:", err);
      }
  };

  // Check Qdrant status on mount/config change
  useEffect(() => {
    checkStatus();
  }, [qdrantConfig]);

  const handleTestConnection = async () => {
    setConnectionError(null);
    setIndexProgress('測試連線中...');
    try {
      const resultMsg = await checkConnection(qdrantConfig);
      setIndexProgress(resultMsg);
      alert(resultMsg);
    } catch (e: any) {
      setConnectionError(e.message);
      setIndexProgress('');
      alert(`測試失敗: ${e.message}`);
    }
  };

  const handleIndexData = async () => {
    // Validation for cloud mode
    if (qdrantConfig.mode === 'cloud' && !qdrantConfig.apiKey && qdrantConfig.url.includes('cloud.qdrant.io')) {
      alert("使用 Qdrant Cloud 必須提供 API Key。");
      return;
    }

    setIsIndexing(true);
    setIndexProgress('開始初始化...');
    setConnectionError(null);

    try {
      // 1. Create Collection (or clean simulated DB)
      setIndexProgress(`正在重置資料庫: ${qdrantConfig.collectionName}...`);
      await createCollection(qdrantConfig);
      
      // 2. Generate Embeddings & Prepare Points
      const points = [];
      const total = TAIWAN_CITIES.length;
      
      for (let i = 0; i < total; i++) {
        const city = TAIWAN_CITIES[i];
        setIndexProgress(`正在產生向量 (${i + 1}/${total}): ${city.name}...`);
        
        // Create a rich text representation for embedding
        const textToEmbed = `${city.name}\n${city.description}\n特色: ${city.highlights.join(', ')}`;
        
        const vector = await getEmbedding(textToEmbed);
        
        points.push({
          id: city.id,
          vector: vector,
          payload: {
            name: city.name,
            description: city.description,
            highlights: city.highlights,
            full_text: textToEmbed // Store full text for context retrieval
          }
        });
        
        // Add a small delay to avoid hitting Gemini rate limits
        await new Promise(r => setTimeout(r, 200)); 
      }

      // 3. Upload to Qdrant (or simulate upsert)
      setIndexProgress('正在儲存向量資料...');
      await upsertPoints(qdrantConfig, points);
      
      setIsIndexed(true);
      setIndexProgress('完成！資料庫已就緒。');
      setConnectionError(null);
      
      // Add system message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: '資料索引完成！現在您可以開始詢問關於台灣城市的問題。',
        timestamp: Date.now()
      }]);

    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || 'Unknown Error';
      setIndexProgress(`錯誤中止`);
      setConnectionError(errMsg);
      alert(`索引失敗: ${errMsg}`);
    } finally {
      setIsIndexing(false);
      // Clear success message after 5s
      if (!connectionError) {
         setTimeout(() => setIndexProgress(''), 5000);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      if (!isIndexed) {
        throw new Error("請先建立索引 (Build Index) 才能進行搜尋。");
      }

      // 1. Get embedding for query
      const queryVector = await getEmbedding(text);

      // 2. Search Qdrant
      const searchResults = await searchPoints(qdrantConfig, queryVector, 3);
      
      // Extract context and source names
      const contextChunks = searchResults.map((res: any) => res.payload.full_text);
      const sources = searchResults.map((res: any) => res.payload.name);

      console.log("Search Results:", searchResults);

      // 3. Generate Answer with RAG + History
      // We pass 'messages' here which represents the history BEFORE the current new message.
      // The generateAnswer function will combine this history with the new 'text' (query).
      const answer = await generateAnswer(text, messages, contextChunks);

      // Add model response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: answer,
        timestamp: Date.now(),
        sources: sources
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `發生錯誤: ${error.message}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4 md:px-8">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 h-[90vh]">
        
        {/* Main Chat Area */}
        <div className="flex-1 h-full order-2 md:order-1">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isThinking}
          />
        </div>

        {/* Sidebar / Settings Area */}
        <div className="w-full md:w-80 flex flex-col gap-4 order-1 md:order-2">
           <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-xl shadow-lg">
              <h1 className="text-xl font-bold mb-2">Taiwan City Guide</h1>
              <p className="text-gray-400 text-sm">
                基於 Gemini Embeddings 與 向量搜尋 (RAG) 的問答系統。
              </p>
           </div>
           
           <SettingsPanel 
             config={qdrantConfig}
             onSaveConfig={setQdrantConfig}
             isIndexing={isIndexing}
             onIndexData={handleIndexData}
             isIndexed={isIndexed}
             indexProgress={indexProgress}
             connectionError={connectionError}
             onTestConnection={handleTestConnection}
           />

           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-xs text-gray-500 flex-1 overflow-auto">
              <h4 className="font-bold mb-2 text-gray-700">關於本系統</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>前端直接執行向量相似度計算 (或連線 Qdrant)。</li>
                <li>使用 <strong>Gemini text-embedding-004</strong> 產生向量。</li>
                <li>使用 <strong>Gemini 2.5 Flash</strong> 回答問題。</li>
                <li><strong>本機模式</strong>：使用瀏覽器記憶體，完全免費且無 CORS 問題。</li>
                <li className="text-teal-600 font-semibold">支援上下文記憶：可進行連續對話。</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p>內建資料包含：台北、新北、桃園、台中、南投、嘉義、台南、高雄、宜蘭、花蓮、台東。</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}