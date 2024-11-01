import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LandingPage } from "./LandingPage";
import { useAccount } from "wagmi";
import { Game } from "../components/Game";
import { useRef } from "react";
import { useEffect, useCallback } from "react";

export const Root = () => {
  const { isConnected } = useAccount();
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);


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
        <div className="w-full flex flex-row items-center justify-between gap-4 p-8 bg-yellow-900">
          <p className="text-xl">Hamsterverse</p>
          {isConnected && (
            <ConnectButton
              accountStatus="full"
              chainStatus="full"
              showBalance={false}
            />
          )}
        </div>
        <div className="w-full flex-grow relative overflow-hidden flex flex-row justify-center items-center">
          <div
            className="relative max-w-full max-h-full flex-grow object-contain"
            ref={outerRef}
          >
            <div
              className="bg-black object-contain aspect-video mx-auto my-auto p-2"
              ref={innerRef}
            >
              <div className="flex items-center justify-center w-full h-full overflow-hidden">
                {!isConnected ? <LandingPage /> : <Game />}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-center gap-4 p-8 bg-yellow-900">
          <p className="text-xl">Hamsterverse Footer</p>
        </div>
      </div>
    </>
  );
};
