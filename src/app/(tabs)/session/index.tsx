import AntIcon from "@expo/vector-icons/AntDesign";
import { Tabs, router } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";

import { SessionListItem, DatePicker } from "../../../components";
import {
  useSelectedWeek,
  useHorizontalSwipeAnimation,
  useSwipe,
  listItemCommonStyles,
} from "../../../global";
import type { SessionProps } from "../../../global/types";
import { useSessionsStore } from "../../../store";
import { SESSIONS } from "../../../store/keys";

const SessionList = () => {
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { week, control, shiftWeek, selectDate } = useSelectedWeek(sessions);
  const { monday, sunday, weekSessions } = week;

  const { animateSwipe, animatedXPos } = useHorizontalSwipeAnimation();
  const screenWidth = Dimensions.get("window").width;

  const { onTouchStart, onTouchEnd } = useSwipe(
    () => animateSwipe(-screenWidth, screenWidth, () => shiftWeek(1)),
    () => animateSwipe(screenWidth, -screenWidth, () => shiftWeek(-1)),
  );

  const addSession = useCallback(() => {
    router.push(`/session/editor`);
  }, []);

  const headerTitle = useMemo(() => {
    const o: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" };
    const mondayString = monday.toLocaleDateString("ru-RU", o);
    const sundayString = sunday.toLocaleDateString("ru-RU", o);
    return `Session List (${mondayString} - ${sundayString})`;
  }, [monday, sunday]);

  return (
    <>
      <Tabs.Screen options={{ headerTitle }} />

      <Animated.View
        style={{
          ...styles.swipeable,
          transform: [{ translateX: animatedXPos }],
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {weekSessions?.length ? (
          <View style={styles.list}>
            <View style={listItemCommonStyles.header}>
              <Text style={{ width: "25%" }}>Date</Text>
              <Text style={{ width: "45%" }}>Title</Text>
              <Text style={{ width: "20%" }}>Duration</Text>
              <Text style={{ width: "10%" }}>Edit</Text>
            </View>

            <FlatList
              data={weekSessions}
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
      </Animated.View>

      <View style={styles.paginationPanel}>
        <Pressable style={styles.weekBtn} onPress={() => shiftWeek(-1)}>
          <AntIcon size={32} name="leftcircle" />
        </Pressable>
        <DatePicker
          style={styles.weekPicker}
          name="targetDate"
          label="target date"
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
  swipeable: { flexGrow: 1 },
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
