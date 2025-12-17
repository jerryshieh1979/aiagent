import { QdrantConfig } from '../types';

// text-embedding-004 dimension is 768
const VECTOR_SIZE = 768;

const getHeaders = (config: QdrantConfig, isJson: boolean = true) => {
  const headers: HeadersInit = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (config.apiKey) {
    headers['api-key'] = config.apiKey;
  }
  return headers;
};

// Remove trailing slash from URL if present
const cleanUrl = (url: string) => url.replace(/\/$/, '');

// ==========================================
// LOCAL STORAGE SIMULATION HELPER
// ==========================================
const getLocalKey = (collectionName: string) => `local_vector_db_${collectionName}`;

// Cosine Similarity calculation: (A . B) / (|A| * |B|)
const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// ==========================================
// EXPORTED FUNCTIONS
// ==========================================

export const checkConnection = async (config: QdrantConfig): Promise<string> => {
  // --- Local Mode ---
  if (config.mode === 'local') {
    return `本機模式 (Local Mode) 就緒。資料將儲存於瀏覽器 LocalStorage。`;
  }

  // --- Cloud Mode ---
  const url = `${cleanUrl(config.url)}/collections`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(config, false),
    });
    
    if (res.ok) {
      const data = await res.json();
      return `連線成功！現有 Collections: ${data.result?.map((c: any) => c.name).join(', ') || '無'}`;
    } else {
      const text = await res.text();
      throw new Error(`Status ${res.status}: ${text}`);
    }
  } catch (e: any) {
    throw new Error(`連線失敗: ${e.message}`);
  }
};

export const checkCollectionExists = async (config: QdrantConfig): Promise<boolean> => {
  // --- Local Mode ---
  if (config.mode === 'local') {
    const data = localStorage.getItem(getLocalKey(config.collectionName));
    return !!data && JSON.parse(data).length > 0;
  }

  // --- Cloud Mode ---
  const url = `${cleanUrl(config.url)}/collections/${config.collectionName}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(config, false),
    });
    
    if (res.ok) return true;
    if (res.status === 404) return false;
    
    // For other errors, try to get text
    const text = await res.text().catch(() => '');
    throw new Error(`Check Collection Failed (${res.status}): ${text}`);
    
  } catch (e: any) {
    // If it's a 404 disguised as error or network issue
    if (e.message.includes('404')) return false;
    console.warn("Check collection error:", e);
    throw e;
  }
};

export const createCollection = async (config: QdrantConfig): Promise<void> => {
  // --- Local Mode ---
  if (config.mode === 'local') {
    // Just clear the local storage key to start fresh
    localStorage.removeItem(getLocalKey(config.collectionName));
    return;
  }

  // --- Cloud Mode ---
  const baseUrl = cleanUrl(config.url);
  const collectionUrl = `${baseUrl}/collections/${config.collectionName}`;

  // 1. Delete if exists (best effort)
  try {
    await fetch(collectionUrl, {
      method: 'DELETE',
      headers: getHeaders(config, false),
    });
  } catch (e) {
    console.warn("Delete collection ignored:", e);
  }

  // 2. Create
  const res = await fetch(collectionUrl, {
    method: 'PUT',
    headers: getHeaders(config, true),
    body: JSON.stringify({
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create collection: ${err}`);
  }
};

export const upsertPoints = async (
  config: QdrantConfig, 
  points: { id: number; vector: number[]; payload: any }[]
): Promise<void> => {
  // --- Local Mode ---
  if (config.mode === 'local') {
    const key = getLocalKey(config.collectionName);
    const existingStr = localStorage.getItem(key);
    let existingPoints = existingStr ? JSON.parse(existingStr) : [];
    
    // Simple append/replace logic (not fully optimized but works for demo)
    // Filter out existing points with same ID to simulate upsert
    const newIds = new Set(points.map(p => p.id));
    existingPoints = existingPoints.filter((p: any) => !newIds.has(p.id));
    
    const finalPoints = [...existingPoints, ...points];
    
    // Check local storage limits
    try {
      localStorage.setItem(key, JSON.stringify(finalPoints));
    } catch (e) {
      throw new Error("Local Storage is full! Cannot save more vectors.");
    }
    return;
  }

  // --- Cloud Mode ---
  const baseUrl = cleanUrl(config.url);
  const url = `${baseUrl}/collections/${config.collectionName}/points?wait=true`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(config, true),
    body: JSON.stringify({
      points,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upsert points: ${err}`);
  }
};

export const searchPoints = async (
  config: QdrantConfig,
  vector: number[],
  limit: number = 3
): Promise<any[]> => {
  // --- Local Mode ---
  if (config.mode === 'local') {
    const key = getLocalKey(config.collectionName);
    const dataStr = localStorage.getItem(key);
    if (!dataStr) return [];

    const points = JSON.parse(dataStr);
    
    // Calculate similarities
    const scoredPoints = points.map((p: any) => ({
      ...p,
      score: cosineSimilarity(vector, p.vector)
    }));

    // Sort descending by score
    scoredPoints.sort((a: any, b: any) => b.score - a.score);

    // Return top K
    return scoredPoints.slice(0, limit);
  }

  // --- Cloud Mode ---
  const baseUrl = cleanUrl(config.url);
  const url = `${baseUrl}/collections/${config.collectionName}/points/search`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(config, true),
    body: JSON.stringify({
      vector,
      limit,
      with_payload: true,
    }),
  });

  if (!res.ok) {
    throw new Error('Search failed');
  }

  const data = await res.json();
  return data.result || [];
};