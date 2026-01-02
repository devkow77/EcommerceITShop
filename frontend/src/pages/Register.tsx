import { Container, RegisterForm } from "@/components";

const Register = () => {
  return (
    <section>
      <Container className="max-w-2xl">
        <h2 className="mb-8 text-xl font-bold">Załóż konto</h2>
        <RegisterForm />
      </Container>
    </section>
  );
};

export default Register;
