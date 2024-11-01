import { useEffect, useState, useCallback } from "react";
import { useMUD } from "../contexts/MUDContext";
import { Direction } from "../utils/direction";
import { useComponentValue } from "@latticexyz/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";


export const useKeyboard = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const [accept, setAccept] = useState(false);

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

  const position = useComponentValue(Position, playerEntity);

  const movable = useComponentValue(Movable, playerEntity);

  const move = useCallback(debounce(moveSystemCall, 100), [moveSystemCall]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      e.preventDefault();
      if (movable?.value === false) {
        return;
      }
      if (e.key === "w") {
        move(Direction.North);
      }
      if (e.key === "s") {
        move(Direction.South);
      }
      if (e.key === "a") {
        move(Direction.West);
      }
      if (e.key === "d") {
        move(Direction.East);
      }
      if (e.key === "Enter") {
        setAccept(true);
        if (!isConnected) {
          openConnectModal?.();
        }
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move, position, isConnected, openConnectModal]);

  const reset = useCallback(() => {
    setAccept(false);
  }, []);

  return {
    accept,
    reset,
  };
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
