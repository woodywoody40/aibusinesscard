import React, { useState, useEffect, useCallback } from 'react';
import { Contact, Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ContactList } from './components/ContactList';
import { ActionButton } from './components/ActionButton';
import { ScannerModal } from './components/ScannerModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EditContactModal } from './components/EditContactModal';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini_api_key', null);
  const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Omit<Contact, 'id' | 'createdAt'> | Contact | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === Theme.Light ? Theme.Dark : Theme.Light);
    root.classList.add(theme);
  }, [theme]);
  
  useEffect(() => {
    // On initial load, if there's no API key, open the modal.
    if (!apiKey) {
      setTimeout(() => setApiKeyModalOpen(true), 500);
    }
  }, []); // Run only once on mount

  const handleScanSuccess = useCallback((scannedData: Omit<Contact, 'id' | 'createdAt'>) => {
    setContactToEdit(scannedData);
    setScannerOpen(false);
    setEditModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((contact: Contact) => {
    setContactToEdit(contact);
    setEditModalOpen(true);
  }, []);

  const handleSaveContact = useCallback((dataToSave: Omit<Contact, 'id' | 'createdAt'> | Contact) => {
    if ('id' in dataToSave) {
      // This is an update to an existing contact
      setContacts(prev => prev.map(c => c.id === dataToSave.id ? dataToSave : c));
    } else {
      // This is a new contact
      const newContact: Contact = {
        ...dataToSave,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setContacts(prev => [newContact, ...prev]);
    }
    setEditModalOpen(false);
    setContactToEdit(null);
  }, [setContacts]);

  const handleDeleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, [setContacts]);
  
  const handleOpenScanner = () => {
    if (!apiKey) {
      setApiKeyModalOpen(true);
    } else {
      setScannerOpen(true);
    }
  };
  
  return (
    <div className={`min-h-screen transition-bg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text`}>
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        contacts={contacts} 
        setContacts={setContacts}
        onApiKeyClick={() => setApiKeyModalOpen(true)} 
      />
      <div className="mx-auto max-w-7xl">
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
          <div className="my-8">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <ContactList 
            contacts={contacts} 
            searchTerm={searchTerm} 
            onDeleteContact={handleDeleteContact} 
            onEditContact={handleOpenEditModal}
          />
        </main>
      </div>


      <ActionButton onClick={handleOpenScanner} />
      
      <AnimatePresence>
        {isScannerOpen && apiKey && (
          <ScannerModal
            apiKey={apiKey}
            onClose={() => setScannerOpen(false)}
            onScanSuccess={handleScanSuccess}
          />
        )}

        {isApiKeyModalOpen && (
          <ApiKeyModal
            currentApiKey={apiKey}
            onClose={() => setApiKeyModalOpen(false)}
            onSave={(key) => {
              setApiKey(key);
              setApiKeyModalOpen(false);
            }}
          />
        )}

        {isEditModalOpen && contactToEdit && (
           <EditContactModal
             contactData={contactToEdit}
             onClose={() => {
                setEditModalOpen(false);
                setContactToEdit(null);
             }}
             onSave={handleSaveContact}
           />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;