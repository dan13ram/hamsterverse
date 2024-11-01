import { useComponentValue } from "@latticexyz/react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "../../contexts/MUDContext";
import { useAtom } from "jotai";
import { ready } from "../../utils/atoms";

import bg from "../../assets/page2.jpg";

import { Image } from "../Image";

export const Page2 = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { nextPage, prevPage },
    network: { playerEntity },
  } = useMUD();

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);


  const [isReady, setIsReady] = useAtom(ready);

  return (
    <div className={twMerge("relative w-full h-full overflow-hidden", isReady ? "cursor-pointer hover:animate-shake" : null)
    }
      onClick={() => {
        if (isReady) {
          nextPage();
        }
      }}
    >
      <div
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="bg-cover bg-center bg-no-repeat h-full w-[134%] animate-pan-right"
      />
    </div>
  );
};
