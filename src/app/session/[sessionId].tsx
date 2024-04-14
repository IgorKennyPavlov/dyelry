import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

import ExerciseListItem, {
  ExerciseListItemProps,
} from "../../components/ExerciseListItem";
import { querify, SESSIONS } from "../../global";
import { useSessionsStore } from "../../store";

const Session = () => {
  const router = useRouter();
  const { [SESSIONS]: sessions, editSession } = useSessionsStore();
  const sessionId = useLocalSearchParams().sessionId as string;
  const session = sessions.find((el) => el.id === sessionId);

  const renderItem = (props: ExerciseListItemProps) => (
    <ExerciseListItem sessionId={sessionId} {...props} />
  );

  const q = querify({ sessionId });

  const addExercise = () => router.push(`/session/exercise/new-exercise?${q}`);

  const endSession = () => {
    editSession(sessionId, { end: new Date() });
    router.push(`/`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Session ${session.start.toLocaleDateString("ru-RU")}`,
        }}
      />
      {session.exercises?.length ? (
        <View style={session.end ? {} : styles.list}>
          <FlatList data={session.exercises} renderItem={renderItem} />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No exercises recorded</Text>
        </View>
      )}

      {!session.end && (
        <>
          <View style={{ ...styles.btn, ...styles.btnLeft }}>
            <Button title="Add exercise" color="green" onPress={addExercise} />
          </View>
          <View style={{ ...styles.btn, ...styles.btnRight }}>
            <Button
              title="Finish session"
              color="orange"
              onPress={endSession}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 36 },
  emptyList: {
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

export default Session;
