import { Container, LoginForm, TotpLoginForm } from "@/components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [tempToken, setTempToken] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section>
      <Container className="max-w-2xl">
        <h2 className="mb-8 text-xl font-bold">Logowanie</h2>
        {tempToken ? (
          <TotpLoginForm
            tempToken={tempToken}
            onSuccess={() => navigate("/")}
          />
        ) : (
          <LoginForm on2FARequired={(token) => setTempToken(token)} />
        )}
      </Container>
    </section>
  );
};

export default Login;
