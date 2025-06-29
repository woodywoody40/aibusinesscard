import React, { useMemo, useState } from 'react';
import { Contact } from '../types';
import { ContactCard } from './ContactCard';
import { Icon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactListProps {
  contacts: Contact[];
  searchTerm: string;
  onDeleteContact: (id: string) => void;
  onEditContact: (contact: Contact) => void;
}

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 sm:py-20 flex flex-col items-center"
  >
    <div className="relative mb-8 w-64 h-48">
        <svg viewBox="0 0 256 192" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="text-light-secondary dark:text-dark-secondary" stopColor="currentColor" />
                    <stop offset="100%" className="text-light-primary dark:text-dark-primary" stopColor="currentColor" />
                </linearGradient>
            </defs>
            <path d="M64 32C64 23.1634 71.1634 16 80 16H176C184.837 16 192 23.1634 192 32V160C192 168.837 184.837 176 176 176H80C71.1634 176 64 168.837 64 160V32Z" fill="url(#grad1)" transform="rotate(-10 128 96)" className="opacity-70"/>
            <path d="M48 40C48 28.9543 56.9543 20 68 20H188C199.046 20 208 28.9543 208 40V152C208 163.046 199.046 172 188 172H68C56.9543 172 48 163.046 48 152V40Z" className="fill-light-surface dark:fill-dark-surface stroke-light-border dark:stroke-dark-border" strokeWidth="2"/>
            <circle cx="80" cy="52" r="12" className="fill-light-text/20 dark:fill-dark-text/20"/>
            <rect x="104" y="48" width="72" height="8" rx="4" className="fill-light-text/30 dark:fill-dark-text/30"/>
            <rect x="80" y="80" width="100" height="6" rx="3" className="fill-light-text/20 dark:fill-dark-text/20"/>
            <rect x="80" y="100" width="100" height="6" rx="3" className="fill-light-text/20 dark:fill-dark-text/20"/>
            <rect x="80" y="120" width="60" height="6" rx="3" className="fill-light-text/20 dark:fill-dark-text/20"/>
        </svg>
    </div>
    <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">您的名片夾是空的</h2>
    <p className="mt-3 text-light-text-secondary dark:text-dark-text-secondary max-w-sm">
        準備好開始了嗎？點擊右下角的
        <span className="font-bold text-light-primary dark:text-dark-primary">相機按鈕</span>
        ，掃描您的第一張名片！
    </p>
  </motion.div>
);

const ExpandedContactCard = ({ contact, onDeselect, onDelete, onEdit }: { contact: Contact; onDeselect: () => void; onDelete: (id: string) => void; onEdit: (contact: Contact) => void; }) => {
    const displayName = contact.chineseName || contact.englishName || '這位聯絡人';

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
        <motion.div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onDeselect}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <motion.div
                layoutId={contact.id}
                onClick={(e) => e.stopPropagation()}
                className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh]"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <motion.img
                            layoutId={`avatar-${contact.id}`}
                            src={contact.avatarUrl || contact.originalCardUrl}
                            alt={displayName}
                            className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-light-border dark:border-dark-border"
                        />
                        <div className="flex-grow overflow-hidden pt-1">
                            <motion.h3 layoutId={`name-${contact.id}`} className="text-2xl font-bold text-light-text dark:text-dark-text">{contact.chineseName || contact.englishName || '無姓名'}</motion.h3>
                            {contact.chineseName && contact.englishName && (
                                <motion.p layoutId={`english-name-${contact.id}`} className="text-md text-light-text-secondary dark:text-dark-text-secondary">{contact.englishName}</motion.p>
                            )}
                            <motion.span layoutId={`industry-${contact.id}`} className="inline-block bg-light-primary/10 text-light-primary dark:bg-dark-primary/20 dark:text-dark-primary rounded-full px-3 py-1 text-sm font-semibold mt-2">
                                {contact.industry}
                            </motion.span>
                        </div>
                         <button onClick={onDeselect} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/10 dark:hover:bg-white/10">
                            <Icon icon="x" className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto px-6 pb-6 space-y-4">
                     <div className="border-t border-light-border dark:border-dark-border pt-4 space-y-3">
                      <div>
                         <p className="text-lg font-semibold text-light-text dark:text-dark-text">{contact.company || '無公司'}</p>
                         <p className="text-md text-light-text-secondary dark:text-dark-text-secondary">{contact.title || '無職稱'}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} onClick={handleLinkClick} className="flex-1 flex items-center gap-2 bg-light-bg/80 dark:bg-dark-bg/80 hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-200 rounded-full px-4 py-2 text-sm text-light-text dark:text-dark-text shadow-sm">
                            <Icon icon="at" className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </a>
                        )}
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} onClick={handleLinkClick} className="flex-1 flex items-center gap-2 bg-light-bg/80 dark:bg-dark-bg/80 hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-200 rounded-full px-4 py-2 text-sm text-light-text dark:text-dark-text shadow-sm">
                            <Icon icon="phone" className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
                            <span className="truncate">{contact.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                </div>

                <div className="p-4 bg-light-bg/80 dark:bg-dark-bg/80 border-t border-light-border dark:border-dark-border flex justify-end gap-2 mt-auto">
                    <button
                      onClick={(e) => handleAction(e, () => onEdit(contact))}
                      className="flex items-center gap-1.5 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary transition-colors text-sm font-semibold p-2 rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
                    >
                      <Icon icon="edit" className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={(e) => handleAction(e, () => {
                         if (window.confirm(`確定要刪除 ${displayName} 嗎？`)) {
                            onDeselect();
                            onDelete(contact.id);
                         }
                      })}
                      className="flex items-center gap-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors text-sm font-semibold p-2 rounded-lg hover:bg-red-500/10"
                    >
                      <Icon icon="trash" className="w-4 h-4" /> Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const ContactList: React.FC<ContactListProps> = ({ contacts, searchTerm, onDeleteContact, onEditContact }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredContacts = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) return contacts;
    return contacts.filter(contact => {
      const { chineseName, englishName, company, title } = contact;
      return (
        (chineseName && chineseName.toLowerCase().includes(lowercasedFilter)) ||
        (englishName && englishName.toLowerCase().includes(lowercasedFilter)) ||
        (company && company.toLowerCase().includes(lowercasedFilter)) ||
        (title && title.toLowerCase().includes(lowercasedFilter))
      );
    });
  }, [contacts, searchTerm]);

  const groupedContacts = useMemo(() => {
    return filteredContacts.reduce((acc, contact) => {
      const industry = contact.industry || '其他';
      if (!acc[industry]) {
        acc[industry] = [];
      }
      acc[industry].push(contact);
      return acc;
    }, {} as Record<string, Contact[]>);
  }, [filteredContacts]);

  const sortedIndustries = Object.keys(groupedContacts).sort();
  const selectedContact = useMemo(() => contacts.find(c => c.id === selectedId), [contacts, selectedId]);

  if (contacts.length === 0) {
    return <EmptyState />;
  }
  
  if (filteredContacts.length === 0) {
    return (
      <div className="text-center py-20">
        <Icon icon="search" className="w-16 h-16 text-light-text-secondary/50 dark:text-dark-text-secondary/50 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">找不到符合的聯絡人</h2>
        <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">請嘗試使用不同的關鍵字搜尋。</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <motion.div layout className="space-y-12">
      {sortedIndustries.map(industry => (
        <motion.div layout="position" key={industry}>
          <div className="mb-6">
             <span className="inline-block bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-full px-4 py-2 text-xl font-bold text-light-text dark:text-dark-text tracking-wide shadow-neo-low">{industry}</span>
          </div>
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
              {groupedContacts[industry].map((contact) => (
                <ContactCard 
                  key={contact.id}
                  contact={contact} 
                  onSelect={() => setSelectedId(contact.id)}
                />
              ))}
          </motion.div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedContact && (
            <ExpandedContactCard 
                contact={selectedContact} 
                onDeselect={() => setSelectedId(null)}
                onDelete={onDeleteContact}
                onEdit={(contact) => {
                    setSelectedId(null);
                    // Use a timeout to ensure the deselection animation completes before the edit modal appears
                    setTimeout(() => onEditContact(contact), 150);
                }}
            />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
