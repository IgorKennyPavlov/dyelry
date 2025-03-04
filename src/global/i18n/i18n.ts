import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./en-US.json";
import translationRu from "./ru-RU.json";

const resources = {
  "en-US": { translation: translationEn },
  "ru-RU": { translation: translationRu },
};

const initI18n = async () => {
  const savedLanguage = (await AsyncStorage.getItem("language")) || "en-US";

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en-US",
    interpolation: { escapeValue: true },
  });
};

initI18n();

export default i18n;
