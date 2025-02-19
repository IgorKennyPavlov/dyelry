import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

import { useSessionsStore } from "./sessions-store";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useFocusEffect(
    useCallback(() => {
      useSessionsStore.persist.rehydrate();

      const unsubFinishHydration = useSessionsStore.persist.onFinishHydration(
        () => setHydrated(true),
      );

      setHydrated(useSessionsStore.persist.hasHydrated());

      return () => unsubFinishHydration();
    }, []),
  );

  return hydrated;
};
