import { Link } from "react-router-dom";
import { Container, Profile } from "./index";
import {
  Heart,
  ShoppingBasket,
  LaptopMinimal,
  Store,
  Package,
  Truck,
  MessageSquare,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

const MainContent = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex gap-2 font-bold">
        <LaptopMinimal />
        <h1>IT Shop</h1>
      </Link>
      {/* Search Bar */}
      <Input placeholder="Czego szukasz?" className="hidden w-80 md:block" />
      {/* Profile, Favourite Products, Cart */}
      <div className="flex items-center">
        <Profile />
        <div className="cursor-pointer px-4 py-2 duration-200 hover:bg-black/5 dark:hover:bg-white/10">
          <Heart />
        </div>
        <div className="cursor-pointer px-4 py-2 duration-200 hover:bg-black/5 dark:hover:bg-white/10">
          <ShoppingBasket />
        </div>
      </div>
    </div>
  );
};

const DesktopBottomNavbar = () => {
  const categories: string[] = [
    "Laptopy",
    "Smartfony",
    "Tablety",
    "Akcesoria",
    "Podzespoły komputerowe",
    "Monitory",
    "Drukarki",
    "Sieci komputerowe",
    "Promocje",
  ];

  return (
    <div className="hidden md:block">
      <ul className="flex flex-wrap items-center justify-center gap-x-2 text-sm font-semibold">
        {categories.map((category: string, i: number) => {
          return (
            <Link to="#" key={i}>
              <li className="cursor-pointer px-4 py-2 duration-200 hover:bg-black/5 dark:hover:bg-white/10">
                {category}
              </li>
            </Link>
          );
        })}
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
