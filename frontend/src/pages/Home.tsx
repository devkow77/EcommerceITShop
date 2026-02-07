import { Container } from "@/components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number; // w groszach
  discount: number; // procent rabatu
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
    <main className="space-y-16 py-10">
      <Container className="space-y-12">
        {promotions.length && (
          <article className="space-y-6">
            <h2 className="mb-10 text-center text-3xl font-bold">
              Okazje dnia!
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {promotions.map((product: Product, index: number) => (
                <Link
                  key={index}
                  to={`/products/${product.category.name}/${product.slug}`}
                >
                  <div className="relative aspect-square bg-black dark:bg-white/60">
                    <div className="absolute top-0 right-0 bg-yellow-600 px-3 py-1 text-sm font-semibold text-white">
                      -30%
                    </div>
                  </div>
                  <div className="space-y-2 py-2">
                    <h3 className="truncate font-bold">{product.name}</h3>
                    {product.discount > 0 && (
                      <span>{formatPrice(product.price)}</span>
                    )}
                    <p>{formatPrice(product.discount)}</p>
                    <Button className="flex w-full items-center justify-center gap-x-2 bg-blue-500 px-4 py-2 text-sm font-semibold text-white duration-200 hover:bg-blue-700">
                      Do koszyka
                      <ShoppingBasket />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        )}
        <article>
          <h2 className="mb-10 text-3xl font-bold">Produkty w sklepie</h2>
          <div className="space-y-12">
            {categories.map((category: Category, index: number) => (
              <section key={index} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <Link
                    className="text-sm italic opacity-60"
                    to={`/products/${category.slug}`}
                  >
                    Zobacz wszystkie {category.name.toLowerCase()}
                  </Link>
                </div>
                {category.products.length ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    {category.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${category}/${product.slug}`}
                      >
                        <div className="relative aspect-square bg-black dark:bg-white/60">
                          <div className="absolute top-0 right-0 bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                            -10%
                          </div>
                        </div>
                        <div className="space-y-2 py-2">
                          <h3 className="truncate font-bold">{product.name}</h3>
                          {product.discount > 0 && (
                            <span>{formatPrice(product.price)}</span>
                          )}
                          <p>{formatPrice(product.discount)}</p>
                          <Button className="flex w-full items-center justify-center gap-x-2 bg-blue-500 px-4 py-2 text-sm font-semibold text-white duration-200 hover:bg-blue-700">
                            Do koszyka
                            <ShoppingBasket />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>Aktualnie brak produktów w tej kategorii.</p>
                )}
              </section>
            ))}
          </div>
        </article>
      </Container>
    </main>
  );
};

//   <div>
//     {product.discount > 0 && (
//       <div>-{product.discount}%</div>
//     )}
//     <img
//       src={product.imageUrl}
//       alt={product.name}
//       className="aspect-square object-cover"
//     />
//     <h3>{product.name}</h3>
//     <div>
//       {product.discount > 0 && (
//         <span>{formatPrice(product.price)}</span>
//       )}
//       <span>{formatPrice(product.discountedPrice)}</span>
//     </div>
//     <Button className="w-full bg-blue-500">
//       Do koszyka
//     </Button>
//   </div>

export default Home;
