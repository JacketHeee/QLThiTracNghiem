import { Button } from "@/components/atomic/atoms";
import { FormField } from "@/components/atomic/molecules";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import googleIcon from "@/assets/icons/google-icon.svg";
import logoIcon from "@/assets/icons/logo-icon.svg";

export default function LoginForm() {
  const { t } = useTranslation();

  const navigation = useNavigate();

  const handleClick = () => {
    navigation("/dashboard");
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex items-center gap-2">
          <img src={logoIcon} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-main text-2xl font-bold">MaHiChAn</span>
        </div>
        <h2 className="text-main text-xl font-bold">{t("login.welcome")}</h2>
        <p className="text-muted text-sm">{t("login.subtitle")}</p>
      </div>

      <form className="text-main flex flex-col gap-5">
        <FormField
          label={t("login.email")}
          name="email"
          placeholder={t("login.emailPlaceholder")}
        />

        <FormField
          label={t("login.password")}
          name="password"
          type="password"
          placeholder={t("login.passwordPlaceholder")}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="text-main flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-200 accent-primary"
            />
            {t("login.rememberMe")}
          </label>
          <a href="#" className="font-medium text-primary hover:underline">
            {t("login.forgotPassword")}
          </a>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 font-bold text-white transition-all hover:opacity-90"
          onClick={handleClick}
        >
          {t("login.submit")}
        </Button>
      </form>

      <div className="text-muted mt-6 text-center text-sm">
        {t("login.noAccount")}{" "}
        <Link to="/register" className="font-bold text-primary hover:underline">
          {t("login.registerNow")}
        </Link>
      </div>

      <div className="relative my-8 w-full">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-200"></div>
        </div>

        <div className="relative flex justify-center text-sm">
          <span className="text-muted bg-white px-4 font-medium">
            {t("login.or")}
          </span>
        </div>
      </div>

      <Button
        type="button"
        className="text-main flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3 font-medium transition-all hover:bg-neutral-50"
      >
        <img src={googleIcon} className="h-5 w-5" alt="Google" />
        {t("login.googleLogin")}
      </Button>
    </div>
  );
}
