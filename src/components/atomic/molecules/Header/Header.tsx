import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ThemeToggle from "../ToggleTheme/ToggleTheme";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex items-center gap-6">
          <li>
            <Link to="/" className="hover:text-accent transition-colors">
              {t("navigation.home")}
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-accent transition-colors">
              {t("navigation.login")}
            </Link>
          </li>
          <li>
            <Link
              to="/test-error-boundary"
              className="hover:text-accent transition-colors"
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
          <li>
            <Card />
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Card() {
  return (
    <div className="rounded-lg border border-divider bg-paper p-6 shadow-md">
      // Brand colors (không đổi theo theme)
      <button className="bg-primary text-primary-contrast">Primary</button>
      <span className="text-error">Error text</span>
      <div className="bg-success-light">Success background</div>
      // States & Alert
      <div className="bg-states-activeMenu">Active menu</div>
      <div className="bg-alert-errorBackground text-alert-errorContent">
        Error alert
      </div>
      // Semantic colors (tự động đổi theo theme)
      <div className="bg-paper text-text-primary">Card</div>
      <input className="border-border-input bg-input-filled" />
      <div className="bg-action-hover">Hover state</div>
      // Typography
      <h1 className="text-h1">Heading 1</h1>
      <button className="text-btn-md uppercase">Button</button>
      <span className="text-chip">Chip text</span>
      <th className="text-table-header">Header</th>
      // Shadows (tự động đổi theo theme)
      <div className="shadow-sm">Small</div>
      <div className="shadow-xl">Extra large</div>
      // Grid
      <div className="grid grid-cols-layout gap-gutter">12 columns</div>
    </div>
  );
}
