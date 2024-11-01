import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LandingPage } from "../components/LandingPage";
import { useAccount } from "wagmi";
import { Game } from "../components/Game";
import { GameControls } from "../components/GameControls";
import { useRef } from "react";
import { useEffect, useCallback } from "react";
import { DialogBox } from "../components/DialogBox";
import { twMerge } from "tailwind-merge";

const dev = false; //import.meta.env.DEV;

export const Root = () => {
  const { isConnected } = useAccount();
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const updateSize = useCallback(() => {
    if (innerRef.current && outerRef.current) {
      const innerRect = innerRef.current.getBoundingClientRect();
      const outerRect = outerRef.current.getBoundingClientRect();

      if (innerRect.height > outerRect.height) {
        innerRef.current.style.height = `${outerRect.height}px`;
        innerRef.current.style.width = "unset";
      } else if (innerRect.height < outerRect.height) {
        innerRef.current.style.height = "unset";
      }
      if (innerRect.width > outerRect.width) {
        innerRef.current.style.height = "unset";
        innerRef.current.style.width = `${outerRect.width}px`;
      } else if (innerRect.width < outerRect.width) {
        innerRef.current.style.width = "unset";
      }

      if (dialogRef.current) {
        dialogRef.current.style.maxWidth = innerRect.width + "px";
      }
    }
  }, []);

  useEffect(() => {
    let resizeObserver;

    // Create a ResizeObserver to watch both containers
    resizeObserver = new ResizeObserver(updateSize);

    if (outerRef.current) {
      resizeObserver.observe(outerRef.current);
    }

    // Initial size update
    updateSize();

    // Cleanup
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateSize, isConnected]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center gap-4 p-8 w-full h-full lg:hidden">
        <p className="text-sm md:text-2xl">Welcome to Hamsterverse</p>
        <p>Small screens not supported</p>
      </div>
      <div className="relative flex-col items-center justify-center w-full h-full hidden lg:flex">
        <div className={twMerge("w-full flex flex-row items-center justify-between gap-4 p-8", dev ? "bg-red-900" : "bg-black")}>
          <p className="text-5xl font-heading tracking-wide">HAMSTERVERSE</p>
          {isConnected &&
            <ConnectButton
              showBalance={false}
            />
          }
        </div>
        <div className={twMerge("w-full flex-grow relative overflow-hidden flex flex-row justify-center items-center", dev ? "bg-red-700" : "bg-black")}>
          <div
            className="relative max-w-full max-h-full flex-grow object-contain"
            ref={outerRef}
          >
            <div
              className="bg-black object-contain aspect-video mx-auto my-auto p-2"
              ref={innerRef}
            >
              <div className="flex relative items-center justify-center w-full h-full overflow-hidden">
                {!isConnected ? <LandingPage /> : <Game />}
              </div>
            </div>
          </div>
          {isConnected && <GameControls />}
        </div>
        <div ref={dialogRef} className={twMerge("overflow-hidden w-full flex flex-row items-center justify-center py-8 h-[164px]", dev ? "bg-red-900" : "bg-black")}>
          <DialogBox />
        </div>
      </div>
    </>
  );
};
