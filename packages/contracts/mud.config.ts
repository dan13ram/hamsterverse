import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    Direction: ["North", "East", "South", "West"],
  },
  tables: {
    MapConfig: {
      schema: {
        id: "bytes32",
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
      key: ["id"],
      codegen: {
        dataStruct: false,
      },
    },
    Movable: "bool",
    Winner: "bool",
    Player: "bool",
    Position: {
      schema: {
        id: "bytes32",
        x: "int32",
        y: "int32",
      },
      key: ["id"],
      codegen: {
        dataStruct: false,
      },
    },
    Page: "uint256",
  },
});
