import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const DisableTotpForm = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!user) return null;

  const handleDisable2FA = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/disable-totp", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(data.msg);
        setUser({ ...user, totpEnabled: false });
      } else {
        setMsg(data.msg || "Coś poszło nie tak");
      }
    } catch (err) {
      console.error("Błąd wyłączania 2FA:", err);
      setMsg("Błąd sieci");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {user.totpEnabled && (
        <Button
          onClick={handleDisable2FA}
          disabled={loading}
          variant="destructive"
        >
          {loading ? "Wyłączanie..." : "Wyłącz 2FA"}
        </Button>
      )}
      {msg && <p className="text-sm text-gray-700 dark:text-gray-300">{msg}</p>}
    </div>
  );
};

export default DisableTotpForm;
