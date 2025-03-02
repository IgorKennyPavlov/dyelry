import { useState, useCallback } from "react";
import { Controller, Control } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputContentSizeChangeEventData,
  NativeSyntheticEvent,
  ViewStyle,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { InputModeOptions } from "react-native/Libraries/Components/TextInput/TextInput";

import { formCommonStyles } from "../../global";

interface InputProps {
  control: Control<any>;
  name: string;
  label?: string;
  style?: ViewStyle;
  inputMode?: InputModeOptions;
  multiline?: boolean;
  autocomplete?: any[];
  required?: boolean;
}

export const Input = (props: InputProps) => {
  const { control, name, label, style, inputMode, multiline, required } = props;

  const [commentHeight, setCommentHeight] = useState(0);
  const [valueChanged, setValueChanged] = useState(false);

  const updateHeight = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (multiline) {
        setCommentHeight(e.nativeEvent.contentSize.height + 24);
      }
    },
    [multiline],
  );

  const renderAutocompleteList = (
    options: any[],
    value: string,
    onChange: (value: string) => void,
  ) => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.trim().toLowerCase()),
    );

    if (!filtered.length) {
      return;
    }

    return (
      <>
        <Pressable
          onPress={() => setValueChanged(false)}
          style={styles.autocompleteDismissOverlay}
        />
        <ScrollView style={styles.autocompleteList}>
          {filtered.map((option, idx) => (
            <Pressable
              key={idx}
              style={styles.autocompleteOption}
              onPress={() => {
                setValueChanged(false);
                onChange(option);
              }}
            >
              <Text style={styles.autocompleteOptionTitle}>{option}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={style}>
      <Text style={styles.label}>
        {required && <Text style={styles.required}>* </Text>}
        {label || name}
      </Text>

      <Controller
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <TextInput
              inputMode={inputMode}
              multiline={multiline}
              style={{
                ...styles.textField,
                height: multiline ? commentHeight : 44,
              }}
              value={value}
              onChangeText={(value: string) => {
                setValueChanged(true);
                onChange(value);
              }}
              onBlur={onBlur}
              onContentSizeChange={updateHeight}
            />
            {props.autocomplete &&
              value.trim() &&
              valueChanged &&
              renderAutocompleteList(props.autocomplete, value, onChange)}
          </>
        )}
        rules={{ required: true }}
        name={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ...formCommonStyles,
  textField: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
  },
  autocompleteDismissOverlay: {
    position: "absolute",
    minHeight: Dimensions.get("window").height,
    minWidth: Dimensions.get("window").width,
  },
  autocompleteList: {
    position: "absolute",
    top: "100%",
    zIndex: 9,
    width: "100%",
    maxHeight: 200,
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  autocompleteOption: {
    height: 40,
    justifyContent: "center",
    marginHorizontal: 12,
  },
  autocompleteOptionTitle: {
    fontSize: 20,
  },
});
