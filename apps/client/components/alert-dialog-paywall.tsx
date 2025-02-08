import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDialogContext } from '@/contexts/dialog-context';

export function AlertDialogPaywall(props: AlertDialogProps) {
  const { openBuyZug } = useDialogContext();

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>$ZUG balance is required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to have a $ZUG balance to create a shaman.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => openBuyZug(true, '/')}>
            Buy $ZUG
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
