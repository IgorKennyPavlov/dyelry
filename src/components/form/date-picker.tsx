import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState, useCallback } from "react";
import { Control, useController } from "react-hook-form";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";

import { formCommonStyles } from "./form-common-styles";

interface DatePickerProps {
  name: string;
  control: Control<any>;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  required?: boolean;
}

export const DatePicker = (props: DatePickerProps) => {
  const { name, label, style, control, required, onChange } = props;
  const { field } = useController({ name, control });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateChangeHandler = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      setShowDatePicker(false);
      onChange(event, date);
    },
    [onChange],
  );

  return (
    <View style={style}>
      <Text style={styles.label}>
        {required && <Text style={styles.required}>* </Text>}
        {label || name}
      </Text>

      <Pressable style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateField}>
          {field.value.toLocaleDateString("ru-RU")}
        </Text>
      </Pressable>

      {showDatePicker && (
        <RNDateTimePicker
          value={field.value}
          locale="ru-RU"
          onChange={dateChangeHandler}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ...formCommonStyles,
  dateBtn: {
    height: 44,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
  },
  dateField: { fontSize: 20 },
});
