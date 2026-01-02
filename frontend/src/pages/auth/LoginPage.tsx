import { AuthTemplate, LoginForm } from "@/components";

export default function LoginPage() {
  throw new Error("💥 Route Error - Caught by ErrorPage!");
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
