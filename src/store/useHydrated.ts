import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

import { usePersistentStore } from "./store";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useFocusEffect(
    useCallback(() => {
      usePersistentStore.persist.rehydrate();

      const unsubFinishHydration = usePersistentStore.persist.onFinishHydration(
        () => setHydrated(true),
      );

      setHydrated(usePersistentStore.persist.hasHydrated());

      return () => unsubFinishHydration();
    }, []),
  );

  return hydrated;
};
