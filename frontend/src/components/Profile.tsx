import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { User, NotepadText, RotateCcw, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, loading, setUser } = useAuth();

  if (loading) return null;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
      }
    } catch (err) {
      console.error("Błąd wylogowania", err);
    }
  };

  const iconClass = "text-black dark:text-white";
  const menuItemClass = "flex flex-row items-center gap-2";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-full">
            <User />
            <span className="ml-2 hidden md:block">
              {user ? `Witaj ${user.name}!` : "Cześć, zaloguj się"}
            </span>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="w-46 text-black md:w-60 2xl:w-80 dark:text-white">
              {/* AUTH SECTION */}
              {user ? (
                <div className="space-y-2 border-b border-black p-2 dark:border-white/20">
                  <NavigationMenuLink asChild>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-red-600"
                    >
                      Wyloguj się
                    </button>
                  </NavigationMenuLink>
                </div>
              ) : (
                <div className="space-y-2 border-b border-black p-2 dark:border-white/20">
                  <NavigationMenuLink
                    asChild
                    className="bg-white px-4 py-2 text-center font-medium shadow-sm hover:bg-white dark:text-black"
                  >
                    <Link to="/login">Zaloguj się</Link>
                  </NavigationMenuLink>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-px flex-1 bg-black dark:bg-white/20" />
                    <span>Nie masz konta?</span>
                    <div className="h-px flex-1 bg-black dark:bg-white/20" />
                  </div>

                  <NavigationMenuLink
                    asChild
                    className="bg-black px-4 py-2 text-center font-medium text-white hover:bg-black"
                  >
                    <Link to="/register">Załóż konto</Link>
                  </NavigationMenuLink>
                </div>
              )}

              {/* LINKS */}
              <div className="border-b border-black dark:border-white/20">
                <NavigationMenuLink asChild>
                  <Link
                    to={user && user.role == "USER" ? "/account" : "/admin"}
                    className={menuItemClass}
                  >
                    <User className={iconClass} />
                    Twoje konto
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link
                    to={
                      user && user.role == "USER"
                        ? "/account/orders"
                        : "/admin/orders"
                    }
                    className={menuItemClass}
                  >
                    <NotepadText className={iconClass} />
                    Zamówienia
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link to="#" className={menuItemClass}>
                    <RotateCcw className={iconClass} />
                    Zwroty
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link to="#" className={menuItemClass}>
                    <Heart className={iconClass} />
                    Listy zakupowe
                  </Link>
                </NavigationMenuLink>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Profile;
