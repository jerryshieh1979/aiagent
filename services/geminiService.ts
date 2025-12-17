import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model for text generation (RAG)
const GENERATION_MODEL = 'gemini-2.5-flash';
// Model for embeddings
const EMBEDDING_MODEL = 'text-embedding-004';

export const getEmbedding = async (text: string): Promise<number[]> => {
  if (!process.env.API_KEY) throw new Error("Gemini API Key is missing");

  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: {
        parts: [{ text }],
      },
    });

    // Handle potential null/undefined structures safely
    if (response && response.embeddings && response.embeddings.length > 0) {
      return response.embeddings[0].values;
    }
    throw new Error("No embedding returned");
  } catch (error) {
    console.error("Error getting embedding:", error);
    throw error;
  }
};

export const generateAnswer = async (query: string, history: Message[], contextChunks: string[]): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("Gemini API Key is missing");

  const contextBlock = contextChunks.join("\n\n---\n\n");
  
  // Format conversation history (last 10 messages)
  const conversationHistory = history
    .filter(msg => msg.role === 'user' || msg.role === 'model')
    .slice(-10)
    .map(msg => `${msg.role === 'user' ? 'User' : 'AI (Guide)'}: ${msg.content}`)
    .join('\n');

  const prompt = `
    你是一位台灣旅遊與城市專家。請根據以下提供的[參考資料]與[對話歷史]來回答使用者的[問題]。
    
    規則：
    1. 如果參考資料中有相關資訊，請詳細回答。
    2. 如果參考資料中沒有相關資訊，你可以運用你的廣泛知識補充回答，但請優先使用參考資料。
    3. 回答風格要熱情、友善，像是一位專業導遊。
    4. 請使用繁體中文回答。
    5. 請參考[對話歷史]來理解上下文（例如使用者說「那裡」或「它」時是指什麼）。

    [參考資料 (Reference Data)]:
    ${contextBlock}

    [對話歷史 (Conversation History)]:
    ${conversationHistory || "無"}

    [問題 (Current Question)]:
    ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: prompt,
    });
    return response.text || "抱歉，我現在無法產生回答。";
  } catch (error) {
    console.error("Error generating answer:", error);
    return "發生錯誤，無法產生回答。請檢查 API Key 或網路連線。";
  }
};