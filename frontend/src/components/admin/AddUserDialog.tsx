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
  name: z.string().min(1, "Imię jest wymagane"),
  email: z.string().email("Nieprawidłowy email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  role: z.enum(["USER", "ADMIN"], "Wybierz rolę użytkownika"),
});

type UserFormValues = z.infer<typeof formSchema>;

const AddUserDialog = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema) as Resolver<UserFormValues>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  async function onSubmit(values: UserFormValues) {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Błąd dodania użytkownika: ${data.message}`);
        return;
      }

      toast.success("Użytkownik dodany pomyślnie!", { position: "top-center" });
      onSuccess();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Błąd dodania użytkownika:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-blue-600 px-4 py-2 text-sm text-white duration-200 hover:bg-blue-700">
        Dodaj użytkownika
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
          <DialogDescription>
            Dodaj nowego użytkownika do bazy danych. Wszystkie dane zostaną
            zapisane po potwierdzeniu.
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
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Wpisz hasło..."
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

            <div className="col-span-2 flex justify-end">
              <Button type="submit" variant="success">
                Dodaj użytkownika
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
