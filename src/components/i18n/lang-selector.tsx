import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, View, TouchableOpacity, ViewStyle } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useLocales } from "expo-localization";
import { FlagUS, FlagRU } from "./flags";
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";

interface LangConfig {
  locale: string;
  flag: React.FC;
}

const supportedLangs: LangConfig[] = [
  { locale: "en-US", flag: FlagUS },
  { locale: "ru-RU", flag: FlagRU },
];

export const LangSelector = (props: { style?: StyleProp<ViewStyle> }) => {
  const { i18n } = useTranslation();
  const locales = useLocales();

  const [open, setOpen] = useState(false);
  const selectedLang = i18n.language;

  const getSavedLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem("language");
    if (savedLang) return savedLang;

    const detectedLang = locales[0]?.languageTag;
    const supported = supportedLangs.map((l) => l.locale);
    const newLang =
      detectedLang && supported.includes(detectedLang) ? detectedLang : "en-US";
    await AsyncStorage.setItem("language", newLang);

    return newLang;
  }, [locales]);

  const setupLang = useCallback(async () => {
    await i18n.changeLanguage(await getSavedLang());
  }, [i18n, getSavedLang]);

  useEffect(() => {
    setupLang();
  }, [setupLang]);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    await i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <View
      style={[
        styles.container,
        open && styles.openContainer,
        props.style || {},
      ]}
    >
      {supportedLangs
        .sort((l) => (selectedLang !== l.locale ? 1 : -1))
        .map(({ locale, flag: Flag }) => (
          <TouchableOpacity
            key={locale}
            onPress={() => (open ? changeLanguage(locale) : setOpen(true))}
            style={[selectedLang !== locale && styles.inactiveFlag]}
          >
            <Flag />
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    overflow: "hidden",
  },
  openContainer: {
    overflow: "visible",
    backgroundColor: "#eee",
  },
  inactiveFlag: { backgroundColor: "#eee" },
});
