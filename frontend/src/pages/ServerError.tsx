import { Container } from "@/components";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <section className="flex h-screen items-center justify-center">
      <Container className="max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <AlertTriangle className="h-24 w-24 text-red-600 dark:text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
          500
        </h1>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Błąd serwera
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Przepraszamy, serwer napotkał nieoczekiwany błąd. Prosimy spróbować
          ponownie za chwilę lub skontaktować się z zespołem wsparcia.
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
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            Odśwież stronę
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServerError;
