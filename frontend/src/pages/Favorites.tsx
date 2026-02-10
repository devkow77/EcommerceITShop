import { Heart, Home, LogIn } from "lucide-react";
import { Container, ProductCard } from "@/components";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { user } = useAuth();

  // Jeśli użytkownik nie jest zalogowany, pokaż komunikat
  if (!user) {
    return (
      <section className="py-10">
        <Container className="space-y-8">
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 py-12 dark:border-gray-700">
            <LogIn className="h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-500">
              Musisz być zalogowany aby zobaczyć ulubione produkty
            </p>
            <div className="mt-4 flex gap-4">
              <Link to="/login">
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <LogIn className="h-4 w-4" />
                  Zaloguj się
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Powrót do sklepu
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Container className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
            <h1 className="text-3xl font-bold">Ulubione produkty</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Znaleziono {favorites.length} ulubiony
            {favorites.length !== 1 ? "ch" : "y"} produkt
            {favorites.length !== 1 ? "ów" : ""}
          </p>
        </div>

        {/* Results */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 py-12 dark:border-gray-700">
            <Heart className="h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-500">
              Nie masz jeszcze ulubionych produktów
            </p>
            <p className="text-sm text-gray-400">
              Dodaj produkty do ulubionych, klikając na serduszko
            </p>
            <Link to="/">
              <Button className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Home className="h-4 w-4" />
                Powrót do sklepu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard {...product} showFavorite={false} />
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-2 text-white transition-transform hover:scale-110"
                    title="Usuń z ulubionych"
                  >
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Favorites;
