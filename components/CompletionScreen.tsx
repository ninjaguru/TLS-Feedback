
import React from 'react';

interface CompletionScreenProps {
  message: string;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ message }) => {
  return (
    <div className="w-full max-w-2xl fade-in text-center">
      <div className="mb-12 flex justify-center">
        <div className="flex items-center gap-3 px-6 py-2 bg-green-50 text-green-700 border border-green-100 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] tracking-[0.2em] font-bold uppercase">Registry Synced</span>
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl mb-12 serif italic text-luxury-charcoal">A message from us</h2>

      <div className="relative p-12 md:p-16 border border-luxury-gold/20 bg-white mb-12">
        <div className="absolute top-0 left-12 -translate-y-1/2 bg-[#faf9f6] px-4">
           <span className="text-6xl text-luxury-gold font-serif opacity-40">“</span>
        </div>
        <p className="text-xl md:text-2xl font-light text-luxury-charcoal leading-relaxed">
          {message}
        </p>
        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center">
            <span className="text-[10px] tracking-[0.4em] text-luxury-gold uppercase font-bold">The Management</span>
            <span className="text-[10px] tracking-[0.2em] text-gray-300 uppercase mt-1">The London Salon</span>
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="text-[11px] tracking-[0.5em] text-gray-400 uppercase hover:text-luxury-gold transition-colors"
      >
        Return to Home
      </button>
    </div>
  );
};

export default CompletionScreen;
