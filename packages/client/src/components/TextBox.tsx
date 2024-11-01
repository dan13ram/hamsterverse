import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDialogText } from '../hooks/useDialogText';

export const TextBox = ({
  text = "Sample text",
  speed = 5,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');

    const nextLetter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex++]);
      } else {
        clearInterval(intervalId);
      }
    }

    const intervalId = setInterval(nextLetter, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <div className={twMerge(`relative p-4 w-full h-full flex items-start rounded-lg m-2 text-white`, className)}>
      <p className="font-mono font-bold text-2xl">
        {displayedText}
      </p>
    </div>
  );
};
