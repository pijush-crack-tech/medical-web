'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  User, 
  X,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useNavStore } from '@/store/NavbarStore';

// Icon mapping for dynamic rendering
const iconMap = {
  Home,
  Search,
  User,
  Heart,
  ShoppingCart
};

const MobileMenuOverlay = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useNavStore();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            onClick={closeMobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold font-geist-sans">Menu</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = iconMap[item.icon];
                  
                  return (
                    <Link key={item.id} href={item.href} onClick={closeMobileMenu}>
                      <motion.div
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-geist-sans ${
                          isActive 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuOverlay;