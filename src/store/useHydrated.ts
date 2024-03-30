import { useEffect, useState } from "react";

import { useStore } from "./store";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useStore.persist.hasHydrated());

    return () => unsubFinishHydration();
  }, []);

  return hydrated;
};
