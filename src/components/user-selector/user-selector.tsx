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
} from "react-native";
import { UserListItem } from "./user-list-item";
import { USERS } from "../../store/keys";

interface ActiveUserForm {
  newUser: string;
}

export const UserSelector = () => {
  const { [USERS]: users, addUser } = useUsersStore();

  const { getValues, control, reset } = useForm<ActiveUserForm>();

  const addNewUser = useCallback(() => {
    const formValues = getValues();
    const newUser = formValues.newUser;

    if (users[newUser] !== undefined) {
      alert(`User ${newUser} already exists!`);
      return;
    }

    addUser(newUser);
    reset();
  }, [users, getValues]);

  return (
    <>
      <Input
        label="New user"
        control={control}
        name="newUser"
        inputMode="text"
      />
      <View style={{ marginTop: 12 }}>
        <Button title="Add" onPress={addNewUser} />
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
  list: { paddingBottom: 110 },
});
