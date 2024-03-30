import { useLocalSearchParams, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { mockSessionList } from "../../mock";

const Session = () => {
  const { id } = useLocalSearchParams();
  const item = mockSessionList.find((el) => el.id === id);

  return (
    <View>
      <Stack.Screen options={{ title: `Session #${id}` }} />
      <Text>{item.date}</Text>
    </View>
  );
};

export default Session;
