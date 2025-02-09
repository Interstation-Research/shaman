export type ShamanTriggerResponse = {
  success: boolean;
  decodedCode: string;
  result: string;
  timestamp: number;
  logMetadataHash: string;
  txHash: string;
  logs: string[];
};
