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

interface DeleteOrderDialogProps {
  orderId: number;
  onSuccess: () => void;
}

const DeleteOrderDialog = ({ orderId, onSuccess }: DeleteOrderDialogProps) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Nie udało się usunąć zamówienia");
        return;
      }

      toast.success("Zamówienie zostało usunięte", {
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
          <Button variant="red">Usuń</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="leading-6">
              Czy na pewno chcesz usunąć to zamówienie?
            </DialogTitle>
            <DialogDescription>Operacja jest nieodwracalna.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button onClick={handleDelete}>Usuń zamówienie</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DeleteOrderDialog;
