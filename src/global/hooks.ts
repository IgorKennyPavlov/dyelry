import { useRouter, Href } from "expo-router";
import { useState, useEffect } from "react";
import { Keyboard } from "react-native";

// clear all history and navigate to target route
export const useNavigate = () => {
  const router = useRouter();

  const navigate = (route: Href<string>) => {
    while (router.canGoBack()) {
      router.back();
    }
    router.replace(route);
  };

  return { navigate };
};

export const useKeyboard = () => {
  const [isVisible, setIsVisible] = useState(Keyboard.isVisible());

  useEffect(() => {
    const subs = [
      Keyboard.addListener("keyboardDidShow", () => setIsVisible(true)),
      Keyboard.addListener("keyboardDidHide", () => setIsVisible(false)),
    ];

    return () => subs.forEach((s) => s.remove());
  }, []);

  return { isKeyboardVisible: isVisible };
};
