import * as React from 'react';

import { Button } from './ui/button';
import { TokenBalance } from './token-balance';
import { Separator } from './ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: 'Your Shamans',
      url: '#',
      items: [
        {
          title: 'Zug Zug',
          url: '#',
          isActive: true,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="scroll-m-20 text-center text-lg tracking-tight my-2">
          Shaman
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <TokenBalance />
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupContent>
            <Button className="w-full">New Shaman</Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto">
        <Separator />
        <SidebarGroup>
          <SidebarGroupContent>
            <Button className="w-full">Connect Wallet</Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
