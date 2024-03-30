import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import { Text, Button, Pressable, View, StyleSheet } from "react-native";
import { useStore } from "../../store";
import { router } from "expo-router";

const NewSession = () => {
  const { addSession } = useStore();
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
  }, [date]);

  return (
    <>
      <Pressable
        style={styles.selectedDate}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toLocaleDateString("ru-RU")}</Text>
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
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewSession;
