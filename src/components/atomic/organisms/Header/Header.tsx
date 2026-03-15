import { Header as HeaderBar } from "../../molecules/Header/Header";
import { Button, ColorPicker, Icon, Input } from "../../atoms";
import { useThemeStore } from "@/stores/theme.store";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };
  return (
    <HeaderBar
      left={
        <Input
          placeholder={t("header.search")}
          icon={
            <Button size={"small"}>
              <Icon name="search" />
            </Button>
          }
        />
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
          <Button className="!p-0">
            <Icon size={40} name="avatar" />
          </Button>
        </>
      }
    />
  );
}
