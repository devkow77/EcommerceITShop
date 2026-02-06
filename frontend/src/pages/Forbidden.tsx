import { Container } from "@/components";
import { useNavigate } from "react-router-dom";
import { Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <section className="flex h-screen items-center justify-center">
      <Container className="max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <Lock className="h-24 w-24 text-yellow-600 dark:text-yellow-500" strokeWidth={1.5} />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
          403
        </h1>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Brak dostępu
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Nie masz uprawnień, aby uzyskać dostęp do tej strony. Jeśli uważasz,
          że to jest błąd, skontaktuj się z administratorem.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Powrót do strony głównej
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            Wróć wstecz
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Forbidden;