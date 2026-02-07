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
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  onSuccess: () => void;
  users: Array<{ id: number; name: string; email: string }>;
  products: Array<{ id: number; name: string; price: number }>;
}

type OrderFormValues = {
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
};

const AddOrderDialog = ({ onSuccess, users, products }: Props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<
    { productId: string; quantity: number; price: number }[]
  >([]);

  const form = useForm<OrderFormValues>({
    defaultValues: {
      userId: "",
      items: [],
      totalAmount: 0,
      status: "PENDING",
    },
  });

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find((p) => p.id === Number(value));
      newItems[index] = {
        ...newItems[index],
        productId: value,
        price: product?.price || 0,
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);

    // Przelicz totalAmount
    const total = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    form.setValue("totalAmount", total);
  };

  async function onSubmit(values: OrderFormValues) {
    try {
      const response = await fetch(`/api/admin/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(values.userId),
          items: items.map((item) => ({
            productId: Number(item.productId),
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: values.totalAmount,
          status: values.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`Błąd tworzenia zamówienia: ${data.message}`);
        toast.error("Błąd tworzenia zamówienia");
        return;
      }

      toast.success("Zamówienie utworzone pomyślnie!", {
        position: "top-center",
      });

      onSuccess();
      setOpen(false);
      setItems([]);
      form.reset();
    } catch (error) {
      console.error("Błąd tworzenia zamówienia:", error);
      toast.error("Błąd serwera");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Nowe zamówienie</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Utwórz nowe zamówienie</DialogTitle>
          <DialogDescription>
            Dodaj nowe zamówienie dla wybranego klienta
          </DialogDescription>
        </DialogHeader>

        <Form<OrderFormValues> {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Wybór użytkownika */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klient</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="">-- Wybierz klienta --</option>
                      {users.map((user) => (
                        <option key={user.id} value={String(user.id)}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pozycje zamówienia */}
            <div className="space-y-3 rounded border bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pozycje zamówienia</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  + Dodaj produkt
                </Button>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Kliknij "Dodaj produkt" aby dodać pozycję do zamówienia
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2 rounded border bg-white p-2"
                    >
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          handleItemChange(index, "productId", e.target.value)
                        }
                        className="flex-1 rounded border px-2 py-1 text-sm"
                      >
                        <option value="">-- Wybierz produkt --</option>
                        {products.map((product) => (
                          <option key={product.id} value={String(product.id)}>
                            {product.name} ({(product.price / 100).toFixed(2)}{" "}
                            zł)
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        className="w-20 rounded border px-2 py-1 text-sm"
                        placeholder="Ilość"
                      />

                      <div className="flex items-center rounded bg-gray-100 px-2 py-1 text-sm font-medium">
                        {((item.price * item.quantity) / 100).toFixed(2)} zł
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        Usuń
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kwota całkowita */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kwota całkowita (w groszach)</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        readOnly
                        className="w-full rounded border bg-gray-50 px-3 py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="PENDING">Oczekujące</option>
                        <option value="PAID">Opłacone</option>
                        <option value="SHIPPED">Wysłane</option>
                        <option value="COMPLETED">Ukończone</option>
                        <option value="CANCELED">Anulowane</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setItems([]);
                  form.reset();
                }}
              >
                Anuluj
              </Button>
              <Button type="submit" variant="success">
                Utwórz zamówienie
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderDialog;
