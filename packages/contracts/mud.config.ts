import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    LogType: ["Execution", "Deposit", "Withdraw", "Refund"],
    RoleType: ["None", "Operator"],
  },
  tables: {
    ShamanConfig: {
      codegen: {
        dataStruct: false,
      },
      schema: {
        tokenAddress: "address",
      },
      key: [],
    },
    Shamans: {
      codegen: {
        dataStruct: false,
      },
      schema: {
        shamanId: "bytes32",
        creator: "address",
        createdAt: "uint256",
        active: "bool",
        balance: "uint256", // track $SHAMAN token balance
        metadataURI: "string", // URL to JSON containing shaman name, prompt, and script
      },
      key: ["shamanId"],
    },
    ShamanLogs: {
      codegen: {
        dataStruct: false,
      },
      schema: {
        logId: "bytes32",
        logType: "LogType", // deposit (+) or execute (-)
        shamanId: "bytes32",
        amount: "uint256", // amount in $SHAMAN
        success: "bool",
        createdAt: "uint256",
      },
      key: ["logId"],
    },
    Roles: {
      schema: {
        sender: "address",
        role: "RoleType",
      },
      key: ["sender"],
    },
  },
});
