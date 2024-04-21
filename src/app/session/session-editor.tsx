import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import { Text, Button, Pressable, View, StyleSheet } from "react-native";

import { useNavigate, SessionProps } from "../../global";
import { useSessionsStore, useTargetStore } from "../../store";
import { useTarget } from "../../store/useTarget";

const SessionEditor = () => {
  const { navigate } = useNavigate();
  const { addSession, editSession } = useSessionsStore();
  const { targetSessionId } = useTargetStore();
  const { targetSession } = useTarget();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectDate = useCallback((_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setDate(date);
    }

    setShowDatePicker(false);
  }, []);

  const saveSession = useCallback(() => {
    if (!targetSessionId) {
      return;
    }

    const sessionData: SessionProps = { id: targetSessionId, start: date };

    if (targetSession) {
      editSession(targetSessionId, sessionData);
      navigate("/");
      return;
    }

    addSession(sessionData);
    navigate("/session/view");
  }, [addSession, date, editSession, navigate, targetSession, targetSessionId]);

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
        <Button
          title={`${targetSession ? "Update" : "Add"} session`}
          onPress={saveSession}
        />
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

export default SessionEditor;
