import { useEffect, useState } from "react";

import { usePersistentStore } from "./store";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = usePersistentStore.persist.onFinishHydration(
      () => setHydrated(true),
    );

    setHydrated(usePersistentStore.persist.hasHydrated());

    return () => unsubFinishHydration();
  }, []);

  return hydrated;
};
