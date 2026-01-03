import { useState, useEffect } from "react";

export const useTotp = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotp = async () => {
      try {
        const res = await fetch("/api/auth/generate-totp", {
          method: "GET",
          credentials: "include", // bo token w cookie
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Coś poszło nie tak");
          setLoading(false);
          return;
        }

        setQrCode(data.qrCode);
        setManualKey(data.manualKey);
      } catch (err) {
        setError("Błąd połączenia z serwerem");
      } finally {
        setLoading(false);
      }
    };

    fetchTotp();
  }, []);

  return { qrCode, manualKey, loading, error };
};
