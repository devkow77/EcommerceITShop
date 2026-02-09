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

interface DeleteUserDialogProps {
  userId: number;
  onSuccess: () => void;
}

const DeleteUserDialog = ({ userId, onSuccess }: DeleteUserDialogProps) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Nie udało się usunąć użytkownika");
        return;
      }

      toast.success("Użytkownik został usunięty", {
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
              Czy na pewno chcesz usunąć tego użytkownika?
            </DialogTitle>
            <DialogDescription>Operacja jest nieodwracalna.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button onClick={handleDelete} variant="destructive">
              Usuń użytkownika
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DeleteUserDialog;
