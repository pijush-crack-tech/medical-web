// components/PremiumSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Archive } from 'lucide-react';

const PremiumAction = ({ icon: Icon, title, onClick, color = 'bg-teal-900' }) => (
  <motion.button
    onClick={onClick}
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
      hover: { scale: 1.05 }
    }}
    whileHover="hover"
    whileTap={{ scale: 0.95 }}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
  >
    <div className="text-center">
      <div className={`${color} rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
        <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
      </div>
      <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
        {title}
      </p>
    </div>
  </motion.button>
);

export const PremiumSection = ({ onArchiveOpen, onMeritOpen }) => {
  const premiumActions = [
    { title: 'Smart Search', icon: Search, onClick: () => {} },
    { title: 'Central Archive', icon: Archive, onClick:() => {onArchiveOpen} },
    { title: 'Quiz Master', icon: Archive, onClick: () => {} },
    { title: 'Central Result', icon: Archive, onClick: () => {} },
    { title: 'Central Favourite', icon: Archive, onClick: () => {} },
    { title: 'Wrong & Unanswered', icon: Archive, onClick: () => {} }
  ];

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="lg:col-span-2"
    >
      <h2 className="text-gray-900 text-xl md:text-xl font-semibold mb-4 md:mb-2 font-geist-sans">
        Premium Section
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
        {premiumActions.map((action, index) => (
          <PremiumAction key={index} {...action} />
        ))}
      </div>
    </motion.div>
  );
};