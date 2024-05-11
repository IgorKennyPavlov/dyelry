import AntIcon from "@expo/vector-icons/AntDesign";
import { useCallback } from "react";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
  Pressable,
} from "react-native";

import { useSelectedWeek } from "./useSelectedWeek";
import {
  SessionListItem,
  listItemCommonStyles,
  DatePicker,
} from "../components";
import { useNavigate, SessionProps } from "../global";
import { useTargetStore } from "../store";

const SessionList = () => {
  const { setTargetSessionId } = useTargetStore();
  const { navigate } = useNavigate();

  const { week, shiftWeek, selectDate, form } = useSelectedWeek();
  const { control } = form;

  const addSession = useCallback(() => {
    setTargetSessionId(String(Date.now()));
    navigate(`/session/session-editor`);
  }, [navigate, setTargetSessionId]);

  return (
    <>
      {week?.length ? (
        <View style={styles.list}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "25%" }}>Date</Text>
            <Text style={{ width: "45%" }}>Title</Text>
            <Text style={{ width: "20%" }}>Duration</Text>
            <Text style={{ width: "10%" }}>Edit</Text>
          </View>

          <FlatList
            data={week}
            renderItem={(props: ListRenderItemInfo<SessionProps>) => (
              <SessionListItem {...props} />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No sessions recorded</Text>
        </View>
      )}

      <View style={styles.paginationPanel}>
        <Pressable style={styles.weekBtn} onPress={() => shiftWeek(-1)}>
          <AntIcon size={32} name="leftcircle" />
        </Pressable>
        <DatePicker
          style={styles.weekPicker}
          name="selectedWeek"
          label="Week"
          control={control}
          onChange={selectDate}
        />
        <Pressable style={styles.weekBtn} onPress={() => shiftWeek(1)}>
          <AntIcon size={32} name="rightcircle" />
        </Pressable>
      </View>

      <View style={styles.confirmBtn}>
        <Button title="Add session" onPress={addSession} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 140 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  paginationPanel: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 64,
    width: "100%",
    paddingHorizontal: 8,
  },
  weekBtn: { justifyContent: "center", height: 44 },
  weekPicker: { flex: 1, paddingHorizontal: 12 },
  confirmBtn: { position: "absolute", bottom: 0, width: "100%" },
});

export default SessionList;
