'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  User, 
  Menu, 
  X,
  Bell,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useNavStore,navItems, NavbarStore } from '@/store/NavbarStore';
import useAuthStore from '@/store/AuthStore';

// Icon mapping for dynamic rendering
const iconMap = {
  Home,
  Search,
  User,
  Heart,
  ShoppingCart
};

const DesktopNavbar = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavStore();
  const [isLoading, setIsLoading] = useState(false);
  const { logout, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Method 1: Using your auth store
      await logout();
      
      // Redirect will be handled by AuthProvider
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const pathname = usePathname();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 hidden md:block"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-geist-sans">
              {NavbarStore.title}
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = iconMap[item.icon];
              
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors font-geist-sans ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>
            
            <motion.button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default DesktopNavbar;