import { Container } from "@/components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number; // w groszach
  discount: number; // procent rabatu
  discountedPrice: number; // price po rabacie
  imageUrl: string;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

const Home = () => {
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const formatPrice = (priceInCents: number) =>
    (priceInCents / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });

  useEffect(() => {
    // Funkcja do pobierania dziennych promocji
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/products/promotions");
        const data: Product[] = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error("Błąd przy pobieraniu promocji:", error);
      } finally {
        setLoading(false);
      }
    };

    // Funkcja do pobierania produktow z kazdej kategorii
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/preview");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p>Ładowanie danych...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-10">
      <Container>
        {/* Sekcja promocji */}
        {promotions.length > 0 && (
          <Container>
            <section className="space-y-6">
              <h2 className="text-center text-3xl font-bold text-gray-900">
                Okazje Dnia
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                {promotions.map((product: Product, index: number) => (
                  <Link
                    to={`/products/${product.category.slug}/${product.slug}`}
                  >
                    <div
                      key={index}
                      className="group relative flex flex-col items-start rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="absolute -top-3 -right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                        {product.discount}%
                      </div>
                      <h3 className="mb-2 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                        {product.name}
                      </h3>
                      <div className="mt-auto flex flex-col">
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xl font-bold text-red-600">
                          {formatPrice(product.discountedPrice)}
                        </span>
                      </div>
                      <button className="mt-4 w-full rounded-lg bg-gray-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700">
                        Do koszyka
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </Container>
        )}
      </Container>
      {categories.map((category: Category, index: number) => (
        <Container key={index} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
          {category.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {category.products.map((product) => (
                <Link to={`/products/${category.slug}/${product.slug}`}>
                  <div
                    key={product.id}
                    className="group flex flex-col items-start rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md"
                  >
                    {product.discount > 0 && (
                      <div className="absolute -top-3 -right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                        -{product.discount}%
                      </div>
                    )}
                    <h3 className="mb-2 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex flex-col">
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    </div>
                    <button className="mt-4 w-full rounded-lg bg-gray-900 py-2 text-xs font-semibold text-white hover:bg-gray-700">
                      Do koszyka
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              Aktualnie brak produktów w tej kategorii.
            </p>
          )}
          <Link
            to={`/products/${category.slug}`}
            className="bg-blue-600 px-4 py-2 text-white"
          >
            Zobacz wszystkie {category.name}
          </Link>
        </Container>
      ))}
    </div>
  );
};

export default Home;
