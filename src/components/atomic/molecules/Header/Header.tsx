import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex items-center gap-6">
          <li>
            <Link to="/" className="transition-colors hover:text-accent">
              {t("navigation.home")}
            </Link>
          </li>
          <li>
            <Link to="/login" className="transition-colors hover:text-accent">
              {t("navigation.login")}
            </Link>
          </li>
          <li>
            <Link
              to="/test-error-boundary"
              className="transition-colors hover:text-accent"
            >
              {t("navigation.errorPage")}
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                if (language === "vi") setLanguage("en");
                else setLanguage("vi");
                i18n.changeLanguage(language);
              }}
            >
              {t("navigation.lang")}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
