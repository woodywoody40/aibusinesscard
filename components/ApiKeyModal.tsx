import React, { useState } from 'react';
import { Icon } from './Icon';
import { motion } from 'framer-motion';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
  currentApiKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSave, currentApiKey }) => {
  const [key, setKey] = useState(currentApiKey || '');

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-morandi-10/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
       <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-neo-medium w-full max-w-md flex flex-col overflow-hidden transition-bg" 
        onClick={(e) => e.stopPropagation()}
       >
        <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">設定 Google Gemini API 金鑰</h2>
           <button onClick={onClose} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/10 dark:hover:bg-white/10">
            <Icon icon="x" className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            為了使用 AI 掃描功能，您需要提供自己的 Google Gemini API 金鑰。金鑰只會安全地儲存在您的瀏覽器中，不會傳送到任何伺服器。
          </p>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              API 金鑰
            </label>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="請在此貼上您的 API 金鑰"
              className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent transition-colors"
            />
          </div>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            還沒有金鑰嗎？前往 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-semibold text-light-primary dark:text-dark-primary hover:underline">Google AI Studio</a> 免費取得。
          </p>
        </div>
        <div className="px-6 py-4 bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border flex justify-end">
          <motion.button
            onClick={handleSave}
            disabled={!key.trim()}
            className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-br from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            儲存並開始使用
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};