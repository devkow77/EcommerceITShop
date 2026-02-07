"use client";

import { useState, useEffect } from "react";
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
  price: z.coerce.number().min(0),
  description: z.string(),
  discount: z.coerce.number().min(0).optional(),
  imageUrl: z.string().min(1, "Musisz przesłać zdjęcie produktu"),
  stock: z.coerce.number().min(0),
  isAvailable: z.coerce.boolean(),
  categoryId: z.coerce.number().min(1, "Musisz wybrać kategorię"),
});

type ProductFormValues = z.infer<typeof formSchema>;

const AddProductDialog = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      description: "",
      discount: 0,
      imageUrl: "",
      stock: 0,
      isAvailable: false,
      categoryId: 0,
    },
  });

  // Pobranie kategorii przy mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Błąd pobierania kategorii:", err));
  }, []);

  async function onSubmit(values: ProductFormValues) {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Błąd dodania produktu: ${data.message}`);
        return;
      }

      toast.success("Produkt dodany pomyślnie!");
      onSuccess();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Błąd dodania produktu:", error);
      toast.error("Błąd dodania produktu!");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-blue-600 px-4 py-2 text-sm text-white duration-200 hover:bg-blue-700">
        Dodaj produkt
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy produkt</DialogTitle>
          <DialogDescription>
            Dodaj nowy produkt do bazy danych. Wszystkie dane zostaną zapisane
            po potwierdzeniu.
          </DialogDescription>
        </DialogHeader>

        <Form<ProductFormValues> {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-4"
          >
            {/* Nazwa */}
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

            {/* Slug */}
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

            {/* Cena */}
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

            {/* Upust */}
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upust (%)</FormLabel>
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

            {/* Opis */}
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

            {/* Upload zdjęcia */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Adres URL zdjęcia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Wpisz adres URL zdjęcia produktu..."
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Podgląd"
                      className="mt-2 max-h-24 rounded border"
                    />
                  )}
                </FormItem>
              )}
            />

            {/* Stan magazynowy */}
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

            {/* Dostępność */}
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

            {/* Kategoria */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Kategoria</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full rounded border p-2">
                      <option value={0}>-- Wybierz kategorię --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="col-span-2 flex flex-wrap items-center gap-4">
              <Button type="submit" variant={"success"}>
                Dodaj produkt
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
