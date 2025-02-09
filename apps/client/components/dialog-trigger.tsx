'use client';

import { useState } from 'react';
import { DialogProps } from '@radix-ui/react-dialog';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { triggerShaman } from '@/services/api';
import { ShamanTriggerResponse } from '@/types/shaman';

export function DialogTrigger(props: DialogProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ShamanTriggerResponse | null>(null);
  const { shamanId } = useParams();

  const handleTrigger = async () => {
    setLoading(true);
    try {
      const response = await triggerShaman(shamanId as string);
      setResponse(response);

      toast({
        title: 'Success',
        description: 'Shaman triggered successfully.',
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
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trigger Shaman</DialogTitle>
          <DialogDescription>
            Are you sure you want to trigger this Shaman? This action will
            execute the Shaman&apos;s task.
          </DialogDescription>
        </DialogHeader>
        {response && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Response</h3>
            <pre className="mt-2 p-4 bg-gray-100 rounded-md">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
        <DialogFooter>
          <Button disabled={loading} onClick={handleTrigger} type="submit">
            {loading ? 'Triggering...' : 'Trigger Shaman'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
