import Asteroid from "../assets/asteroid.png";
import Asteroid2 from "../assets/asteroid2.png";

export enum TerrainType {
  TallGrass = 1,
  Boulder,
}

type TerrainConfig = {
  emoji: string;
};

export const terrainTypes: Record<TerrainType, TerrainConfig> = {
  [TerrainType.TallGrass]: {
    emoji: Asteroid2,
  },
  [TerrainType.Boulder]: {
    emoji: Asteroid,
  },
};
