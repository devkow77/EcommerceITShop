import { useNavigate } from "react-router-dom";
import { Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center gap-4 px-6 py-16">
      <Lock className="text-yellow-500" strokeWidth={1.5} size={60} />
      <h1 className="text-4xl font-bold md:text-6xl">403</h1>
      <h2>Brak dostępu</h2>
      <p className="text-center text-sm leading-6 md:text-base">
        Nie masz uprawnień, aby uzyskać dostęp do tej strony. Jeśli uważasz, że
        to jest błąd, skontaktuj się z administratorem.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button
          variant="blue"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Powrót do strony głównej
        </Button>
        <Button
          variant="red"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          Wróć wstecz
        </Button>
      </div>
    </section>
  );
};

export default Forbidden;
