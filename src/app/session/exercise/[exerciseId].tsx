import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Button,
  ListRenderItemInfo,
  Dimensions,
} from "react-native";

import SetListItem from "../../../components/SetListItem";
import { SetProps } from "../../../global";
import { useStore } from "../../../store";
import { queryfy } from "../../../utils";

const Exercise = () => {
  const router = useRouter();
  const { sessions, editExercise } = useStore();

  const sessionId = useLocalSearchParams().sessionId as string;
  const exerciseId = useLocalSearchParams().exerciseId as string;

  const session = sessions.find((el) => el.id === sessionId);
  const exercise = session.exercises.find((el) => el.id === exerciseId);

  const renderItem = (props: ListRenderItemInfo<SetProps>) => (
    <SetListItem sessionId={sessionId} exerciseId={exerciseId} {...props} />
  );

  const addSet = () => {
    const q = queryfy({ sessionId, exerciseId });
    // @ts-ignore
    router.push(`/session/exercise/training-set/timer?${q}`);
  };

  const endExercise = () => {
    editExercise(sessionId, exerciseId, { end: new Date() });
    router.push(`/session/${sessionId}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: exercise.title,
        }}
      />
      {exercise.sets?.length ? (
        <View style={styles.list}>
          <FlatList data={exercise.sets} renderItem={renderItem} />
        </View>
      ) : (
        <View style={styles.emptyListMsgWrap}>
          <Text>No sets recorded</Text>
        </View>
      )}

      {!exercise.end && (
        <>
          <View style={{ ...styles.btn, ...styles.btnLeft }}>
            <Button title="Add set" color="green" onPress={addSet} />
          </View>
          <View style={{ ...styles.btn, ...styles.btnRight }}>
            <Button
              title="Finish exercise"
              color="orange"
              onPress={endExercise}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 40 },
  emptyListMsgWrap: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width / 2,
  },
  btnLeft: { left: 0 },
  btnRight: { right: 0 },
});

export default Exercise;
