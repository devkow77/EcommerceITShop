import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const VerifyTotpForm = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/verify-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Błąd weryfikacji");
      } else {
        setSuccess(data.msg);
      }
    } catch (err) {
      console.error(err);
      setError("Błąd serwera");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-64 flex-col gap-4">
      <Input
        type="text"
        placeholder="Wpisz kod TOTP"
        value={code}
        onChange={(e: any) => setCode(e.target.value)}
      />
      <Button variant={"blue"}>Weryfikuj</Button>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
};

export default VerifyTotpForm;
