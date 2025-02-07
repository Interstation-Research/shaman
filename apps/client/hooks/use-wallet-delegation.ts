'use client';

import { useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import type { WalletWithMetadata } from '@privy-io/react-auth';
import { useWallets, useHeadlessDelegatedActions } from '@privy-io/react-auth';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useWalletDelegation() {
  const { user } = usePrivy();
  const { ready, wallets } = useWallets();
  const { delegateWallet } = useHeadlessDelegatedActions();
  const retryCountRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup function to clear any pending timeouts
  useEffect(() => {
    const cleanup = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    return cleanup;
  }, []);

  useEffect(() => {
    const handleDelegation = async () => {
      // Don't proceed if basic requirements aren't met
      if (!user || !ready) return;

      try {
        // Find the embedded wallet to delegate
        const walletToDelegate = wallets.find(
          (wallet: { walletClientType: string }) =>
            wallet.walletClientType === 'privy'
        );

        // Check if already delegated
        const isAlreadyDelegated = !!user.linkedAccounts.find(
          (account): account is WalletWithMetadata =>
            account.type === 'wallet' && account.delegated
        );

        // If no wallet to delegate or already delegated, reset retry count and return
        if (!walletToDelegate || isAlreadyDelegated) {
          retryCountRef.current = 0;
          return;
        }

        // Attempt delegation
        await delegateWallet({
          address: walletToDelegate.address,
          chainType: 'ethereum',
        });

        // Success - reset retry count
        retryCountRef.current = 0;
      } catch (error) {
        // Only retry if we haven't exceeded max retries
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          // Set up retry with exponential backoff
          const delay = RETRY_DELAY * Math.pow(2, retryCountRef.current - 1);
          timeoutRef.current = setTimeout(() => {
            handleDelegation();
          }, delay);
        } else {
          // Silent fail after max retries
          retryCountRef.current = 0;
          console.warn('Wallet delegation failed after max retries', error);
        }
      }
    };

    // Start the delegation process in the next tick to avoid blocking
    Promise.resolve().then(handleDelegation);
  }, [user, ready, wallets, delegateWallet]);
}
