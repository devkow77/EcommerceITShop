"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  category: Category;
  onSuccess: () => void;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});
type CategoryFormValues = z.infer<typeof formSchema>;

const EditCategoryDialog = ({ category, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CategoryFormValues>,
    defaultValues: { name: category.name, slug: category.slug },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`Błąd aktualizacji kategorii: ${data.message}`);
        toast.error("Nie udało się zaktualizować kategorii");
        return;
      }

      toast.success("Kategoria zaktualizowana pomyślnie!");
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Błąd aktualizacji kategorii:", error);
      toast.error("Błąd serwera");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Edytuj</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj kategorię</DialogTitle>
          <DialogDescription>Zaktualizuj dane kategorii.</DialogDescription>
        </DialogHeader>
        <Form<CategoryFormValues> {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" variant={"success"}>
                Zapisz
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
