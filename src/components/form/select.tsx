import { Picker } from "@react-native-picker/picker";
import { Controller, Control } from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
  type TextStyle,
  ViewStyle,
} from "react-native";

import { formCommonStyles } from "./form-common-styles";

interface SelectOption {
  value: any;
  label: string;
  style?: TextStyle;
}

interface SelectProps {
  control: Control<any>;
  name: string;
  options: SelectOption[];
  label?: string;
  style?: ViewStyle;
  required?: boolean;
}

export const Select = (props: SelectProps) => {
  const { control, name, label, style, options, required } = props;

  return (
    <View style={style}>
      <Text style={styles.label}>
        {required && <Text style={styles.required}>* </Text>}
        {label || name}
      </Text>

      <Controller
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <Picker
            style={styles.selectField}
            selectedValue={value}
            onValueChange={onChange}
            onBlur={onBlur}
          >
            {options.map(({ value, label, style }) => (
              <Picker.Item
                style={style}
                key={label}
                label={label}
                value={value}
              />
            ))}
          </Picker>
        )}
        name={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ...formCommonStyles,
  selectField: { minHeight: 44, fontSize: 20, textAlign: "left" },
});
