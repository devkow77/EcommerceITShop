import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "@/components";
import { useShoppingCart } from "use-shopping-cart";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  discountedPrice: number;
  description: string;
  stock: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

const Product = () => {
  const { product } = useParams<{ product: string }>();
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useShoppingCart();

  useEffect(() => {
    if (!product) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${product}`);
        const data: Product = await res.json();
        setProductData(data);
      } catch (err) {
        console.error("Błąd pobierania produktu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product]);

  const formatPrice = (priceInCents: number) =>
    (priceInCents / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });

  const handleAddToCart = () => {
    if (!productData) return;

    try {
      addItem({
        id: String(productData.id),
        name: productData.name,
        price: productData.discountedPrice,
        image: productData.imageUrl,
        currency: "PLN",
      });
      toast.success(`${productData.name} dodany do koszyka!`, {
        position: "top-center",
      });
    } catch (err) {
      console.error("Błąd przy dodawaniu do koszyka:", err);
      toast.error("Nie udało się dodać do koszyka", { position: "top-center" });
    }
  };

  if (loading) return <p className="py-10 text-center">Ładowanie...</p>;
  if (!productData)
    return <p className="py-10 text-center">Produkt nie znaleziony</p>;

  return (
    <section className="py-10">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex justify-center">
          <img
            src={productData.imageUrl}
            alt={productData.name}
            className="max-w-md"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{productData.name}</h1>
          <p className="text-gray-500">
            Kategoria: {productData.category.name}
          </p>

          <div className="flex items-baseline gap-4">
            {productData.discount > 0 && (
              <span className="text-gray-400 line-through">
                {formatPrice(productData.price)}
              </span>
            )}
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(productData.discountedPrice)}
            </span>
          </div>

          <p className="text-gray-700">{productData.description}</p>

          <p className="text-sm text-gray-500">
            {productData.stock > 0
              ? `Dostępny: ${productData.stock} szt.`
              : "Brak w magazynie"}
          </p>

          <button
            disabled={productData.stock === 0}
            onClick={handleAddToCart}
            className="mt-4 w-full rounded-lg bg-gray-900 py-2 text-white transition-colors hover:bg-gray-700 disabled:opacity-40"
          >
            Do koszyka
          </button>
        </div>
      </Container>
    </section>
  );
};

export default Product;
