import { Container, LoginForm } from "@/components";

const Login = () => {
  return (
    <section>
      <Container className="max-w-2xl">
        <h2 className="mb-8 text-xl font-bold">Logowanie</h2>
        <LoginForm />
      </Container>
    </section>
  );
};

export default Login;
