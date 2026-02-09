import { Container, ProductCard, LoadingProductsView } from "@/components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

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
  const [view, setView] = useState<"grid-4" | "grid-3">("grid-4");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funkcja do pobierania dziennych promocji
    const handleFetchPromotions = async () => {
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
    const handleFetchProducts = async () => {
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

    handleFetchPromotions();
    handleFetchProducts();
  }, []);

  if (loading) {
    return <LoadingProductsView />;
  }

  return (
    <main className="space-y-16 py-12 md:py-16">
      <Container className="space-y-12 md:space-y-20">
        {promotions.length && (
          <article className="space-y-6">
            <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
              Okazje dnia!
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {promotions.map((product: Product, index: number) => (
                <ProductCard {...product} key={index} />
              ))}
            </div>
          </article>
        )}
        <article>
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">
              Produkty w sklepie
            </h2>
            <div className="flex items-center gap-x-2">
              <Button
                className={`${view == "grid-4" ? "bg-blue-600" : "bg-slate-500"} text-xs`}
                onClick={() => setView("grid-4")}
              >
                <LayoutGrid /> 4
              </Button>
              <Button
                className={`${view == "grid-3" ? "bg-blue-600" : "bg-slate-500"} text-xs`}
                onClick={() => setView("grid-3")}
              >
                <LayoutGrid /> 3
              </Button>
            </div>
          </div>
          <div className="space-y-12">
            {categories.map((category: Category, index: number) => (
              <section key={index} className="space-y-6">
                <div className="flex items-center gap-6">
                  <h3 className="text-lg font-semibold md:text-xl">
                    {category.name}
                  </h3>
                  <Link
                    className="text-sm italic opacity-60"
                    to={`/products/${category.slug}`}
                  >
                    Zobacz wszystkie {category.name.toLowerCase()}
                  </Link>
                </div>
                {category.products.length ? (
                  <div
                    className={`grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 ${view == "grid-4" ? "lg:grid-cols-4" : ""}`}
                  >
                    {category.products.map((product, index: number) => (
                      <ProductCard {...product} key={index} />
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

export default Home;
