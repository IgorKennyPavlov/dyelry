import { Stack } from "expo-router";
import { useCallback } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Button,
  ListRenderItemInfo,
} from "react-native";

import { SetListItem, listItemCommonStyles } from "../../components";
import { useNavigate, getExerciseInterval } from "../../global";
import type { SetProps } from "../../global/types";
import { useTargetStore, useTargetSelectors } from "../../store";

const Exercise = () => {
  const { navigate } = useNavigate();
  const { setTargetSetId } = useTargetStore();

  const { targetExercise } = useTargetSelectors();

  const addSet = useCallback(() => {
    setTargetSetId(null);
    navigate("/timer");
  }, [navigate, setTargetSetId]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: targetExercise?.title,
        }}
      />

      {targetExercise?.sets?.length ? (
        <View style={getExerciseInterval(targetExercise)[1] ? {} : styles.list}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "15%" }}>Weight</Text>
            <Text style={{ width: "15%" }}>Reps</Text>
            <Text style={{ width: "20%" }}>Duration</Text>
            <Text style={{ width: "30%" }}>Feels</Text>
            <Text style={{ width: "20%" }}>Rest</Text>
          </View>

          <FlatList
            data={targetExercise.sets}
            renderItem={(props: ListRenderItemInfo<SetProps>) => (
              <SetListItem {...props} />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No sets recorded</Text>
        </View>
      )}

      <View style={styles.btn}>
        <Button title="Add set" color="green" onPress={addSet} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 76 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Exercise;
