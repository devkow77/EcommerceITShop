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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().email({
    message: "Podaj poprawny adres email.",
  }),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      "Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.",
  }),
});

const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "kacper@gmail.com",
      password: "Haslo12345.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            setServerError("Wszystkie pola są wymagane");
            break;
          case 401:
            setServerError(
              "Nie istnieje użytkownik o podanym adresie email lub nieprawidłowe dane logowania",
            );
            break;
          case 500:
            setServerError("Wewnętrzny błąd serwera");
            break;
          default:
            setServerError("Nieznany błąd");
        }
      } else {
        setUser(data.user);
        navigate("/");
      }

      form.reset();
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input placeholder="Podaj hasło..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant={"success"}>
            Zaloguj się
          </Button>
          {serverError && <p className="text-red-600">{serverError}</p>}
        </div>

        <div className="mt-4 md:mt-8">
          Nie masz konta?{" "}
          <Link to="/register" className="font-semibold">
            Załóż konto
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
