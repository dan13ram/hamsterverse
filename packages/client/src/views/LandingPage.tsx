import { ConnectButton } from "@rainbow-me/rainbowkit";

import bg from "../assets/landing/bg.png";
import clouds1 from "../assets/landing/clouds1.png";
import clouds2 from "../assets/landing/clouds2.png";
import tower from "../assets/landing/tower.png";

export const LandingPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-8 w-full h-full">
      <img src={bg} className="absolute inset-0 z-0 w-full h-full" alt="bg" />
      <div className="absolute inset-0 z-0 w-full h-full bg-image bg-size-[100%_100%] bg-repeat-x animate-scroll" style={{ backgroundImage: `url(${clouds1})` }} />
      <div className="absolute inset-0 z-0 w-full h-full bg-image bg-size-[100%_100%] bg-repeat-x animate-scroll-right" style={{ backgroundImage: `url(${clouds2})` }} />
      <ConnectButton.Custom>
        {({ openConnectModal }) => {
          return (<img src={tower} className="absolute inset-0 z-0 w-full h-full hover:scale-110 transition-transform cursor-pointer duration-[1000ms]" alt="tower"
            onClick={() => openConnectModal()} />);
        }}
      </ConnectButton.Custom>
    </div>
  );
};
