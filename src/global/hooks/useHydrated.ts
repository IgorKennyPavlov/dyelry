import { useFocusEffect } from "expo-router";
import { useState, useCallback, useMemo, useEffect } from "react";

import {
  useSessionsStore,
  useExerciseDataStore,
  useTemplatesStore,
  useUsersStore,
} from "../../store";
import { USERS, SESSIONS, TEMPLATES, EXERCISE_DATA } from "../../store/keys";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  const { [USERS]: users } = useUsersStore();

  const activeUser = useMemo(
    () => Object.keys(users).find((key) => users[key]),
    [users],
  );

  const rehydrateAll = useCallback(() => {
    Promise.allSettled([
      useSessionsStore.persist.rehydrate(),
      useTemplatesStore.persist.rehydrate(),
      useExerciseDataStore.persist.rehydrate(),
      useUsersStore.persist.rehydrate(),
    ]).then(() => setHydrated(true));

    setHydrated(
      useSessionsStore.persist.hasHydrated() &&
        useTemplatesStore.persist.hasHydrated() &&
        useTemplatesStore.persist.hasHydrated() &&
        useUsersStore.persist.hasHydrated(),
    );
  }, []);

  useEffect(() => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    useSessionsStore.persist.setOptions({ name: SESSIONS + postfix });
    useTemplatesStore.persist.setOptions({ name: TEMPLATES + postfix });
    useExerciseDataStore.persist.setOptions({ name: EXERCISE_DATA + postfix });

    rehydrateAll();
  }, [activeUser, rehydrateAll]);

  useFocusEffect(rehydrateAll);

  return hydrated;
};
