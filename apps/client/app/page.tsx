import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="mb-4 flex flex-col min-h-[200px]">
              <CardHeader>
                <CardTitle>Create New Shaman</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>Shamans are used to execute code on the Zug network.</p>
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
            <Card className="mb-4 flex flex-col min-h-[200px]">
              <CardHeader>
                <CardTitle>Zug</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">IPFS Manifest:</span>
                    <span className="text-sm">
                      <code className="rounded-md bg-muted px-1 py-0.5 text-sm">
                        <span className="font-mono">0x1234567890</span>
                      </code>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Network:</span>
                    <span className="text-sm">
                      <code className="rounded-md bg-muted px-1 py-0.5 text-sm">
                        <span className="font-mono">Arbitrum</span>
                      </code>
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/shaman">
                    <Eye />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
