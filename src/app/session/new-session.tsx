import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Text, Button, Pressable, View, StyleSheet } from "react-native";

import { useSessionsStore } from "../../store";

const NewSession = () => {
  const { addSession } = useSessionsStore();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectDate = useCallback((_: DateTimePickerEvent, date: Date) => {
    setDate(date);
    setShowDatePicker(false);
  }, []);

  const createNewSession = useCallback(() => {
    const id = Date.now().toString();
    addSession({ id, start: date });
    router.push(`/session/${id}`);
  }, [addSession, date]);

  return (
    <>
      <Pressable
        style={styles.selectedDate}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{date.toLocaleDateString("ru-RU")}</Text>
      </Pressable>
      {showDatePicker && (
        <RNDateTimePicker value={date} locale="ru-RU" onChange={selectDate} />
      )}
      <View style={styles.confirmBtn}>
        <Button title="Create session" onPress={createNewSession} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectedDate: { flex: 1, justifyContent: "center", alignItems: "center" },
  dateText: { height: 44, fontSize: 20 },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewSession;
