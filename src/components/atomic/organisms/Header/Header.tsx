import { Header as HeaderBar } from "../../molecules/Header/Header";
import { Button, ColorPicker, Icon, Input } from "../../atoms";
import { useThemeStore } from "@/stores/theme.store";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Header() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };
  return (
    <HeaderBar
      left={
        <Input placeholder={t("header.search")} icon={<Icon name="search" />} />
      }
      right={
        <>
          <ColorPicker />
          <Button
            size={"small"}
            onClick={toggleLanguage}
            title={t("navigation.lang")}
          >
            <Icon name="translate" />
          </Button>
          <Button size={"small"} onClick={toggleTheme}>
            {!isDarkMode ? <Icon name="lightMode" /> : <Icon name="darkMode" />}
          </Button>
          <Button size={"small"}>
            <Icon name="notificationsNone" />
          </Button>
          <Link to="/login">
            <Button className="!p-0">
              <Icon size={40} name="avatar" />
            </Button>
          </Link>
        </>
      }
    />
  );
}
