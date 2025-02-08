'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DialogBuyZug } from '@/components/dialog-buy-zug';
import { DialogAddBalance } from '@/components/dialog-add-balance';
import { DialogWithdrawBalance } from '@/components/dialog-withdraw-balance';

export type Dialogs = {
  buyZug: boolean;
  addBalance: boolean;
  withdrawBalance: boolean;
  openBuyZug: (open: boolean, redirect?: string) => void;
  openAddBalance: (open: boolean, redirect?: string) => void;
  openWithdrawBalance: (open: boolean, redirect?: string) => void;
};

const DialogContext = createContext<Dialogs>({
  buyZug: false,
  addBalance: false,
  withdrawBalance: false,
  openBuyZug: () => {},
  openAddBalance: () => {},
  openWithdrawBalance: () => {},
});

type Props = {
  children: ReactNode;
};

export const DialogContextProvider = ({ children }: Props) => {
  const [buyZug, setBuyZug] = useState(false);
  const [addBalance, setAddBalance] = useState(false);
  const [withdrawBalance, setWithdrawBalance] = useState(false);
  const [redirect, setRedirect] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleDialogClose = (open: boolean) => {
    if (!open && redirect) {
      router.push(redirect);
      setRedirect(undefined);
    }
  };

  const openBuyZug = (open: boolean, redirectOnClose?: string) => {
    if (open && redirectOnClose) {
      setRedirect(redirectOnClose);
    }
    handleDialogClose(open);
    setBuyZug(open);
  };

  const openAddBalance = (open: boolean, redirectOnClose?: string) => {
    if (open && redirectOnClose) {
      setRedirect(redirectOnClose);
    }
    handleDialogClose(open);
    setAddBalance(open);
  };

  const openWithdrawBalance = (open: boolean, redirectOnClose?: string) => {
    if (open && redirectOnClose) {
      setRedirect(redirectOnClose);
    }
    handleDialogClose(open);
    setWithdrawBalance(open);
  };

  return (
    <DialogContext.Provider
      value={{
        buyZug,
        addBalance,
        withdrawBalance,
        openBuyZug,
        openAddBalance,
        openWithdrawBalance,
      }}>
      {children}
      <DialogBuyZug open={buyZug} onOpenChange={openBuyZug} />
      <DialogAddBalance open={addBalance} onOpenChange={openAddBalance} />
      <DialogWithdrawBalance
        open={withdrawBalance}
        onOpenChange={openWithdrawBalance}
      />
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  return useContext(DialogContext);
};
