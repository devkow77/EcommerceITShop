import {
  Container,
  DisableTotpForm,
  ResetPasswordForm,
  VerifyTotpForm,
} from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useTotp } from "@/hooks/useTotp";
import Forbidden from "@/pages/Forbidden";

const Admin = () => {
  const { qrCode, manualKey, loading, error } = useTotp();
  const { user } = useAuth();

  if (!user || user.role !== "ADMIN") return <Forbidden />;
  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <h2 className="text-xl font-bold">Ładowanie...</h2>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <h2 className="text-xl font-bold text-red-500">{error}</h2>
      </div>
    );

  return (
    <section className="py-12">
      <Container className="space-y-8">
        {/* Podstawowe dane konta */}
        <div className="space-y-1">
          <h2 className="mb-4 text-xl font-bold">Panel Admina</h2>
          <p>ID: #{user.id}</p>
          <p>Nazwa: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>
            Weryfikacja 2FA:{" "}
            {user.totpEnabled ? (
              <span className="text-green-500">Włączona</span>
            ) : (
              <span className="text-red-500">Wyłączona</span>
            )}
          </p>
        </div>
        {/* Reset hasła */}
        <div>
          <h3 className="mb-6 font-bold">Nowe hasło</h3>
          <ResetPasswordForm />
        </div>
        {/* QRCode 2FA */}
        <div>
          <h3 className="mb-2 font-bold">
            Skonfiguruj uwierzytelnianie dwuskładnikowe
          </h3>
          <p className="mb-4 text-sm leading-6">
            Zeskanuj poniższy kod QR w aplikacji Authenticator (np. Google
            Authenticator lub Authy):
          </p>
          {qrCode && (
            <img src={qrCode} alt="QR Code do TOTP" className="mb-4" />
          )}
          <p className="mb-2 text-sm">Lub wpisz ręcznie klucz:</p>
          <div className="mb-2 inline-block bg-black/5 px-4 py-2 wrap-break-word select-all dark:bg-white/10">
            {manualKey}
          </div>
          <p className="text-sm leading-6">
            Po dodaniu konta w aplikacji Authenticator wprowadź wygenerowany
            kod, aby zakończyć konfigurację 2FA.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Weryfikacje 2FA</h3>
          {user?.totpEnabled ? <DisableTotpForm /> : <VerifyTotpForm />}
        </div>
      </Container>
    </section>
  );
};

export default Admin;
