'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Highlight, themes } from 'prism-react-renderer';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  network: z.string({
    required_error: 'Please select a network',
  }),
  contractAddress: z.string().min(42, {
    message: 'Please enter a valid contract address',
  }),
  contractABI: z.string().min(2, {
    message: 'Please provide the contract ABI',
  }),
  selectedFunction: z.string({
    required_error: 'Please select a function',
  }),
  frequency: z.enum(['hourly', 'daily', 'weekly'], {
    required_error: 'Please select a frequency',
  }),
  duration: z.number().min(1, {
    message: 'Duration must be at least 1 execution',
  }),
});

const codeBlock = `
export default async (context: ShamanContext) => {
  const { fetch } = context;
  const response = await fetch('https://coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_by_total_volume&per_page=100&page=1&sparkline=false&price_change_percentage=24h&locale=en');
  const data = await response.json();

  return data;
}
`;

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      network: '',
      contractAddress: '',
      contractABI: '',
      selectedFunction: '',
      frequency: 'daily',
      duration: 1,
    },
  });

  const duration = form.watch('duration');

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
                  <BreadcrumbLink href="/new">Build Your Shaman</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Launch</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 h-full">
            <div className="flex flex-col gap-4 h-full p-2 pt-4">
              <Card className="flex-1 shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle>Your Shaman</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <Highlight
                    theme={themes.jettwaveLight}
                    code={codeBlock}
                    language="tsx">
                    {({ style, tokens, getLineProps, getTokenProps }) => (
                      <pre className="overflow-auto w-full p-4" style={style}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </CardContent>
                <CardFooter className="flex justify-end mt-auto">
                  <Button className="w-full">
                    Test Execute (will cost 1 $ZUG)
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a network" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contractAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contractABI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract ABI</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your contract ABI here"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="selectedFunction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Function</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a function" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="function1">Function 1</SelectItem>
                          <SelectItem value="function2">Function 2</SelectItem>
                          <SelectItem value="function3">Function 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Executions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading
                    ? 'Deploying...'
                    : `Deploy Shaman (will cost ${duration || 0} $ZUG)`}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
