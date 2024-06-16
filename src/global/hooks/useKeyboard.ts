import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Keyboard } from "react-native";

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
