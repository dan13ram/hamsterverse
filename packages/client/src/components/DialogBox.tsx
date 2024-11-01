import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDialogText } from '../hooks/useDialogText';

export const DialogBox = ({
  speed = 50,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const text = useDialogText(isComplete);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
    setIsComplete(false);

    const nextLetter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex++]);
      } else {
        setIsComplete(true);
        clearInterval(intervalId);
      }
    }

    const intervalId = setInterval(nextLetter, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <div className={twMerge(`relative text-white p-4 w-full h-full flex items-start border-2 border-white rounded-lg shadow-white m-2`, className)}>
      <p className="font-mono font-bold text-2xl">
        {displayedText}
        <span className="animate-pulse">|</span>
      </p>
      {isComplete && (
        <p className="text-sm absolute bottom-0 right-0 p-2">
          Press enter to continue
        </p>
      )}
    </div>
  );
};
