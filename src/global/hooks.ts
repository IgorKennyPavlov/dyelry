import { useRouter, Href, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Keyboard } from "react-native";

// clear all history and navigate to target route
export const useNavigate = () => {
  const router = useRouter();

  const navigate = (route: Href<string>) => {
    while (router.canGoBack()) {
      router.back();
    }
    router.push(route);
  };

  return { navigate };
};

export const useKeyboard = () => {
  const [isVisible, setIsVisible] = useState(Keyboard.isVisible());

  useFocusEffect(
    useCallback(() => {
      const subs = [
        Keyboard.addListener("keyboardDidShow", () => setIsVisible(true)),
        Keyboard.addListener("keyboardDidHide", () => setIsVisible(false)),
      ];

      return () => subs.forEach((s) => s.remove());
    }, []),
  );

  return { isKeyboardVisible: isVisible };
};
