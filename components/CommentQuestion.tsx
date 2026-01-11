
import React, { useState } from 'react';

interface CommentQuestionProps {
  onComplete: (comment: string) => void;
}

const CommentQuestion: React.FC<CommentQuestionProps> = ({ onComplete }) => {
  const [comment, setComment] = useState('');

  return (
    <div className="w-full max-w-2xl fade-in">
      <h2 className="text-4xl md:text-5xl mb-12 text-center serif leading-tight">
        Do you have any additional thoughts for us?
      </h2>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full h-48 p-8 bg-white border border-gray-100 focus:border-luxury-gold focus:outline-none transition-all duration-500 text-lg font-light leading-relaxed mb-12 italic"
      />

      <button
        onClick={() => onComplete(comment)}
        className="w-full py-5 px-8 bg-luxury-charcoal text-white uppercase tracking-[0.3em] text-[12px] font-semibold hover:bg-black transition-all duration-500"
      >
        Complete Registry
      </button>
    </div>
  );
};

export default CommentQuestion;
