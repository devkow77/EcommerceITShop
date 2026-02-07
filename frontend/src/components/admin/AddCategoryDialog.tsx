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
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const AddCategoryDialog = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CategoryFormValues>,
    defaultValues: { name: "", slug: "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`Błąd dodania kategorii: ${data.message}`);
        toast.error("Nie udało się dodać kategorii");
        return;
      }

      toast.success("Kategoria dodana pomyślnie!");
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Błąd dodania kategorii:", error);
      toast.error("Błąd serwera");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-blue-600 px-4 py-2 text-sm text-white duration-200 hover:bg-blue-700">
        Dodaj kategorię
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nową kategorię</DialogTitle>
          <DialogDescription>Dodaj kategorię do bazy danych.</DialogDescription>
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
                    <Input placeholder="Nazwa kategorii" {...field} />
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
                    <Input placeholder="slug-kategorii" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" variant={"success"}>
                Dodaj kategorię
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
