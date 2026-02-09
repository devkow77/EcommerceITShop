import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingBasket } from "lucide-react";

interface Props {
  category?: {
    name: string;
  };
  slug: string;
  imageUrl: string;
  name: string;
  discount: number;
  price: number;
}

const formatPrice = (priceInCents: number) =>
  (priceInCents / 100).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

const ProductCard = ({
  category,
  slug,
  imageUrl,
  name,
  discount,
  price,
}: Props) => {
  const categoryName = category?.name || "Nieznana kategoria";
  return (
    <Link
      to={`/products/${categoryName}/${slug}`}
      className="text-sm lg:text-base"
    >
      <div className="relative aspect-square">
        <img
          src={imageUrl}
          alt={name}
          className="absolute h-full w-full object-contain object-center"
        />
        <div className="absolute top-0 right-0 rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white md:text-sm">
          -30%
        </div>
      </div>
      <div className="space-y-2 py-2 lg:space-y-3">
        <h3 className="truncate font-bold">{name}</h3>
        {discount > 0 && <span>{formatPrice(price)}</span>}
        <div className="flex items-center gap-x-2">
          <p className="text-yellow-600">{formatPrice(discount)}</p>
          <p className="line-through opacity-60">{formatPrice(discount)}</p>
        </div>
        <Button
          variant="blue"
          className="flex items-center justify-center gap-x-2"
        >
          Do koszyka
          <ShoppingBasket />
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
