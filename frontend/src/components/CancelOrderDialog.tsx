import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CancelOrderDialogProps {
  orderId: number;
  onSuccess: () => void;
}

const CancelOrderDialog = ({ orderId, onSuccess }: CancelOrderDialogProps) => {
  const handleCancel = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const errorMsg = json.msg || "Nie udało się anulować zamówienia";
        toast.error(errorMsg);
        return;
      }

      toast.success("Zamówienie zostało anulowane", {
        position: "top-center",
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Błąd serwera");
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <X className="h-4 w-4" />
            Anuluj zamówienie
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="leading-6">
              Czy na pewno chcesz anulować to zamówienie?
            </DialogTitle>
            <DialogDescription>
              Operacja jest nieodwracalna. Po anulowaniu nie będziesz mógł
              przywrócić tego zamówienia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cofnij</Button>
            </DialogClose>
            <Button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Anuluj zamówienie
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CancelOrderDialog;
