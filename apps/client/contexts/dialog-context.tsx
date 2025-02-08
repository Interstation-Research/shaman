'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DialogBuyZug } from '@/components/dialog-buy-zug';

export type Dialogs = {
  buyZug: boolean;
  openBuyZug: (open: boolean, redirect?: string) => void;
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
  const [redirect, setRedirect] = useState<string | undefined>(undefined);
  const router = useRouter();

  const openBuyZug = (open: boolean, redirectOnClose?: string) => {
    if (open && redirectOnClose) {
      setRedirect(redirectOnClose);
    }

    if (!open && redirect) {
      router.push(redirect);
      setRedirect(undefined);
    }

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
