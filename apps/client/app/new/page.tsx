'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowRight } from 'lucide-react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppSidebar } from '@/components/app-sidebar';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const formSchema = z.object({
  shamanName: z.string().min(2, {
    message: 'Shaman name must be at least 2 characters.',
  }),
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
});

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shamanName: '',
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log(values);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Success!',
        description: 'Your Shaman has been created.',
      });

      // Optionally, redirect to another page or reset the form
      form.reset();
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

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
                  <BreadcrumbLink href="#">Build Your Shaman</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Configure</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Launch</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 h-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="shamanName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shaman Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your shaman name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your prompt here"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Shaman Code'}
                  <ArrowRight />
                </Button>
              </form>
            </Form>
            <div className="flex flex-col gap-4 h-full p-2 pt-4">
              <Card className="flex-1 shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle>Your Shaman</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quos.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end mt-auto">
                  <Button className="w-full">Configure</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
