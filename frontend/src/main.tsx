import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/index.ts";
import { CartProvider } from "use-shopping-cart";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <AuthProvider>
      <CartProvider
        mode="payment"
        cartMode="client-only"
        stripe={
          "pk_test_51Syyo2BWVTX929etENuOYzTwJCy6ldAi9v86WYxwfe8T1CQzwFsAYHcehtUKd6VOQfX3Ync1RmWcl1zKV52n1yBa00QbhjmChv" as string
        }
        successUrl="http://localhost:3000/payment/success"
        cancelUrl="http://localhost:3000/payment/cancel"
        currency="PLN"
        billingAddressCollection={true}
        shouldPersist={true}
      >
        <StrictMode>
          <App />
        </StrictMode>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>,
);
