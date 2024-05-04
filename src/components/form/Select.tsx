import { Picker } from "@react-native-picker/picker";
import { Controller, Control } from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type TextStyle,
} from "react-native";

interface SelectOption {
  value: any;
  label: string;
  style: StyleProp<TextStyle>;
}

interface SelectProps {
  control: Control<any>;
  name: string;
  options: SelectOption[];
  required?: boolean;
}

export const Select = (props: SelectProps) => {
  const { control, name, options, required } = props;

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {required && <Text style={styles.required}>* </Text>}
        {name}
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
                key={value}
                label={label}
                value={value}
              />
            ))}
          </Picker>
        )}
        name="feels"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldWrap: { marginTop: 20 },
  label: { textTransform: "capitalize" },
  required: { color: "red" },
  selectField: { minHeight: 44, fontSize: 20, textAlign: "left" },
});
