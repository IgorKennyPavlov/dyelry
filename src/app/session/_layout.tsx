import { Stack } from "expo-router";
import { useMemo } from "react";

import { useTarget } from "../../store/useTarget";

const SessionLayout = () => {
  const { targetSession } = useTarget();

  const title = useMemo(() => {
    let res = "Session";

    if (targetSession?.start) {
      res += ` ${targetSession.start.toLocaleDateString("ru-RU")}`;
    }

    return res;
  }, [targetSession?.start]);

  return (
    <Stack screenOptions={{ title }}>
      <Stack.Screen name="exercise" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SessionLayout;
