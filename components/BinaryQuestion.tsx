
import React from 'react';

interface BinaryQuestionProps {
  text: string;
  onAnswer: (val: boolean) => void;
}

const BinaryQuestion: React.FC<BinaryQuestionProps> = ({ text, onAnswer }) => {
  return (
    <div className="w-full max-w-xl fade-in text-center">
      <h2 className="text-4xl md:text-5xl mb-16 serif leading-tight">{text}</h2>
      
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={() => onAnswer(true)}
          className="group relative px-16 py-6 border border-gray-200 hover:border-luxury-gold transition-all duration-500"
        >
          <span className="relative z-10 uppercase tracking-[0.4em] text-sm font-light group-hover:text-luxury-gold transition-colors">Yes</span>
        </button>
        
        <button
          onClick={() => onAnswer(false)}
          className="group relative px-16 py-6 border border-gray-200 hover:border-luxury-gold transition-all duration-500"
        >
          <span className="relative z-10 uppercase tracking-[0.4em] text-sm font-light group-hover:text-luxury-gold transition-colors">No</span>
        </button>
      </div>
    </div>
  );
};

export default BinaryQuestion;
