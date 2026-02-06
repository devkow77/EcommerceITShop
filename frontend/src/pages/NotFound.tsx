import { Container } from "@/components";
import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="flex h-screen items-center justify-center">
      <Container className="max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <AlertCircle className="h-24 w-24 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Strona nie znaleziona
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Przepraszamy, ale strona, którą szukasz, nie istnieje lub została
          przeniesiona.
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

export default NotFound;