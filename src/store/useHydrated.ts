import { useEffect, useState } from "react";

import { useSessionsStore } from "./store";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useSessionsStore.persist.onFinishHydration(
      () => setHydrated(true),
    );

    setHydrated(useSessionsStore.persist.hasHydrated());

    return () => unsubFinishHydration();
  }, []);

  return hydrated;
};
