'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DialogBuyZug } from '@/components/dialog-buy-zug';
import { DialogAddBalance } from '@/components/dialog-add-balance';
import { DialogWithdrawBalance } from '@/components/dialog-withdraw-balance';
import { DialogDelete } from '@/components/dialog-delete';
import { DialogTrigger } from '@/components/dialog-trigger';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectOnClose?: string;
  onSuccess?: () => void;
}

export type Dialogs = {
  buyZug: boolean;
  addBalance: boolean;
  withdrawBalance: boolean;
  delete: boolean;
  trigger: boolean;
  openBuyZug: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void
  ) => void;
  openAddBalance: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void
  ) => void;
  openWithdrawBalance: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void
  ) => void;
  openDelete: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void
  ) => void;
  openTrigger: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void
  ) => void;
};

const DialogContext = createContext<Dialogs>({
  buyZug: false,
  addBalance: false,
  withdrawBalance: false,
  delete: false,
  trigger: false,
  openBuyZug: () => {},
  openAddBalance: () => {},
  openWithdrawBalance: () => {},
  openDelete: () => {},
  openTrigger: () => {},
});

type Props = {
  children: ReactNode;
};

export const DialogContextProvider = ({ children }: Props) => {
  const [buyZug, setBuyZug] = useState(false);
  const [addBalance, setAddBalance] = useState(false);
  const [withdrawBalance, setWithdrawBalance] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [redirect, setRedirect] = useState<string | undefined>(undefined);
  const [onSuccess, setOnSuccess] = useState<() => void | undefined>();
  const [triggerDialog, setTriggerDialog] = useState(false);
  const router = useRouter();

  const handleDialogClose = (open: boolean) => {
    if (!open && redirect) {
      router.push(redirect);
      setRedirect(undefined);
    }
  };

  const openBuyZug = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
    }
    handleDialogClose(open);
    setBuyZug(open);
  };

  const openAddBalance = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
    }
    handleDialogClose(open);
    setAddBalance(open);
  };

  const openWithdrawBalance = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
    }
    handleDialogClose(open);
    setWithdrawBalance(open);
  };

  const openDelete = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
    }
    handleDialogClose(open);
    setDeleteDialog(open);
  };

  const openTrigger = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
    }
    handleDialogClose(open);
    setTriggerDialog(open);
  };

  return (
    <DialogContext.Provider
      value={{
        buyZug,
        addBalance,
        withdrawBalance,
        delete: deleteDialog,
        trigger: triggerDialog,
        openBuyZug,
        openAddBalance,
        openWithdrawBalance,
        openDelete,
        openTrigger,
      }}>
      {children}
      <DialogBuyZug
        open={buyZug}
        onOpenChange={openBuyZug}
        onSuccess={onSuccess}
      />
      <DialogAddBalance
        open={addBalance}
        onOpenChange={openAddBalance}
        onSuccess={onSuccess}
      />
      <DialogWithdrawBalance
        open={withdrawBalance}
        onOpenChange={openWithdrawBalance}
        onSuccess={onSuccess}
      />
      <DialogDelete
        open={deleteDialog}
        onOpenChange={openDelete}
        onSuccess={onSuccess}
      />
      <DialogTrigger
        open={triggerDialog}
        onOpenChange={openTrigger}
        onSuccess={onSuccess}
      />
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  return useContext(DialogContext);
};
