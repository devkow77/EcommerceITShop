import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  totpEnabled: boolean;
  role: "USER" | "ADMIN";
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // sprawdzamy zalogowanego usera przy starcie
  useEffect(() => {
    fetch("http://localhost:4000/api/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          setUser(null); // brak zalogowanego użytkownika
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data ?? null); // upewniamy się, że user istnieje
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
