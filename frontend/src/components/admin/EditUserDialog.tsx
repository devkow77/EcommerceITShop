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
  user: User;
  onSuccess: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

const formSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  email: z.string().email("Nieprawidłowy email"),
  role: z.enum(["USER", "ADMIN"], "Wybierz rolę użytkownika"),
  password: z.string().min(0).optional(), // Opcjonalne hasło, jeśli chcemy zmienić
});

type UserFormValues = z.infer<typeof formSchema>;

const EditUserDialog = ({ user, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema) as Resolver<UserFormValues>,
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    },
  });

  async function onSubmit(values: UserFormValues) {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Błąd aktualizacji użytkownika: ${data.message}`);
        return;
      }

      toast.success("Użytkownik zaktualizowany pomyślnie!", {
        position: "top-center",
      });

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Błąd aktualizacji użytkownika:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="yellow">Edytuj</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj użytkownika</DialogTitle>
          <DialogDescription>
            Edytuj dane użytkownika. Zmiany zostaną zapisane po potwierdzeniu.
          </DialogDescription>
        </DialogHeader>

        <Form<UserFormValues> {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Imię</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz imię użytkownika..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wpisz email użytkownika..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Rola</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="USER">Użytkownik</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nowe hasło (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Wpisz nowe hasło..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex justify-end">
              <Button type="submit" variant="success">
                Zapisz zmiany
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
