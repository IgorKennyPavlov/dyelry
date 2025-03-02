import { Checkbox as ExpoCheckbox } from "expo-checkbox";
import { Controller, Control } from "react-hook-form";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

import { formCommonStyles } from "../../global";

interface SelectProps {
  control: Control<any>;
  name: string;
  label?: string;
  style?: ViewStyle;
  required?: boolean;
}

export const Checkbox = (props: SelectProps) => {
  const { control, name, label, style, required } = props;

  return (
    <View style={{ ...styles.selectField, ...style }}>
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <ExpoCheckbox
            value={value}
            onValueChange={onChange}
            color={value ? "#4630EB" : undefined}
          />
        )}
        name={name}
      />

      <Text style={styles.label}>
        {required && <Text style={styles.required}>* </Text>}
        {label || name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ...formCommonStyles,
  selectField: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    height: 44,
  },
});
