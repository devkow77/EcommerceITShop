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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderUser {
  id: number;
  name: string;
  email: string;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  stripeSession: string | null;
  status: string;
  createdAt: string;
  user: OrderUser;
  items: OrderItem[];
}

interface Props {
  order: Order;
  onSuccess: () => void;
}

const formSchema = z.object({
  status: z.string().min(1),
});

type OrderFormValues = z.infer<typeof formSchema>;

const EditOrderDialog = ({ order, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema) as Resolver<OrderFormValues>,
    defaultValues: {
      status: order.status,
    },
  });

  async function onSubmit(values: OrderFormValues) {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`Błąd aktualizacji zamówienia: ${data.message}`);
        toast.error("Błąd aktualizacji zamówienia");
        return;
      }

      toast.success("Zamówienie zaktualizowane pomyślnie!", {
        position: "top-center",
      });

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Błąd aktualizacji zamówienia:", error);
      toast.error("Błąd serwera");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="yellow">Edytuj</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj zamówienie #{order.id}</DialogTitle>
          <DialogDescription>Edytuj status zamówienia</DialogDescription>
        </DialogHeader>

        {/* Informacje o zamówieniu */}
        <div className="space-y-4 rounded bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Klient</p>
              <p className="font-medium">{order.user.name}</p>
              <p className="text-sm text-gray-600">{order.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kwota całkowita</p>
              <p className="text-lg font-medium">
                {(order.totalAmount / 100).toFixed(2)} zł
              </p>
            </div>
          </div>

          {/* Pozycje zamówienia */}
          <div>
            <p className="mb-2 text-sm font-medium">Pozycje zamówienia:</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.price / 100).toFixed(2)} zł
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formularz */}
        <Form<OrderFormValues> {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" variant="success">
              Zaktualizuj zamówienie
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
