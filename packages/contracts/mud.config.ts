import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  tables: {
    Shamans: {
      codegen: {
        dataStruct: false,
      },
      schema: {
        shamanId: "bytes32",
        creator: "address", // creator address
        active: "bool",
      },
      key: ["shamanId"],
    },
  },
});
