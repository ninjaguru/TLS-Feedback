
import React from 'react';

interface BinaryQuestionProps {
  text: string;
  onAnswer: (val: boolean) => void;
  images?: string[];
}

const BinaryQuestion: React.FC<BinaryQuestionProps> = ({ text, onAnswer, images }) => {
  return (
    <div className="w-full max-w-2xl fade-in text-center">
      <h2 className="text-4xl md:text-5xl mb-12 serif leading-tight">{text}</h2>

      {images && images.length > 0 && (
        <div className="flex justify-center gap-8 mb-12 animate-float">
          {images.map((src, idx) => {
            const isLogo = src.includes('google') || src.includes('review') || src.includes('coupon') || src.includes('packages');
            return (
              <div key={idx} className={`relative group overflow-hidden ${isLogo ? 'rounded-xl bg-white p-4' : 'rounded-full'} w-32 h-32 md:w-40 md:h-40 border-2 border-luxury-gold/20 hover:border-luxury-gold transition-all duration-700 shadow-luxury`}>
                <img
                  src={src}
                  alt="Question Visual"
                  className={`w-full h-full ${isLogo ? 'object-contain' : 'object-cover'} grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700`}
                />
                {!isLogo && <div className="absolute inset-0 bg-luxury-gold/5 group-hover:bg-transparent transition-colors" />}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={() => onAnswer(true)}
          className="group relative px-16 py-6 border border-gray-100 hover:border-gray-200 transition-all duration-500"
        >
          <span className="relative z-10 uppercase tracking-[0.4em] text-sm font-extralight text-gray-400 group-hover:text-gray-600 transition-colors">Yes</span>
        </button>

        <button
          onClick={() => onAnswer(false)}
          className="group relative px-16 py-6 border border-gray-100 hover:border-gray-200 transition-all duration-500"
        >
          <span className="relative z-10 uppercase tracking-[0.4em] text-sm font-extralight text-gray-400 group-hover:text-gray-600 transition-colors">No</span>
        </button>
      </div>
    </div>
  );
};

export default BinaryQuestion;
