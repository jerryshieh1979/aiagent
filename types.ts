export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  sources?: string[]; // To show which cities were referenced
}

export interface CityData {
  id: number;
  name: string;
  description: string;
  highlights: string[];
}

export interface QdrantConfig {
  mode: 'cloud' | 'local'; // 'cloud' for Qdrant Cloud, 'local' for in-browser simulation
  url: string;
  apiKey: string;
  collectionName: string;
}

export interface AppState {
  config: QdrantConfig;
  isConfigured: boolean;
  isIndexing: boolean;
  isIndexed: boolean;
}