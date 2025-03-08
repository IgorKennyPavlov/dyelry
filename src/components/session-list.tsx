import AntIcon from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
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
import { useTranslation } from "react-i18next";
import { SESSIONS } from "../store/keys";
import { useSessionsStore } from "../store";
import {
  useSelectedWeek,
  useHorizontalSwipeAnimation,
  useSwipe,
  listItemCommonStyles,
} from "../global";
import { SessionProps } from "../global/types";
import { SessionListItem } from "./session";
import { DatePicker } from "./forms";

export const SessionList = () => {
  const { t } = useTranslation();
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

  const targetWeek = useMemo(() => {
    const o: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" };
    const mondayString = monday.toLocaleDateString("ru-RU", o);
    const sundayString = sunday.toLocaleDateString("ru-RU", o);
    return `(${mondayString} - ${sundayString})`;
  }, [t, monday, sunday]);

  return (
    <>
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
              <Text style={{ width: "25%" }}>
                {t("list.session.date").toUpperCase()}
              </Text>
              <Text style={{ width: "45%" }}>
                {t("list.session.tag").toUpperCase()}
              </Text>
              <Text style={{ width: "20%" }}>
                {t("list.session.duration").toUpperCase()}
              </Text>
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
            <Text>{t("list.session.empty.title")}</Text>
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
          label={`${t("label.targetDate")} ${targetWeek}`}
          control={control}
          onChange={selectDate}
        />
        <Pressable style={styles.weekBtn} onPress={() => shiftWeek(1)}>
          <AntIcon size={32} name="rightcircle" />
        </Pressable>
      </View>

      <View style={styles.confirmBtn}>
        <Button title={t("action.addSession")} onPress={addSession} />
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
