import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import { Text, Button, Pressable, View, StyleSheet, Alert } from "react-native";

import { useNavigate, SessionProps } from "../../global";
import { usePersistentStore, useTargetStore } from "../../store";
import { useTarget } from "../../store/useTarget";

const SessionEditor = () => {
  const { navigate } = useNavigate();
  const { addSession, editSession, deleteSession } = usePersistentStore();
  const { targetSessionId, setTargetSessionId } = useTargetStore();
  const { targetSession } = useTarget();

  const [date, setDate] = useState(targetSession?.start || new Date());
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

  const confirmDelete = useCallback(() => {
    if (!targetSessionId) {
      return;
    }

    Alert.alert(
      "Deleting session",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            navigate("/");
            deleteSession(targetSessionId);
            setTargetSessionId(null);
          },
        },
      ],
      { cancelable: true },
    );
  }, [deleteSession, navigate, setTargetSessionId, targetSessionId]);

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

      {targetSession && (
        <View style={{ ...styles.btn, bottom: 40 }}>
          <Button title="Delete session" color="red" onPress={confirmDelete} />
        </View>
      )}

      <View style={styles.btn}>
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
  dateText: { fontSize: 20 },
  btn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default SessionEditor;
