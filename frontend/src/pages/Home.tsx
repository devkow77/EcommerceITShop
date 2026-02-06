import { Container } from "@/components";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  discount?: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/products/promotions"); // Twój endpoint Express
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Błąd przy pobieraniu promocji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div>
      <Container className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Globalne promocje</h2>

        {loading ? (
          <p>Ładowanie...</p>
        ) : products.length === 0 ? (
          <p>Brak promocji na dzisiaj</p>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            {products &&
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col items-start rounded border p-4 shadow"
                >
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p>
                    Cena:{" "}
                    <span className="line-through">{product.price} zł</span>{" "}
                    <span className="font-bold text-red-500">
                      {product.discountedPrice} zł
                    </span>{" "}
                    ({product.discount}% off)
                  </p>
                </div>
              ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
