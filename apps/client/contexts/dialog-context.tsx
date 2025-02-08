'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { DialogBuyZug } from '@/components/dialog-buy-zug';

export type Dialogs = {
  buyZug: boolean;
  openBuyZug: (open: boolean) => void;
};

const DialogContext = createContext<Dialogs>({
  buyZug: false,
  openBuyZug: () => {},
});

type Props = {
  children: ReactNode;
};

export const DialogContextProvider = ({ children }: Props) => {
  const [buyZug, setBuyZug] = useState(false);

  const openBuyZug = (open: boolean) => {
    setBuyZug(open);
  };

  return (
    <DialogContext.Provider
      value={{
        buyZug,
        openBuyZug,
      }}>
      {children}
      <DialogBuyZug open={buyZug} onOpenChange={openBuyZug} />
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  return useContext(DialogContext);
};
