'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterWelcomeProps {
  username: string;
  shouldStart?: boolean;
}

export default function TypewriterWelcome({ username, shouldStart = true }: TypewriterWelcomeProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = `Welcome ${username}`;
  
  // Reset animation when shouldStart changes or component mounts
  useEffect(() => {
    if (shouldStart) {
      setDisplayText('');
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [shouldStart]);
  
  useEffect(() => {
    if (!shouldStart || isComplete) return;
    
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100); // Speed of typing
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, fullText, shouldStart, isComplete]);
  
  return (
    <div className="flex items-center justify-center">
      <h2 className="text-xl font-bold text-yellow-400">
        {displayText}
        {!isComplete && (
          <span className="animate-pulse text-yellow-300">|</span>
        )}
      </h2>
    </div>
  );
}
