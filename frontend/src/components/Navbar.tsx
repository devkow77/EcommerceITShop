"use client";

import { Link, useNavigate } from "react-router-dom";
import { Container, Profile } from "./index";
import {
  Heart,
  LaptopMinimal,
  Store,
  Package,
  Truck,
  MessageSquare,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import { ShoppingBag } from "@/components/shopping/index";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Navbar = () => {
  const desktop = useMediaQuery("(min-width: 768px)");

  return (
    <nav className="border-b-2 shadow-md dark:shadow-none">
      <TopBaner />
      <Container className="space-y-4 py-4">
        <MainContent />
        {desktop ? <DesktopBottomNavbar /> : <MobileBottomNavbar />}
      </Container>
    </nav>
  );
};

const TopBaner = () => {
  interface Info {
    icon: React.ReactNode;
    text: string;
  }

  const text: Info[] = [
    {
      icon: <Store />,
      text: "Zaufany sklep technologiczny od lat",
    },
    {
      icon: <Package />,
      text: "Setki tysięcy zrealizowanych zamówień",
    },
    {
      icon: <Truck />,
      text: "Szybka realizacja i śledzenie przesyłek",
    },
    {
      icon: <MessageSquare />,
      text: "Wsparcie klienta na każdym etapie zakupu",
    },
  ];

  return (
    <div className="hidden bg-black px-4 py-3 text-white/80 md:block xl:px-8 dark:bg-white/10">
      <ul className="flex items-center justify-between text-xs">
        {text.map((info: Info, i: number) => (
          <li key={i} className="flex items-center gap-2">
            {info.icon} {info.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FavoritesButton = () => {
  const { favorites } = useFavorites();

  const count = favorites.length;

  return (
    <Link
      to="/favorites"
      className="relative px-4 py-2 duration-200 hover:bg-black/5 dark:hover:bg-white/10"
      title="Twoje ulubione produkty"
    >
      <Heart
        className={
          count > 0 ? "text-red-500" : "text-gray-500 dark:text-gray-300"
        }
        fill={count > 0 ? "currentColor" : "none"}
      />
      {count > 0 && (
        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
};

const MainContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    const timeout = setTimeout(async () => {
      try {
        const allCategoriesRes = await fetch("/api/products");
        const categoriesData = await allCategoriesRes.json();

        const allProducts: any[] = [];
        categoriesData.forEach((category: any) => {
          category.products.forEach((product: any) => {
            allProducts.push({
              ...product,
              category: {
                name: category.name,
                slug: category.slug,
              },
            });
          });
        });

        const filtered = allProducts
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 8); // Limit to 8 suggestions

        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: any) => {
    navigate(`/search?q=${encodeURIComponent(product.name)}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex gap-2 font-bold">
        <LaptopMinimal />
        <h1>IT Shop</h1>
      </Link>
      {/* Search Bar with Autocomplete */}
      <div className="relative hidden w-80 md:block">
        <Input
          placeholder="Czego szukasz?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
          onFocus={() => searchQuery && setShowSuggestions(true)}
        />
        {showSuggestions && (searchQuery.trim() || loadingSuggestions) && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {loadingSuggestions && (
              <div className="px-4 py-2 text-sm text-gray-500">
                Ładowanie...
              </div>
            )}
            {!loadingSuggestions && suggestions.length > 0
              ? suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className="flex cursor-pointer items-center gap-2 border-b px-4 py-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category.name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {(product.price / 100).toFixed(2)} zł
                    </p>
                  </div>
                ))
              : !loadingSuggestions && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Brak wyników dla "{searchQuery}"
                  </div>
                )}
          </div>
        )}
      </div>
      {/* Profile, Favourite Products, Cart */}
      <div className="flex items-center">
        <Profile />
        <FavoritesButton />
        <ShoppingBag />
      </div>
    </div>
  );
};

const DesktopBottomNavbar = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Błąd pobierania kategorii:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="hidden md:block">
      <ul className="flex flex-wrap items-center justify-center gap-x-2 text-sm font-semibold">
        {categories.map((category: Category) => (
          <li
            key={category.id}
            className="cursor-pointer px-4 py-2 duration-200 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Link to={`/products/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
        <li className="text-yellow-500">
          <Link to={`/reward`}>Nagroda</Link>
        </li>
      </ul>
    </div>
  );
};

export const MobileBottomNavbar = () => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <Menu />
      </div>
      <Input placeholder="Czego szukasz?" className="w-full" />
    </div>
  );
};

export default Navbar;
