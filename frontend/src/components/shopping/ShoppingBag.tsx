import { ShoppingBasket } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";

const ShoppingBag = () => {
  const { handleCartClick, cartCount } = useShoppingCart();

  return (
    <div onClick={handleCartClick} className="relative cursor-pointer">
      <ShoppingBasket />
      <div className="absolute -bottom-3 left-4 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
        {cartCount}
      </div>
    </div>
  );
};

export default ShoppingBag;
