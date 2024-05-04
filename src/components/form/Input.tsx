import { useState, useCallback } from "react";
import { Controller, Control } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputContentSizeChangeEventData,
  NativeSyntheticEvent,
} from "react-native";
import { InputModeOptions } from "react-native/Libraries/Components/TextInput/TextInput";

interface InputProps {
  control: Control<any>;
  name: string;
  inputMode?: InputModeOptions;
  multiline?: boolean;
  required?: boolean;
}

export const Input = (props: InputProps) => {
  const { control, name, inputMode, multiline, required } = props;

  const [commentHeight, setCommentHeight] = useState(0);

  const updateHeight = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (multiline) {
        setCommentHeight(e.nativeEvent.contentSize.height + 24);
      }
    },
    [multiline],
  );

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {required && <Text style={styles.required}>* </Text>}
        {name}
      </Text>

      <Controller
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            inputMode={inputMode}
            multiline={multiline}
            style={{
              ...styles.textField,
              height: multiline ? commentHeight : 44,
            }}
            value={value}
            onChangeText={(value) => onChange(value)}
            onBlur={onBlur}
            onContentSizeChange={updateHeight}
          />
        )}
        rules={{ required: true }}
        name={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldWrap: { marginTop: 20 },
  label: { textTransform: "capitalize" },
  required: { color: "red" },
  textField: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
  },
});
