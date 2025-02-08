import { useComponentValue } from '@latticexyz/react';
import { Component, Type } from '@latticexyz/recs';
import { SyncStep } from '@latticexyz/store-sync';
import { singletonEntity } from '@latticexyz/store-sync/recs';

import { useMUD } from '@/contexts/mud-context';

type SyncProgressComponent = Component<
  {
    step: Type.String;
    message: Type.String;
    percentage: Type.Number;
    latestBlockNumber: Type.BigInt;
    lastBlockNumberProcessed: Type.BigInt;
  },
  { componentName: string },
  unknown
>;

export const useMUDProgress = () => {
  const defaultProgress = {
    message: 'Connecting',
    percentage: 0,
    step: SyncStep.INITIALIZE,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  };
  const mud = useMUD();

  const syncProgressComponent = mud?.components?.SyncProgress as
    | SyncProgressComponent
    | undefined;

  const progress = useComponentValue(
    syncProgressComponent || ({} as SyncProgressComponent),
    singletonEntity,
    defaultProgress
  );

  return {
    progress,
  };
};
