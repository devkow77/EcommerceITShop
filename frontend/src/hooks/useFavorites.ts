import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface FavoriteProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  discount?: number;
  category: {
    name: string;
    slug: string;
  };
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.user?.id ? true : false;

  // Fetch favorites from API on mount (only if logged in)
  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  // Listen for global favorites updates from other hook instances
  useEffect(() => {
    const onUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (Array.isArray(detail)) {
          setFavorites(detail);
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener("favorites:updated", onUpdate as EventListener);
    return () =>
      window.removeEventListener(
        "favorites:updated",
        onUpdate as EventListener,
      );
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/favorites", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
        try {
          window.dispatchEvent(
            new CustomEvent("favorites:updated", { detail: data }),
          );
        } catch (err) {
          // ignore in non-browser env
        }
      } else if (response.status === 401) {
        // Not logged in
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (productId: number): boolean => {
    return favorites.some((fav) => fav.id === productId);
  };

  const toggleFavorite = (product: FavoriteProduct): boolean => {
    if (!isLoggedIn) {
      return false;
    }

    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
    return true;
  };

  const addFavorite = async (product: FavoriteProduct) => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId: product.id }),
      });

      if (response.ok) {
        setFavorites((prev) => {
          const next = [...prev, product];
          try {
            window.dispatchEvent(
              new CustomEvent("favorites:updated", { detail: next }),
            );
          } catch (err) {
            // ignore
          }
          return next;
        });
      } else if (response.status === 401) {
        // Not logged in
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (productId: number) => {
    if (!isLoggedIn) {
      return;
    }
    // Optimistic UI update: remove immediately, then call API.
    setFavorites((prev) => {
      const next = prev.filter((fav) => fav.id !== productId);
      try {
        window.dispatchEvent(
          new CustomEvent("favorites:updated", { detail: next }),
        );
      } catch (err) {
        // ignore
      }
      return next;
    });
    try {
      const response = await fetch(`/api/favorites/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in: clear local state
          setFavorites([]);
        } else {
          // Re-fetch to restore state if deletion failed
          await fetchFavorites();
        }
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      // Re-fetch on network error to restore state
      await fetchFavorites();
    }
  };

  const checkFavorite = async (productId: number): Promise<boolean> => {
    if (!isLoggedIn) {
      return false;
    }

    try {
      const response = await fetch(`/api/favorites/check/${productId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.isFavorite;
      }
      return false;
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  };

  return {
    favorites,
    isLoading,
    isLoggedIn,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    checkFavorite,
  };
};
