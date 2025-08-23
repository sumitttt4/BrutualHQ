import React from 'react';
import Header from './Header';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
