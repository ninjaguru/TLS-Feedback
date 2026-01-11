
import React, { useState } from 'react';
import { STYLISTS } from '../constants';
import { StylistName, StylistRating } from '../types';

interface StylistRatingProps {
  onComplete: (ratings: StylistRating[]) => void;
}

const StylistRatingComponent: React.FC<StylistRatingProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<StylistRating[]>([]);
  const [showTooltipFor, setShowTooltipFor] = useState<string | null>(null);

  const toggleStylist = (name: StylistName) => {
    if (selected.find(s => s.name === name)) {
      setSelected(selected.filter(s => s.name !== name));
      setShowTooltipFor(null);
    } else {
      setSelected([...selected, { name, rating: null }]);
    }
  };

  const setRating = (name: StylistName, rating: number) => {
    setSelected(selected.map(s => s.name === name ? { ...s, rating } : s));
    setShowTooltipFor(null);
  };

  const handleNext = () => {
    const incomplete = selected.find(s => s.rating === null);
    if (incomplete) {
      setShowTooltipFor(incomplete.name);
      return;
    }
    if (selected.length === 0) {
      // Potentially handle no selection, but typically we want at least one
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="w-full max-w-lg fade-in">
      <h2 className="text-4xl md:text-5xl mb-12 text-center serif leading-tight">Which artisans crafted your look today?</h2>
      
      <div className="space-y-4 mb-12">
        {STYLISTS.map(stylist => {
          const isSelected = selected.find(s => s.name === stylist);
          const rating = isSelected?.rating;
          
          return (
            <div key={stylist} className="flex flex-col">
              <button
                onClick={() => toggleStylist(stylist)}
                className={`w-full text-left py-4 px-6 border transition-all duration-300 flex justify-between items-center ${
                  isSelected ? 'border-luxury-gold bg-luxury-gold/5' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="text-lg font-light tracking-wide">{stylist}</span>
                <span className={`text-xl transition-transform duration-300 ${isSelected ? 'rotate-45' : ''}`}>+</span>
              </button>

              {isSelected && (
                <div className="mt-2 py-4 px-6 bg-white border border-luxury-gold/20 flex flex-col items-center relative animate-fade-in">
                  <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-4">Rate your experience</p>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(stylist, star)}
                        className={`text-2xl transition-all ${
                          rating && star <= rating ? 'text-luxury-gold scale-125' : 'text-gray-200 hover:text-luxury-gold/50'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {showTooltipFor === stylist && (
                    <div className="absolute -top-12 bg-luxury-gold text-white text-[10px] tracking-widest uppercase py-2 px-4 rounded-full pulse-gold">
                      Please select a star rating
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={selected.length === 0}
        className={`w-full py-5 px-8 uppercase tracking-[0.3em] text-[12px] font-semibold transition-all duration-500 ${
          selected.length > 0 
            ? 'bg-luxury-charcoal text-white hover:bg-black' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default StylistRatingComponent;
