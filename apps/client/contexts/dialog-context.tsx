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
  shamanId?: string;
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
    onSuccess?: () => void,
    shamanId?: string
  ) => void;
  openAddBalance: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => void;
  openWithdrawBalance: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => void;
  openDelete: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => void;
  openTrigger: (
    open: boolean,
    redirect?: string,
    onSuccess?: () => void,
    shamanId?: string
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
  const [shamanId, setShamanId] = useState<string | undefined>(undefined);
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
    onSuccess?: () => void,
    shamanId?: string
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
      setShamanId(shamanId);
    }
    handleDialogClose(open);
    setBuyZug(open);
  };

  const openAddBalance = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
      setShamanId(shamanId);
    }
    handleDialogClose(open);
    setAddBalance(open);
  };

  const openWithdrawBalance = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
      setShamanId(shamanId);
    }
    handleDialogClose(open);
    setWithdrawBalance(open);
  };

  const openDelete = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
      setShamanId(shamanId);
    }
    handleDialogClose(open);
    setDeleteDialog(open);
  };

  const openTrigger = (
    open: boolean,
    redirectOnClose?: string,
    onSuccess?: () => void,
    shamanId?: string
  ) => {
    if (open) {
      setRedirect(redirectOnClose);
      setOnSuccess(onSuccess);
      setShamanId(shamanId);
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
        shamanId={shamanId}
      />
      <DialogWithdrawBalance
        open={withdrawBalance}
        onOpenChange={openWithdrawBalance}
        onSuccess={onSuccess}
        shamanId={shamanId}
      />
      <DialogDelete
        open={deleteDialog}
        onOpenChange={openDelete}
        onSuccess={onSuccess}
        shamanId={shamanId}
      />
      <DialogTrigger
        open={triggerDialog}
        onOpenChange={openTrigger}
        onSuccess={onSuccess}
        shamanId={shamanId}
      />
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  return useContext(DialogContext);
};
