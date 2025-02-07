'use client';

import { ChevronsUpDown, LogOut, Sparkles } from 'lucide-react';
import BoringAvatar from 'boring-avatars';
import { usePrivy } from '@privy-io/react-auth';
import { Avatar } from '@/components/ui/avatar';
import { useWalletDelegation } from '@/hooks/use-wallet-delegation';
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
import { trimHash } from '@/lib/utils';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, login, logout } = usePrivy();
  useWalletDelegation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {user ? (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <BoringAvatar name={user.wallet?.address} variant="beam" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {trimHash(user.wallet?.address)}
                  </span>
                  <span className="truncate text-xs">Balance: 0 $ZUG</span>
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
                  <BoringAvatar name={user?.wallet?.address} variant="beam" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {trimHash(user?.wallet?.address)}
                  </span>
                  <span className="truncate text-xs">Balance: 0 $ZUG</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles />
                Buy $ZUG
              </DropdownMenuItem>
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
  );
}
