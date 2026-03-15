import { AuthTemplate } from "@/components/atomic";

import RegisterForm from "@/components/atomic/organisms/RegisterForm/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthTemplate>
      <RegisterForm />
    </AuthTemplate>
  );
}
