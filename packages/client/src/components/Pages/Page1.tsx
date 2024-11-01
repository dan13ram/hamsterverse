import { useComponentValue } from "@latticexyz/react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "../../contexts/MUDContext";
import { useAtom } from "jotai";
import { ready } from "../../utils/atoms";
import { Video } from "../Video";
import { Image } from "../Image";
import { TextBox } from "../TextBox";

import bg1 from "../../assets/page1.png";
import vent from "../../assets/vent.mp4";


export const Page1 = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { nextPage, prevPage },
    network: { playerEntity },
  } = useMUD();

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

  const [isReady, setIsReady] = useAtom(ready);

  return (
    <div
      className={twMerge(
        "relative flex flex-col items-center justify-center w-full h-full bg-[#BDBAb0]",
        isReady ? "cursor-pointer hover:animate-shake" : null,
      )}
      onClick={() => {
        if (isReady) {
          nextPage();
        }
      }}
    >
      <div className="aspect-video w-[48%] absolute top-0 right-0">
        <Video
          src={vent}
        />
      </div>
      <div className="absolute left-0 top-0 w-[58%] p-8 flex flex-col items-center justify-center">
        <Image
          src={bg1}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-[35%] h-[54%] p-16 flex flex-col items-center justify-center text-right">
        <TextBox text="The hamsters feast on nutrient paste, eternally bathed in the sickly sweet glow of bioluminescent fungi, their minds dulled by pheromones pumped through the ventilation shafts." />

      </div>
    </div>
  );
};
