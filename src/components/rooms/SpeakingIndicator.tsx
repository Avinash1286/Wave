
import React from 'react';

interface SpeakingIndicatorProps {
  className?: string;
}

const SpeakingIndicator: React.FC<SpeakingIndicatorProps> = ({ className }) => {
  return (
    <div className={`speaking-wave ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default SpeakingIndicator;
