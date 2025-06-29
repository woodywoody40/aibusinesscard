import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import { Icon } from './Icon';
import { INDUSTRIES } from '../constants';
import { motion } from 'framer-motion';

type EditableContactData = Omit<Contact, 'id' | 'createdAt'> | Contact;

interface EditContactModalProps {
  contactData: EditableContactData;
  onSave: (data: EditableContactData) => void;
  onClose: () => void;
}

const InputField: React.FC<{ label: string; value: string | null; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || label}
      className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent transition-colors"
    />
  </div>
);

export const EditContactModal: React.FC<EditContactModalProps> = ({ contactData, onSave, onClose }) => {
  const [editedContact, setEditedContact] = useState<EditableContactData>(contactData);
  const isEditing = 'id' in contactData;

  const handleChange = (field: keyof Omit<EditableContactData, 'id' | 'createdAt' | 'avatarUrl' | 'originalCardUrl'>, value: string) => {
    setEditedContact(prev => ({ ...prev, [field]: value || null }));
  };
  
  const handleSave = () => {
    onSave(editedContact);
  };

  const industryOptions = useMemo(() => {
    const options = [...INDUSTRIES];
    if (editedContact.industry && !options.includes(editedContact.industry)) {
        options.push(editedContact.industry);
    }
    return options.sort();
  }, [editedContact.industry]);

  return (
    <div className="fixed inset-0 bg-morandi-10/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-neo-medium w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{isEditing ? '編輯聯絡人' : '確認與新增聯絡人'}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/10 dark:hover:bg-white/10">
            <Icon icon="x" className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
          {/* Image Column */}
          <div className="flex flex-col gap-4">
             <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">原始名片影像</h3>
            <div className="relative w-full aspect-[16/10] bg-morandi-10/90 rounded-lg overflow-hidden flex items-center justify-center border border-light-border dark:border-dark-border">
              <img src={editedContact.originalCardUrl} alt="Original business card" className="object-contain max-h-full max-w-full" />
            </div>
             <div className="flex items-center gap-4 p-4 rounded-lg bg-light-bg dark:bg-dark-bg">
                <img src={editedContact.avatarUrl || editedContact.originalCardUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-light-surface dark:border-dark-surface" />
                <div>
                    <p className="font-bold text-light-text dark:text-dark-text">{editedContact.chineseName || editedContact.englishName || '姓名'}</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{editedContact.title || '職稱'}</p>
                </div>
             </div>
          </div>

          {/* Form Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">擷取資訊</h3>
            <div className="space-y-4">
                <InputField label="中文姓名" value={editedContact.chineseName} onChange={(v) => handleChange('chineseName', v)} />
                <InputField label="英文姓名" value={editedContact.englishName} onChange={(v) => handleChange('englishName', v)} />
                <InputField label="職稱" value={editedContact.title} onChange={(v) => handleChange('title', v)} />
                <InputField label="公司" value={editedContact.company} onChange={(v) => handleChange('company', v)} />
                <InputField label="Email" value={editedContact.email} onChange={(v) => handleChange('email', v)} />
                <InputField label="電話" value={editedContact.phone} onChange={(v) => handleChange('phone', v)} />
                 <div>
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">產業</label>
                    <select
                        value={editedContact.industry}
                        onChange={(e) => handleChange('industry', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent transition-colors"
                    >
                        {industryOptions.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border flex justify-end gap-4">
           <button
            onClick={onClose}
            className="px-6 py-2 rounded-full font-semibold text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            取消
          </button>
          <motion.button
            onClick={handleSave}
            className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-br from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary flex items-center gap-2"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Icon icon="save" className="w-5 h-5"/>
            儲存聯絡人
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};