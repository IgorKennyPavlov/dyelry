import { produce } from "immer";
import { create } from "zustand";

interface TabBarStore {
  isTabBarVisible: boolean;
  setTabBarVisibility: (isVisible: boolean) => void;
}

/** This is ridiculous, but this is the easiest way to set up the bottom tabBar visibility from deep-nested stack.
 *
 * Here is the explanation and (IMHO) more sophisticated alternative to consider for future use (if expo router won't offer anything better) =>
 * https://coolsoftware.dev/blog/hide-tab-bar-expo-router-nested-stack/
 */
export const useTabBarStore = create<TabBarStore>()((set) => ({
  isTabBarVisible: true,
  setTabBarVisibility: (isVisible: boolean) =>
    set(
      produce((state: TabBarStore) => {
        state.isTabBarVisible = isVisible;
      }),
    ),
}));
