
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [text, setText] = useState('Initiating Synchronisation');
  const messages = [
    'Initiating Synchronisation',
    'Securing Feedback Registry',
    'Analysing Artisan Experience',
    'Finalising Personalised Summary'
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setText(messages[i]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center fade-in text-center">
      <div className="w-24 h-24 border-t-2 border-luxury-gold rounded-full animate-spin mb-12"></div>
      <h2 className="text-2xl serif italic text-luxury-gold mb-4 tracking-wide">{text}</h2>
      <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-medium">Please stay with us</p>
    </div>
  );
};

export default LoadingScreen;
