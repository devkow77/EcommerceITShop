import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { User, NotepadText, RotateCcw, Heart, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, loading, setUser } = useAuth();

  if (loading) return null;

  console.log(user);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-full">
            <User />
            <p className="ml-2 hidden md:block">
              {user ? `Witaj ${user.name}!` : "Cześć, zaloguj się"}
            </p>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-80 text-black">
              {user ? (
                <div className="space-y-2 border-b border-black p-2">
                  <NavigationMenuLink
                    asChild
                    className="w-full bg-red-500 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-red-600"
                  >
                    <button onClick={handleLogout}>Wyloguj się</button>
                  </NavigationMenuLink>
                </div>
              ) : (
                <div className="space-y-2 border-b border-black p-2">
                  <NavigationMenuLink
                    asChild
                    className="bg-white px-4 py-2 text-center font-medium shadow-sm hover:bg-white"
                  >
                    <Link to="/login">Zaloguj się</Link>
                  </NavigationMenuLink>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-px flex-1 bg-black"></div>
                    <span>Nie masz konta?</span>
                    <div className="h-px flex-1 bg-black"></div>
                  </div>
                  <NavigationMenuLink
                    asChild
                    className="bg-black px-4 py-2 text-center font-medium text-white hover:bg-black"
                  >
                    <Link to="/register">Załóż konto</Link>
                  </NavigationMenuLink>
                </div>
              )}
              <div className="border-b border-black">
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex flex-row items-center gap-2">
                    <User className="text-black" /> Twoje konto
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex flex-row items-center gap-2">
                    <NotepadText className="text-black" /> Zamówienia
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex flex-row items-center gap-2">
                    <RotateCcw className="text-black" /> Zwroty
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex flex-row items-center gap-2">
                    <Heart className="text-black" /> Listy zakupowe
                  </Link>
                </NavigationMenuLink>
              </div>
              <NavigationMenuLink className="flex flex-row items-center gap-2">
                <Moon className="text-black" /> Tryb ciemny / jasny
              </NavigationMenuLink>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Profile;
