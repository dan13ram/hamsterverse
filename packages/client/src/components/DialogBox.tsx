import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../contexts/MUDContext";
import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDialogText } from '../hooks/useDialogText';
import { ready } from '../utils/atoms';
import { useAtom } from 'jotai';

export const DialogBox = ({
  speed = 50,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useAtom(ready);

  const { network: { playerEntity },
    components: { Page },
  } = useMUD();

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

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
        {!isComplete && <span className="animate-pulse">|</span>}
      </p>
      {isComplete && page !== 6 && (
        <p className="text-sm absolute bottom-0 right-0 p-2">
          Press enter to continue
        </p>
      )}
    </div>
  );
};
