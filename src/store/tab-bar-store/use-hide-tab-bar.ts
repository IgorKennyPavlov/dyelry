import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useTabBarStore } from "./tab-bar-store";

export const useHideTabBar = () => {
  const { setTabBarVisibility } = useTabBarStore();

  useFocusEffect(
    useCallback(() => {
      setTabBarVisibility(false);
      return () => setTabBarVisibility(true);
    }, [setTabBarVisibility]),
  );
};
