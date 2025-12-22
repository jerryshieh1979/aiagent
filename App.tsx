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
      content: '歡迎來到台灣城市全攻略！\n\n資料庫已擴充至 31 筆精選條目，涵蓋全台所有縣市及阿里山、墾丁、蘭嶼等熱門景區。\n\n請點擊右側的「建立向量索引」來初始化最新的導遊資料。',
      timestamp: Date.now()
    }
  ]);
  
  const [isIndexing, setIsIndexing] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [indexProgress, setIndexProgress] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const checkStatus = async () => {
      if (qdrantConfig.mode === 'cloud' && !qdrantConfig.url) return;
      try {
        const exists = await checkCollectionExists(qdrantConfig);
        setIsIndexed(exists);
        if (exists) setConnectionError(null);
      } catch (err: any) {
        setIsIndexed(false);
      }
  };

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
    if (qdrantConfig.mode === 'cloud' && !qdrantConfig.apiKey && qdrantConfig.url.includes('cloud.qdrant.io')) {
      alert("使用 Qdrant Cloud 必須提供 API Key。");
      return;
    }

    setIsIndexing(true);
    setIndexProgress('開始初始化...');
    setConnectionError(null);

    try {
      setIndexProgress(`正在重置資料庫: ${qdrantConfig.collectionName}...`);
      await createCollection(qdrantConfig);
      
      const points = [];
      const total = TAIWAN_CITIES.length;
      
      for (let i = 0; i < total; i++) {
        const city = TAIWAN_CITIES[i];
        setIndexProgress(`正在產生向量 (${i + 1}/${total}): ${city.name}...`);
        
        const textToEmbed = `${city.name}\n${city.description}\n特色: ${city.highlights.join(', ')}`;
        const vector = await getEmbedding(textToEmbed);
        
        points.push({
          id: city.id,
          vector: vector,
          payload: {
            name: city.name,
            description: city.description,
            highlights: city.highlights,
            full_text: textToEmbed
          }
        });
        
        // Slight delay for rate limiting
        await new Promise(r => setTimeout(r, 200)); 
      }

      setIndexProgress('正在儲存 31 筆向量資料...');
      await upsertPoints(qdrantConfig, points);
      
      setIsIndexed(true);
      setIndexProgress('完成！資料庫已就緒。');
      setConnectionError(null);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: '31 筆導覽資料索引完成！您可以開始詢問，例如：「我想看藍眼淚要去哪？」或「台東有什麼好吃的便當？」',
        timestamp: Date.now()
      }]);

    } catch (error: any) {
      console.error(error);
      setIndexProgress(`錯誤中止`);
      setConnectionError(error.message || 'Unknown Error');
    } finally {
      setIsIndexing(false);
      if (!connectionError) {
         setTimeout(() => setIndexProgress(''), 5000);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
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
        throw new Error("請先點擊「建立向量索引」才能搜尋。");
      }

      const queryVector = await getEmbedding(text);
      const searchResults = await searchPoints(qdrantConfig, queryVector, 4);
      
      const contextChunks = searchResults.map((res: any) => res.payload.full_text);
      const sources = searchResults.map((res: any) => res.payload.name);

      const answer = await generateAnswer(text, messages, contextChunks);

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
        <div className="flex-1 h-full order-2 md:order-1">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isThinking}
          />
        </div>

        <div className="w-full md:w-80 flex flex-col gap-4 order-1 md:order-2">
           <div className="bg-gradient-to-br from-teal-900 to-teal-800 text-white p-5 rounded-xl shadow-lg">
              <h1 className="text-xl font-bold mb-2">Taiwan Explorer AI</h1>
              <p className="text-teal-200 text-xs">
                31 筆全台景點資料庫 Ready!
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
              <h4 className="font-bold mb-2 text-gray-700">對話小秘訣</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>連續對話：</strong>問完阿里山，可以接著問「那那裡有什麼美食？」</li>
                <li><strong>特定景點：</strong>可以詢問綠島、蘭嶼、馬祖等離島資訊。</li>
                <li><strong>比較與推薦：</strong>例如「適合看日出的景點有哪些？」</li>
                <li className="text-teal-600 font-semibold">本機模式完全免費。</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p>資料筆數：31 條 (包含所有縣市與離島)</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}