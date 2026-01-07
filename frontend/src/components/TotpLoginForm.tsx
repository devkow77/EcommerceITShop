import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

type Props = {
  tempToken: string;
  onSuccess: () => void;
};

const TotpLoginForm = ({ tempToken, onSuccess }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("Kod musi mieć 6 cyfr");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login-with-totp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code,
          tempToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Nieprawidłowy kod");
        return;
      }

      setUser(data.user);
      onSuccess();
    } catch (err) {
      setError("Błąd połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        Wpisz kod z aplikacji uwierzytelniającej
      </h2>

      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        placeholder="123456"
        maxLength={6}
        inputMode="numeric"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Sprawdzanie..." : "Potwierdź"}
      </Button>
    </form>
  );
};

export default TotpLoginForm;
