'use client';

import { useState } from 'react';
import { DialogProps } from '@radix-ui/react-dialog';
// import { useParams } from 'next/navigation';
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

export function DialogTrigger(props: DialogProps) {
  const [loading, setLoading] = useState(false);
  // const { shamanId } = useParams();

  const handleTrigger = async () => {
    setLoading(true);
    try {
      // await mud?.calls.embedded?.systemCalls?.triggerShaman(shamanId as Hex);

      toast({
        title: 'Success',
        description: 'Shaman triggered successfully.',
      });

      props.onOpenChange?.(false);
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
        <DialogFooter>
          <Button disabled={loading} onClick={handleTrigger} type="submit">
            {loading ? 'Triggering...' : 'Trigger Shaman'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
