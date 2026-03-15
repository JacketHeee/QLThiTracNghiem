import { Button, Icon } from "@/components/atomic/atoms";
import { FormField } from "@/components/atomic/molecules";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RegisterForm() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col items-center">
        <div className="mb-2 flex items-center gap-2">
          <Icon name="logoIcon" />
          <span className="text-main text-2xl font-bold">MaHiChAn</span>
        </div>
        <h2 className="text-main text-center text-xl font-bold">
          {t("register.welcome")}
        </h2>
        <p className="text-muted mt-1 text-center text-sm">
          {t("register.subtitle")}
        </p>
      </div>

      <form className="text-main flex flex-col gap-3">
        <FormField
          label={t("register.username")}
          name="username"
          placeholder={t("register.usernamePlaceholder")}
        />
        <FormField
          label={t("register.email")}
          name="email"
          placeholder={t("register.emailPlaceholder")}
        />

        <FormField
          label={t("register.password")}
          name="password"
          type="password"
          placeholder={t("register.passwordPlaceholder")}
        />

        <div className="my-1 flex items-center text-sm">
          <label className="flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="accent-primary h-4 w-4 rounded border-neutral-200"
            />
            <span className="text-muted text-[13px]">
              {t("register.agreeTerms")}
            </span>
          </label>
        </div>

        <Button
          type="submit"
          className="bg-primary mt-1 w-full rounded-xl py-2.5 font-bold uppercase text-white transition-all hover:opacity-90"
        >
          {t("register.submit")}
        </Button>
      </form>

      <div className="text-muted mt-4 text-center text-sm">
        {t("register.hasAccount")}{" "}
        <Link to="/login" className="text-primary font-bold hover:underline">
          {t("register.loginNow")}
        </Link>
      </div>

      <div className="relative my-5 w-full">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="text-muted bg-white px-4 text-xs font-medium">
            {t("register.or")}
          </span>
        </div>
      </div>

      <button className="text-main flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium transition-all hover:bg-neutral-50">
        <Icon name="googleIcon" />
        {t("register.googleLogin")}
      </button>
    </div>
  );
}
