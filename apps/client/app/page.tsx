'use client';

import { useAsciiText, alligator } from 'react-ascii-text';
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useShamans } from '@/hooks/use-shamans';

export default function Page() {
  const { data: shamans } = useShamans();
  const { user, login } = usePrivy();
  const asciiTextRef = useAsciiText({
    font: alligator,
    text: 'Shaman',
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {user ? (
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Card className="mb-4 flex flex-col min-h-[200px]">
                <CardHeader>
                  <CardTitle>Create New Shaman</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Automate and orchestrate your onchain workflows.</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/new">
                      <Plus />
                      Create Shaman
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              {shamans.map((shaman) => (
                <Card
                  key={shaman.shamanId}
                  className="mb-4 flex flex-col min-h-[200px]">
                  <CardHeader>
                    <CardTitle>{shaman.shamanId}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">ID:</span>
                        <span className="text-sm">
                          <code className="rounded-md bg-muted px-1 py-0.5 text-sm">
                            <span className="font-mono">{shaman.shamanId}</span>
                          </code>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          IPFS Manifest:
                        </span>
                        <span className="text-sm">
                          <code className="rounded-md bg-muted px-1 py-0.5 text-sm">
                            <span className="font-mono">
                              {shaman.metadataURI}
                            </span>
                          </code>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/shaman/${shaman.shamanId}`}>
                        <Eye />
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col p-4 w-full justify-center items-center">
              <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-sm">
                <pre
                  className="w-full"
                  ref={asciiTextRef as React.RefObject<HTMLPreElement>}></pre>
              </div>
              <p className="mt-6 text-center">
                Automate your onchain workflows with agentic intelligence.
              </p>
              <Button onClick={login} size="lg" className="mt-6">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
