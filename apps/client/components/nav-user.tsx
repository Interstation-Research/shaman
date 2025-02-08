'use client';

import { ChevronsUpDown, LogOut, Sparkles, Wallet } from 'lucide-react';
import BoringAvatar from 'boring-avatars';
import {
  useFundWallet,
  usePrivy,
  WalletWithMetadata,
} from '@privy-io/react-auth';
import { useState } from 'react';
import { Chain, formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useWalletDelegation } from '@/hooks/use-wallet-delegation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { trimHash } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMUD } from '@/contexts/mud-context';
import { useZugBalance } from '@/hooks/use-zug-balance';
import { chain } from '@/mud/supportedChains';

export function NavUser() {
  const mud = useMUD();
  const { isMobile } = useSidebar();
  const { fundWallet } = useFundWallet();
  const { user, login, logout } = usePrivy();
  const embeddedWallet = user?.linkedAccounts?.find(
    (account) =>
      account.type === 'wallet' && account.connectorType === 'embedded'
  ) as WalletWithMetadata;
  const address = embeddedWallet?.address;
  const [loading, setLoading] = useState(false);
  const { data: zugBalance } = useZugBalance(address as `0x${string}`);
  const [quantity, setQuantity] = useState(0);
  const [price] = useState(0n);

  useWalletDelegation();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await mud?.calls.embedded?.systemCalls?.purchase(BigInt(quantity));

      toast({
        title: 'Success',
        description: 'Purchase successful.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            {user ? (
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <BoringAvatar name={address} variant="beam" />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {trimHash(address)}
                    </span>
                    <span className="truncate text-xs">
                      Balance: {zugBalance || 0} $ZUG
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                onClick={login}>
                <span className="truncate font-semibold">Connect Wallet</span>
              </SidebarMenuButton>
            )}
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <BoringAvatar name={address} variant="beam" />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {trimHash(address)}
                    </span>
                    <span className="truncate text-xs">
                      Balance: {zugBalance || 0} $ZUG
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    fundWallet(address || '', { chain: chain as Chain })
                  }>
                  <Wallet />
                  Fund Wallet
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles />
                    Buy $ZUG
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                <LogOut />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Purchase</DialogTitle>
          <DialogDescription>
            Each $ZUG is a Unit of Work. $ZUG is a utility token.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              type="number"
              className="col-span-3 text-right"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 items-center mb-4">
          <Label htmlFor="price" className="text-right">
            Total
          </Label>
          <p className="text-right mr-3">{formatEther(price)} ETH</p>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={handlePurchase} type="submit">
            {loading ? 'Confirming...' : 'Confirm Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
