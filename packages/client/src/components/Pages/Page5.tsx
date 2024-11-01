import { useComponentValue } from "@latticexyz/react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "../../contexts/MUDContext";
import { useAtom } from "jotai";
import { ready } from "../../utils/atoms";

import bg from "../../assets/page5.png";
import decay from "../../assets/decay.mp4";
import wheel from "../../assets/wheel.mp4";

import { Image } from "../Image";
import { Video } from "../Video";
import { TextBox } from "../TextBox";

export const Page5 = () => {
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
      <div className="absolute left-0 top-0 w-[26%] p-4 flex flex-col items-center justify-center gap-4">
        <Video
          src={decay}
        />
        <TextBox text="Scruff’s trance breaks. He knows he must escape the gilded cage of this burrow and face the truth." className="p-0" />
      </div>
      <div className="absolute left-[27%] top-[30%] w-[30%] p-4 flex flex-col items-center justify-center">
        <Video
          src={wheel}
        />
      </div>
      <div className="absolute right-0 top-0 w-[42%] p-4 flex flex-col items-center justify-center">
        <Image
          src={bg}
        />
      </div>
    </div>
  );
};
