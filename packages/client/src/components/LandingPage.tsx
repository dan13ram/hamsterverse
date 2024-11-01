import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMUD } from "../contexts/MUDContext";
import { twMerge } from "tailwind-merge";
import { useAtom } from "jotai";
import { useAccount } from "wagmi";

import bg from "../assets/landing/bg.png";
import clouds1 from "../assets/landing/clouds1.png";
import clouds2 from "../assets/landing/clouds2.png";
import tower from "../assets/landing/tower.png";

import { ready } from "../utils/atoms";

export const LandingPage = () => {
  const { isConnected } = useAccount();
  const { systemCalls: { nextPage } } = useMUD();
  // ready atom
  const [isReady, setReady] = useAtom(ready);

  const { openConnectModal } = useConnectModal();
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-8 w-full h-full">
      <img src={bg} className="absolute inset-0 z-0 w-full h-full" alt="bg" />
      <div className="absolute inset-0 z-0 w-full h-full bg-image bg-size-[100%_100%] bg-repeat-x animate-scroll" style={{ backgroundImage: `url(${clouds1})` }} />
      <div className="absolute inset-0 z-0 w-full h-full bg-image bg-size-[100%_100%] bg-repeat-x animate-scroll-right" style={{ backgroundImage: `url(${clouds2})` }} />
      <img src={tower} className={twMerge("absolute inset-0 z-0 w-full h-full transition-transform duration-[1000ms] animate-up", isReady ? "cursor-pointer hover:scale-110" : null)} alt="tower" onClick={() => {
        if (isReady) {
          openConnectModal?.();
        }
      }} />
    </div>
  );
};
