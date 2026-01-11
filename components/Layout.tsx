
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  progress: number;
}

const Layout: React.FC<LayoutProps> = ({ children, progress }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-luxury-gold transition-all duration-700 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Sticky Brand Header */}
      <header className="sticky top-0 bg-[#faf9f6]/90 backdrop-blur-md border-b border-gray-100 py-6 px-8 flex justify-between items-center z-40">
        <div className="flex flex-col">
          <h1 className="text-2xl tracking-[0.2em] font-light uppercase">The London Salon</h1>
          <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-medium">Elegance Defined By Craft</p>
        </div>
        <div className="hidden md:block">
            <span className="text-[10px] tracking-widest text-luxury-gold uppercase font-semibold">Guest Registry</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12">
        {children}
      </main>

      <footer className="py-8 text-center text-[10px] tracking-widest text-gray-300 uppercase">
        © 2024 The London Salon. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
