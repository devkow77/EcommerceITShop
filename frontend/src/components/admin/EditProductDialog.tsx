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
  product: Product;
  onSuccess: () => void;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  discount: number;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  categoryId: number;
}

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.coerce.number().min(0),
  description: z.string(),
  discount: z.coerce.number().min(0).optional(),
  imageUrl: z.string(),
  stock: z.coerce.number().min(0),
  isAvailable: z.coerce.boolean(),
  categoryId: z.coerce.number(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const EditProductDialog = ({ product, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description,
      discount: product.discount ?? 0,
      imageUrl: product.imageUrl,
      stock: product.stock,
      isAvailable: product.isAvailable,
      categoryId: product.categoryId,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`Blad aktualizacji produktu: ${data.message}`);
        return;
      }

      toast.success("Produkt zaktualizowany pomyślnie!", {
        position: "top-center",
      });

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Błąd aktualizacji produktu:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="yellow">Edytuj</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj produkt</DialogTitle>
          <DialogDescription>
            Edytuj dane produktu. Zmiany zostaną zapisane po potwierdzeniu.
          </DialogDescription>
        </DialogHeader>
        <Form<ProductFormValues> {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz nazwę produktu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz slug produktu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cena (gr)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Wpisz cenę produktu..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upust (procenty)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Wpisz upust produktu..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz opis produktu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zdjęcie</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wpisz URL zdjęcia produktu..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stan magazynowy</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Wpisz stan magazynowy..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel>Dostępny</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wpisz kategorię produktu..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" variant={"success"}>
                Edytuj produkt
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
