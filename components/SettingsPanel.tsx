import React, { useState } from 'react';
import { Database, Settings, CheckCircle2, AlertCircle, RefreshCw, Server, Key, AlertTriangle, Activity, HardDrive, Cloud } from 'lucide-react';
import { QdrantConfig } from '../types';

interface SettingsPanelProps {
  config: QdrantConfig;
  onSaveConfig: (cfg: QdrantConfig) => void;
  isIndexing: boolean;
  onIndexData: () => void;
  isIndexed: boolean;
  indexProgress: string;
  connectionError?: string | null;
  onTestConnection: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  config, 
  onSaveConfig, 
  isIndexing, 
  onIndexData,
  isIndexed,
  indexProgress,
  connectionError,
  onTestConnection
}) => {
  const [localConfig, setLocalConfig] = useState<QdrantConfig>(config);
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof QdrantConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleModeChange = (mode: 'cloud' | 'local') => {
    setLocalConfig(prev => ({ ...prev, mode }));
  };

  const handleSave = () => {
    let url = localConfig.url.trim();
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    const cleanedConfig = {
      ...localConfig,
      url: url,
      apiKey: localConfig.apiKey.trim()
    };
    
    setLocalConfig(cleanedConfig);
    onSaveConfig(cleanedConfig);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
      <div 
        className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          系統設定
        </h3>
        <span className="text-xs text-gray-400">{isOpen ? '收起' : '展開'}</span>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3" /> 資料庫模式
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeChange('local')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all gap-1 ${
                  localConfig.mode === 'local' 
                    ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <HardDrive className="w-5 h-5 mb-1" />
                本機模式
                <span className="text-[10px] opacity-70">(瀏覽器儲存)</span>
              </button>
              <button
                onClick={() => handleModeChange('cloud')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all gap-1 ${
                  localConfig.mode === 'cloud' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <Cloud className="w-5 h-5 mb-1" />
                Qdrant Cloud
                <span className="text-[10px] opacity-70">(需 API Key)</span>
              </button>
            </div>
            {localConfig.mode === 'local' && (
              <p className="text-[10px] text-gray-500 leading-relaxed bg-gray-50 p-2 rounded">
                <strong>推薦使用！</strong> 向量資料將儲存在您的瀏覽器中。完全免費，無需設定，且不會有 CORS 連線問題。
              </p>
            )}
          </div>

          {/* Connection Config (Only for Cloud) */}
          {localConfig.mode === 'cloud' && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Server className="w-3 h-3" /> 雲端連線設定
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Qdrant URL</label>
                  <input
                    type="text"
                    value={localConfig.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://xyz.cloud.qdrant.io"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <Key className="w-3 h-3" /> API Key
                  </label>
                  <input
                    type="password"
                    value={localConfig.apiKey}
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="eyJh..."
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    若遇 <strong>Failed to fetch</strong> 錯誤，通常是因瀏覽器擋擋跨域請求 (CORS)。建議改用「本機模式」。
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium py-2 rounded-md transition-colors"
            >
              套用設定
            </button>
            <button
              onClick={onTestConnection}
              className="px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-2 rounded-md transition-colors flex items-center gap-1"
              title="測試連線"
            >
              <Activity className="w-3 h-3" />
              測試
            </button>
          </div>

          {connectionError && (
            <div className="bg-red-50 text-red-600 p-2 rounded-md text-xs flex items-start gap-2 break-all">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{connectionError}</span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Database className="w-3 h-3" /> 資料庫狀態
             </h4>
             
             <div className={`p-3 rounded-lg border text-sm mb-3 ${isIndexed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                <div className="flex items-center gap-2">
                  {isIndexed ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{isIndexed ? '資料已索引 (Ready)' : '尚未索引資料 (Not Indexed)'}</span>
                </div>
              </div>

             {indexProgress && (
               <div className="text-xs text-teal-600 mb-2 font-mono bg-teal-50 p-2 rounded break-all">
                 {indexProgress}
               </div>
             )}

             <button
                onClick={onIndexData}
                disabled={isIndexing}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                  isIndexing 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
                }`}
             >
                {isIndexing ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    處理中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3" />
                    {isIndexed ? '重新建立索引 (Re-build)' : '建立向量索引 (Build Index)'}
                  </>
                )}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;