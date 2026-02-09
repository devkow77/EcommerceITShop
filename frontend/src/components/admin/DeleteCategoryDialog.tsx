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

interface DeleteCategoryProps {
  categoryId: number;
  onSuccess: () => void;
}

const DeleteCategoryDialog = ({
  categoryId,
  onSuccess,
}: DeleteCategoryProps) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json?.message || "Nie udało się usunąć kategorii");
        return;
      }

      toast.success("Kategoria została usunięta", { position: "top-center" });
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
              Czy na pewno chcesz usunąć tę kategorię?
            </DialogTitle>
            <DialogDescription>Operacja jest nieodwracalna.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button onClick={handleDelete}>Usuń kategorię</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
