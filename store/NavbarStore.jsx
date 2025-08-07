
import { create } from 'zustand';

// Zustand store for navbar state management
export const useNavStore = create((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false })
}));

// Navigation items configuration
export const navItems = [
  { id: 'home', label: 'Home', icon: 'Home', href: '/' },
  { id: 'MyStudy', label: 'My Study', icon: 'Search', href: '/search' },
  { id: 'Routine', label: 'Routine', icon: 'User', href: '/profile' },
  { id: 'Contact', label: 'Contact', icon: 'Heart', href: '/favorites' },
];

const Title = "Medical Higher Study"



export const NavbarStore =  {
  navItems,
  title :  Title
};
