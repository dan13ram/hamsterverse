import { useEffect, useCallback } from "react";
import { useMUD } from "../contexts/MUDContext";
import { Direction } from "../utils/direction";
import { useComponentValue } from "@latticexyz/react";


export const useKeyboardMovement = () => {
  const {
    components: { MapConfig, Position, Movable },
    network: { playerEntity },
    systemCalls: { move: moveSystemCall },
  } = useMUD();;

  const mapConfig = useComponentValue(MapConfig, playerEntity);
  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  const { width, height } = mapConfig;

  const position = useComponentValue(Position, playerEntity);

  const movable = useComponentValue(Movable, playerEntity);

  const move = useCallback(debounce(moveSystemCall, 500), [moveSystemCall]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (movable?.value === false) {
        return;
      }
      if (e.key === "ArrowUp" || e.key === "w") {
        move(Direction.North);
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        if (position?.y === height - 1 && position?.x === width - 2) {
          console.log("win");
        }
        move(Direction.South);
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        move(Direction.West);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        move(Direction.East);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move, position]);
};

/**
 * Creates a debounced version of the input function.
 * 
 * @template T The type of the function to be debounced
 * @param func The function to debounce
 * @param wait The number of milliseconds to wait before executing the function
 * @param immediate Optional flag to execute the function immediately on the first call
 * @returns A debounced version of the input function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;

    // Clear previous timeout
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    // Determine if we should execute immediately
    const callNow = immediate && timeout === null;

    // Set a new timeout
    timeout = setTimeout(() => {
      // Reset timeout
      timeout = null;

      // Execute function if not immediate
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    // Execute immediately if specified
    if (callNow) {
      func.apply(context, args);
    }
  };
}
