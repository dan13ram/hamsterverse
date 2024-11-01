import { useComponentValue } from "@latticexyz/react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "../../contexts/MUDContext";
import { useAtom } from "jotai";
import { ready } from "../../utils/atoms";

import bg from "../../assets/page0.png";

import { Image } from "../Image";

export const Page0 = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { nextPage, prevPage },
    network: { playerEntity },
  } = useMUD();

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);


  const [isReady, setIsReady] = useAtom(ready);

  return (
    <div className={twMerge("relative flex flex-col items-center justify-center w-full h-full", isReady ? "cursor-pointer hover:animate-shake" : null)
    }
      onClick={() => {
        if (isReady) {
          nextPage();
        }
      }}
    >
      <Image
        src={bg}
      />
    </div>
  );
};
