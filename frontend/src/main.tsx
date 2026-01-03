import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/index.ts";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider defaultTheme="light">
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  </AuthProvider>,
);
