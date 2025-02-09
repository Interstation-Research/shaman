'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Hex } from 'viem';
import { DialogProps } from '@/contexts/dialog-context';
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
import { useMUD } from '@/contexts/mud-context';

export function DialogDelete(props: DialogProps) {
  const mud = useMUD();
  const [loading, setLoading] = useState(false);
  const { shamanId: shamanIdParam } = useParams();
  const shamanId = props.shamanId || shamanIdParam;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await mud?.calls.embedded?.systemCalls?.deleteShaman(shamanId as Hex);

      toast({
        title: 'Success',
        description: 'Shaman deleted successfully.',
      });

      props.onSuccess?.();
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
          <DialogTitle>Delete Shaman</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Shaman? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
            type="submit">
            {loading ? 'Deleting...' : 'Delete Shaman'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
