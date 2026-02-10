"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useShoppingCart } from "use-shopping-cart";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash, ShoppingBasket } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ShoppingCard = () => {
  const {
    shouldDisplayCart,
    handleCartClick,
    cartCount = 0,
    cartDetails,
    totalPrice = 0,
    removeItem,
    incrementItem,
    clearCart,
  } = useShoppingCart();

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartDetails }), // Wysyłamy koszyk do Expressa
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Błąd serwera:", data.error);
        toast.error("Nie udało się przejść do płatności");
        return;
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (err) {
      console.log(`Błąd w płatności: ${err}`);
      toast.error("Błąd połączenia z serwerem");
    }
  };

  return (
    <Sheet open={shouldDisplayCart} onOpenChange={handleCartClick}>
      <SheetContent
        side={"right"}
        className="flex h-full w-1/2 flex-col justify-between p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Koszyk zakupowy</SheetTitle>
          <SheetDescription>
            Aktualnie masz {cartCount} przedmiotów w koszyku.
          </SheetDescription>
        </SheetHeader>
        {!cartCount && (
          <div>
            <section className="relative" />
            <section className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-6">
              <div className="flex w-full flex-col items-center">
                <ShoppingBasket size={40} />
                <h1 className="mt-4 mb-2 text-center text-lg font-extrabold">
                  Twój koszyk jest pusty!
                </h1>
                <p className="text-center text-sm">
                  Dodaj swój pierwszy produkt aby dokonać płatnosci.
                </p>
              </div>
            </section>
          </div>
        )}
        {Number(cartCount) > 0 && (
          <section className="h-75 overflow-y-auto pb-6">
            <div className="grid grid-cols-1 gap-8">
              {Object.values(cartDetails ?? {}).map((item, index) => (
                <div key={index}>
                  <div className="relative flex items-center gap-4">
                    <Link
                      to={`/products/${item.slug}`}
                      className="relative block aspect-square min-h-20 min-w-20"
                    >
                      <img
                        src={item.image as string}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="absolute h-full w-full rounded-2xl object-cover object-center"
                      />
                    </Link>
                    <div className="pr-8 text-sm">
                      <h2 className="font-bold">{item.name}</h2>
                      {item.introduction && (
                        <p className="my-2 text-sm text-slate-100 dark:text-slate-300">
                          {item.introduction.length > 75
                            ? `${item.introduction.substring(0, 75)}...`
                            : item.introduction}
                        </p>
                      )}
                      <h2 className="font-semibold">
                        {(Number(item.price) / 100).toFixed(2)} {item.currency}{" "}
                        |{" "}
                        <span className="text-blue-600">
                          Ilość sztuk: {item.quantity}
                        </span>
                      </h2>
                    </div>
                    <div className="absolute top-0 right-0 space-y-2">
                      <Trash
                        size={20}
                        className="cursor-pointer duration-200 hover:text-slate-400"
                        onClick={() => removeItem(item.id)}
                      />
                      <Plus
                        size={20}
                        className="cursor-pointer duration-200 hover:text-green-400"
                        onClick={() => incrementItem(item.id, { count: 1 })}
                      />
                      <Minus
                        size={20}
                        className="cursor-pointer duration-200 hover:text-red-600"
                        onClick={() => incrementItem(item.id, { count: -1 })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2>
            Ilośc produktów: <span className="font-semibold">{cartCount}</span>{" "}
            <br />
            Kwota:{" "}
            <span className="font-semibold">
              {Number(totalPrice) !== 0
                ? (Number(totalPrice) / 100).toFixed(2)
                : "0.00"}{" "}
              PLN
            </span>
          </h2>
          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={handleCheckout}
              disabled={cartCount === 0}
              className={`${cartCount == 0 ? "" : "bg-green-500 hover:bg-green-700"}`}
            >
              Zapłać teraz
            </Button>
            <Button
              onClick={clearCart}
              disabled={cartCount === 0}
              className={`${cartCount == 0 ? "" : "bg-red-500 hover:bg-red-700"}`}
            >
              Wyczyść koszyk
            </Button>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCard;
