import React from 'react';
import { Contact } from '../types';
import { motion } from 'framer-motion';

interface ContactCardProps {
  contact: Contact;
  onSelect: () => void;
  className?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect, className }) => {
  const displayName = contact.chineseName || contact.englishName || '這位聯絡人';

  return (
    <motion.div
      layoutId={contact.id}
      onClick={onSelect}
      className={`bg-light-surface dark:bg-dark-surface rounded-2xl shadow-neo-medium overflow-hidden relative cursor-pointer group ${className || ''}`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="card-glow absolute inset-0 pointer-events-none"></div>
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center gap-4">
          <motion.img
            layoutId={`avatar-${contact.id}`}
            src={contact.avatarUrl || contact.originalCardUrl}
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-light-border dark:border-dark-border"
          />
          <div className="flex-grow overflow-hidden">
            <motion.h3 layoutId={`name-${contact.id}`} className="text-lg font-bold text-light-text dark:text-dark-text truncate">{contact.chineseName || contact.englishName || '無姓名'}</motion.h3>
            {contact.chineseName && contact.englishName && (
                <motion.p layoutId={`english-name-${contact.id}`} className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{contact.englishName}</motion.p>
            )}
             <motion.span layoutId={`industry-${contact.id}`} className="inline-block bg-light-primary/10 text-light-primary dark:bg-dark-primary/20 dark:text-dark-primary rounded-full px-3 py-1 text-xs font-semibold mt-2">
                {contact.industry}
             </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
