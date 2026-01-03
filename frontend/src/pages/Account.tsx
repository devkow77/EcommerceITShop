import { Container, ResetPasswordForm } from "@/components";

const Account = () => {
  return (
    <section>
      <Container className="max-w-2xl">
        <h2 className="mb-8 text-xl font-bold">Zresetuj hasło</h2>
        <ResetPasswordForm />
      </Container>
    </section>
  );
};

export default Account;
