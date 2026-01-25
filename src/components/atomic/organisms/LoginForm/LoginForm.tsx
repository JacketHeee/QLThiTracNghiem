import { Button } from "@/components/atomic/atoms";
import { FormField } from "@/components/atomic/molecules";

export default function LoginForm() {
  return (
    <form className="flex flex-col gap-4">
      <FormField label="Email" name="email" />
      <FormField label="Password" name="password" type="password" />
      <Button type="submit">Login</Button>
    </form>
  );
}
