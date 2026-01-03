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

const formSchema = z
  .object({
    username: z.string().min(4, {
      message: "Użytkownik musi mieć min. 4 znaki.",
    }),
    email: z.string().email({
      message: "Podaj poprawny adres email.",
    }),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message:
        "Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.",
    }),
    repeatPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        path: ["repeatPassword"],
        message: "Hasła muszą być identyczne",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setServerError(null);
    setServerSuccess(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            setServerError("Wszystkie pola są wymagane");
            break;
          case 409:
            setServerError("Konto z tym emailem już istnieje");
            break;
          case 500:
            setServerError("Wewnętrzny błąd serwera");
            break;
          default:
            setServerError("Nieznany błąd");
        }
      } else {
        setServerSuccess("Pomyślnie utworzono nowe konto!");
      }
      form.reset();
    } catch (err) {
      console.error("Błąd rejestracji:", err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz nazwę użytkownika..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input
                  placeholder="Podaj hasło..."
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Powtórz hasło</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj ponownie hasło..."
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant={"success"}>
            Utwórz nowe konto
          </Button>
          {serverSuccess && <p className="text-green-600">{serverSuccess}</p>}
          {serverError && <p className="text-red-600">{serverError}</p>}
        </div>
        <div className="mt-4 md:mt-8">
          Masz już konto?{" "}
          <Link to="/login" className="font-semibold">
            Zaloguj się
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
