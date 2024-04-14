import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import { Text, Button, Pressable, View, StyleSheet } from "react-native";

import { useNavigate } from "../../global";
import { useSessionsStore, useTargetStore } from "../../store";

const NewSession = () => {
  const { navigate } = useNavigate();
  const { addSession } = useSessionsStore();
  const { setTargetSessionId } = useTargetStore();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectDate = useCallback((_: DateTimePickerEvent, date: Date) => {
    setDate(date);
    setShowDatePicker(false);
  }, []);

  const createNewSession = useCallback(() => {
    const id = Date.now().toString();
    addSession({ id, start: date });
    setTargetSessionId(id);
    navigate("/session/view");
  }, [addSession, date, navigate, setTargetSessionId]);

  return (
    <>
      <View style={styles.selectedDate}>
        <Pressable
          style={styles.dateTextWrap}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {date.toLocaleDateString("ru-RU")}
          </Text>
        </Pressable>
      </View>
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
  dateTextWrap: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 20,
  },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewSession;
