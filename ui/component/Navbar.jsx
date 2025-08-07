'use client';

import React from 'react';
import DesktopNavbar from './navigation/DesktopNavbar';
import MobileNavbar from './navigation/MobileNavbar';
import MobileMenuOverlay from './navigation/MobileMenuOverlay';


const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
      <MobileMenuOverlay />
    </>
  );
};

export default Navbar;