'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowRight, Zap } from 'lucide-react';
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
  BreadcrumbList,
  BreadcrumbPage,
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
  shamanName: z.string().min(2, {
    message: 'Shaman name must be at least 2 characters.',
  }),
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  network: z.enum(['ethereum', 'base', 'optimism', 'polygon', 'arbitrum'], {
    required_error: 'Please select a network',
  }),
  frequency: z.enum(['hourly', 'daily', 'weekly'], {
    required_error: 'Please select a frequency',
  }),
  duration: z.number().min(1, {
    message: 'Duration must be at least 1 execution',
  }),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [code, setCode] = useState('');
  const [ipfs, setIpfs] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shamanName: '',
      prompt: '',
      network: 'ethereum',
      frequency: 'daily',
      duration: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/shaman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shamanName: values.shamanName,
          prompt: values.prompt,
        }),
      });

      const json = await response.json();
      setCode(json.code);
      setIpfs(json.ipfs);

      toast({
        title: 'Success!',
        description: `Your Shaman has been created.`,
      });
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

  async function handleDeploy() {
    setIsDeploying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsDeploying(false);

    toast({
      title: 'Success!',
      description: 'Your Shaman has been deployed.',
    });
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
                  <BreadcrumbPage>New Shaman</BreadcrumbPage>
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
                      <FormLabel>Shaman Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your prompt here"
                          rows={12}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="base">Base</SelectItem>
                          <SelectItem value="optimism">Optimism</SelectItem>
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
                <CardContent className="flex-1 max-h-[70vh] min-h-0">
                  {code ? (
                    <div className="flex flex-col h-full overflow-y-auto">
                      <Highlight
                        theme={themes.jettwaveLight}
                        code={code}
                        language="tsx">
                        {({ style, tokens, getLineProps, getTokenProps }) => (
                          <pre
                            className="overflow-auto w-full p-4"
                            style={style}>
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                  <span
                                    key={key}
                                    {...getTokenProps({ token })}
                                  />
                                ))}
                              </div>
                            ))}
                          </pre>
                        )}
                      </Highlight>
                    </div>
                  ) : isLoading ? (
                    <div className="flex-1 flex h-full items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Generating code...
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex h-full items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        No code generated yet.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-end mt-auto space-x-3">
                  <Button
                    onClick={() => {
                      window.open(`https://ipfs.io/ipfs/${ipfs}`, '_blank');
                    }}
                    variant="secondary"
                    className="w-full"
                    disabled={!code}>
                    <Zap className="text-muted-foreground" />
                    Trigger
                  </Button>
                  <Button
                    onClick={handleDeploy}
                    className="w-full"
                    disabled={isDeploying || !code}>
                    {isDeploying ? 'Deploying...' : `Deploy`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
