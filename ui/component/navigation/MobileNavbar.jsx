'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  User, 
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useNavStore,navItems } from '@/store/NavbarStore';

// Icon mapping for dynamic rendering
const iconMap = {
  Home,
  Search,
  User,
  Heart,
  ShoppingCart
};

const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = iconMap[item.icon];
          
          return (
            <Link key={item.id} href={item.href} className="flex-1">
              <motion.div
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg min-w-0 ${
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    color: isActive ? '#2563eb' : '#6b7280'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs font-medium font-geist-sans ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="w-1 h-1 bg-blue-600 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileNavbar;