import React, { useRef } from 'react';
import { Theme, Contact } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { APP_TITLE } from '../constants';
import { Icon } from './Icon';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  onApiKeyClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, contacts, setContacts, onApiKeyClick }) => {
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if(contacts.length === 0) {
      alert("沒有聯絡人可以匯出。");
      return;
    }
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `card_contacts_${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImportClick = () => {
    importRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File is not readable");
        const importedContacts = JSON.parse(text);
        
        if (Array.isArray(importedContacts) && importedContacts.every(c => 'id' in c && ('chineseName' in c || 'englishName' in c))) {
           if(window.confirm(`確定要匯入 ${importedContacts.length} 位聯絡人嗎？這將會覆蓋現有的聯絡人。`)) {
             setContacts(importedContacts);
             alert("匯入成功！");
           }
        } else {
            throw new Error("Invalid file format.");
        }
      } catch (error) {
        alert("匯入失敗：檔案格式不正確或已損毀。");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const ActionButton: React.FC<{onClick: () => void; title: string; icon: string}> = ({ onClick, title, icon}) => (
      <button onClick={onClick} title={title} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-all duration-200">
        <Icon icon={icon} className="w-6 h-6" />
      </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-light-surface/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border transition-bg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text tracking-wide">
          {APP_TITLE}
        </h1>
        <div className="flex items-center gap-1 sm:gap-2">
          <input type="file" ref={importRef} onChange={handleImport} accept=".json" className="hidden" />
          <ActionButton onClick={handleImportClick} title="匯入" icon="upload" />
          <ActionButton onClick={handleExport} title="匯出" icon="download" />
          <ActionButton onClick={onApiKeyClick} title="設定 API 金鑰" icon="key" />
          <div className="w-px h-6 bg-light-border dark:bg-dark-border mx-1"></div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};