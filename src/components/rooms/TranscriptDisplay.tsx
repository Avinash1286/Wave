import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  isFinal?: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, isFinal }) => {
  if (!transcript) return null;
  return (
    <div className={`px-4 py-2 mt-2 rounded-lg shadow text-base bg-white/80 text-gray-900 max-w-xl mx-auto border border-gray-200 ${isFinal ? 'opacity-80' : 'opacity-100'}`}
         style={{ wordBreak: 'break-word', fontStyle: isFinal ? 'italic' : 'normal' }}>
      <span>{transcript}</span>
      {isFinal && <span className="ml-2 text-xs text-gray-500">(final)</span>}
    </div>
  );
};

export default TranscriptDisplay;
