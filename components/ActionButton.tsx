import React from 'react';
import { Icon } from './Icon';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-30 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary text-white shadow-neo-medium hover:shadow-lg dark:shadow-dark-primary/20"
      aria-label="Scan new card"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Icon icon="camera" className="w-8 h-8" />
    </motion.button>
  );
};