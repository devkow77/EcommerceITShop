"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  newPassword: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      "Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.",
  }),
});

const ResetPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            setServerError(
              "Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.",
            );
            break;
          case 401:
            setServerError("Brak tokenu uwierzytelniającego");
            break;
          case 500:
            setServerError("Wewnętrzny błąd serwera");
            break;
          default:
            setServerError("Nieznany błąd");
        }
      } else {
        setServerMessage("Hasło zostało zmienione!");
      }
      form.reset();
    } catch (error) {
      console.error("Błąd resetowania hasła:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj nowe hasło..."
                  className="max-w-75"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant={"reset"}>
            Ustaw nowe hasło
          </Button>
          {serverError && <p className="text-red-600">{serverError}</p>}
          {serverMessage && <p className="text-green-600">{serverMessage}</p>}
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
