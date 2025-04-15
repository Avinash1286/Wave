import React, { useState } from 'react';

const EMOJIS = ['👏', '😂', '🔥', '😍', '👍', '🎉'];

interface ReactionBarProps {
  onReact: (emoji: string) => void;
}

const ReactionBar: React.FC<ReactionBarProps> = ({ onReact }) => {
  return (
    <div className="flex gap-2 justify-center mb-2">
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          className="text-2xl hover:scale-125 transition-transform duration-150 focus:outline-none"
          onClick={() => onReact(emoji)}
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionBar;
