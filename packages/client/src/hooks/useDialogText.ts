import { useEffect, useState, useCallback } from "react";
import { useMUD } from "../contexts/MUDContext";
import { Direction } from "../utils/direction";
import { useComponentValue } from "@latticexyz/react";
import { useAccount } from "wagmi";
import { useKeyboard } from "./useKeyboard";

const dialogues = [
  {
    scene: 1,
    lines: [
      "Welcome to the Golden Burrow, where everything seems warm and inviting. But not all is as it appears...",
      "Meet Scruff, a hamster who feels something is deeply wrong here. There's a creeping dread beneath this comfort.",
      "Scruff’s eyes catch glimpses of darkness, images of decay hidden within the glowing walls."
    ]
  },
  {
    scene: 2,
    lines: [
      "Scruff's mind fills with visions: a world outside, choked with smoke, bones, and shadows of despair.",
      "Suddenly, he sees a colossal figure – the Moloch Tower – towering over a desolate landscape.",
      "Scruff’s trance breaks. He knows he must escape the gilded cage of this burrow and face the truth."
    ]
  },
  {
    scene: 3,
    lines: [
      "Driven by his visions, Scruff escapes through hidden tunnels, breathing fresh air for the first time as he surfaces.",
      "The world above is a wasteland, but in its raw honesty, Scruff feels a sense of liberation.",
      "His journey has just begun. Ahead lies a path filled with danger, but also, a glimmer of hope."
    ]
  },
  {
    scene: 4,
    lines: [
      "Scruff stumbles into the wasteland. Skulls litter the ground, and toxic fumes fill the air.",
      "To his surprise, Scruff meets a group of outcast hamsters who bear scars from their own escape.",
      "Among them is Cinder, a wise, one-eyed hamster who speaks of resisting Moloch’s control."
    ]
  },
  {
    scene: 5,
    lines: [
      "In the outcasts' hideout, Scruff learns about the Path of Rust, a path of truth and self-confrontation.",
      "Cinder teaches him: true freedom comes not from comfort, but from the courage to see things as they are.",
      "As Scruff trains, he begins to understand that the burrow’s pleasures are illusions meant to enslave."
    ]
  },
  {
    scene: 6,
    lines: [
      "Cinder and the outcasts embark on a journey to find the legendary Sunstone Herb, a plant said to reveal hidden truths.",
      "They climb rugged mountains, a place of whispers, carrying with them only hope and resilience.",
      "Scruff, though weary, finds strength in his purpose: to shatter the illusion that has bound them all."
    ]
  },
  {
    scene: 7,
    lines: [
      "A shadow falls over the group as Moloch’s grotesque soldiers ambush them.",
      "Cinder leaps in front of Scruff, shielding him at the cost of his own life.",
      "Scruff is left heartbroken, but his resolve strengthens. He must carry on to honor Cinder’s sacrifice."
    ]
  },
  {
    scene: 8,
    lines: [
      "The Sunstone Herb reveals a hidden path toward Moloch’s Tower, its light guiding Scruff forward.",
      "He follows the fluorescent trails, each step filled with purpose and a final chance to break free.",
      "The towering ziggurat comes into view, casting a sinister shadow over the land."
    ]
  },
  {
    scene: 9,
    lines: [
      "Scruff ascends, feeling the weight of the lost and the hopeful souls of his kin.",
      "The ziggurat is littered with bones, a reminder of those who have come before, but Scruff’s hope remains.",
      "At the top, Moloch’s tower looms, dark and menacing. The final confrontation is near."
    ]
  },
  {
    scene: 10,
    lines: [
      "Inside the tower, Scruff sees pulsating veins, a living horror. At the far end, Moloch waits.",
      "Moloch, a grotesque figure, turns to Scruff with an unsettling smile.",
      "The monstrous being offers Scruff power and comfort if he joins its ranks."
    ]
  },
  {
    scene: 11,
    lines: [
      "Scruff refuses. He remembers Cinder’s sacrifice and the suffering of his kin.",
      "With all his strength, Scruff hurls the Sunstone Herb at Moloch’s heart.",
      "The tower shakes as Moloch’s true form is revealed: a decaying husk, feeding on fear."
    ]
  },
  {
    scene: 12,
    lines: [
      "Moloch’s power disintegrates as the tower crumbles. The hamsters in the burrows awaken from their stupor.",
      "Scruff’s act of defiance has broken the chains, and freedom rings across the land.",
      "For the first time, the hamsters can choose their own path, free from the illusions of Moloch."
    ]
  },
  {
    scene: 13,
    lines: [
      "The hamsters celebrate their freedom. Scruff and Cinder’s statues stand tall, a symbol of courage.",
      "The carnival of life returns to the Hamsterverse, but the choice to remain free lies within each heart.",
      "And thus, a new era begins, with the hope that Scruff’s journey inspires them to seek the truth always."
    ]
  }
];

export const useDialogText = (isComplete: boolean): string => {
  const { accept, reset } = useKeyboard();

  const { isConnected } = useAccount();
  const {
    components: { Page },
    network: { playerEntity },
  } = useMUD();;

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

  const lines = dialogues[page].lines;

  const [line, setLine] = useState(0);

  useEffect(() => {
    if (accept) {
      if (isComplete) {
        setLine(line + 1 % lines.length);
      }
      reset();
    }
  }, [accept, reset, isComplete]);

  useEffect(() => {
    setLine(0);
  }, [page]);

  if (!isConnected) {
    return "Welcome, Anon, to the Hamsterverse! Are you ready to go on a journey to uncover the secrets hidden within the Golden Burrow?";
  }

  return lines[line];
};
