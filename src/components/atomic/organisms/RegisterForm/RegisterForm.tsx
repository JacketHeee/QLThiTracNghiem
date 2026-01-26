import { Button } from "@/components/atomic/atoms";
import { FormField } from "@/components/atomic/molecules";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import googleIcon from "@/assets/icons/google-icon.svg";

export default function RegisterForm() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col items-center">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white">
            M
          </div>
          <span className="text-2xl font-bold text-gray-700">MaHiChAn</span>
        </div>
        <h2 className="text-mahichan-primary text-center text-xl font-bold">
          {t("register.welcome")}
        </h2>
        <p className="text-mahichan-secondary mt-1 text-center text-sm">
          {t("register.subtitle")}
        </p>
      </div>

      <form className="text-mahichan-primary flex flex-col gap-3">
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

        <div className="relative">
          <FormField
            label={t("register.password")}
            name="password"
            type="password"
            placeholder={t("register.passwordPlaceholder")}
          />
        </div>

        <div className="my-1 flex items-center text-sm">
          <label className="text-mahichan-primary flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-[13px] text-gray-600">
              {t("register.agreeTerms")}
            </span>
          </label>
        </div>

        <Button
          type="submit"
          className="mt-1 w-full rounded-xl bg-indigo-500 py-2.5 font-bold uppercase text-white transition-all hover:bg-indigo-600"
        >
          {t("register.submit")}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        {t("register.hasAccount")}{" "}
        <Link to="/login" className="font-bold text-indigo-500 hover:underline">
          {t("register.loginNow")}
        </Link>
      </div>

      <div className="relative my-5 w-full">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-xs font-medium text-gray-400">
            {t("register.or")}
          </span>
        </div>
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50">
        <img src={googleIcon} className="h-5 w-5" alt="Google" />
        {t("register.googleLogin")}
      </button>
    </div>
  );
}
