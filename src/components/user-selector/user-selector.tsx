import { useUsersStore } from "../../store";
import { useCallback } from "react";
import { Input } from "../forms";
import { useForm } from "react-hook-form";
import {
  View,
  Button,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
} from "react-native";
import { UserListItem } from "./user-list-item";
import { USERS } from "../../store/keys";
import { useTranslation } from "react-i18next";
import { LangSelector } from "../i18n";

interface ActiveUserForm {
  newUser: string;
}

export const UserSelector = () => {
  const { t } = useTranslation();
  const { [USERS]: users, addUser } = useUsersStore();

  const { getValues, control, reset } = useForm<ActiveUserForm>();

  const addNewUser = useCallback(() => {
    const formValues = getValues();
    const newUser = formValues.newUser?.trim();

    // TODO add proper validation
    if (!newUser) {
      alert(t("alert.fillRequired"));
      return;
    }

    if (users[newUser] !== undefined) {
      alert(t("alert.userExists", { newUser }));
      return;
    }

    addUser(newUser);
    reset();
  }, [users, getValues]);

  return (
    <>
      {/*TODO include in stack to use not custom, but stack header?*/}
      <View style={styles.header}>
        <Text style={styles.headerText}>{t("header.userSelect")}</Text>
        <LangSelector />
      </View>

      <Input
        style={styles.field}
        label={t("label.newUser")}
        control={control}
        name="newUser"
        inputMode="text"
        required
      />
      <View style={{ marginTop: 12 }}>
        <Button title={t("action.add")} onPress={addNewUser} />
      </View>

      <View style={styles.list}>
        <FlatList
          data={Object.keys(users).sort()}
          renderItem={(props: ListRenderItemInfo<string>) => (
            <UserListItem {...props} />
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 64,
    backgroundColor: "#1c357f",
    paddingHorizontal: 12,
  },
  headerText: { color: "#fff", fontSize: 16 },
  field: { marginTop: 20 },
  list: { paddingBottom: 110 },
});
