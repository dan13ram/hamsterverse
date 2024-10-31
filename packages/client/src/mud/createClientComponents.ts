import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ components }: SetupNetworkResult) {
  return {
    ...components,
    Winner: overridableComponent(components.Winner),
    Player: overridableComponent(components.Player),
    Position: overridableComponent(components.Position),
  };
}
