import { Text, ListRenderItemInfo, Pressable, Alert } from "react-native";

import { listItemCommonStyles } from "../../global";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUsersStore, clearUserStoredData } from "../../store";
import { useCallback } from "react";
import type { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

export const UserListItem = (props: ListRenderItemInfo<string>) => {
  const username = props.item;

  const { selectUser, deleteUser } = useUsersStore();

  const removeUser = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();

      Alert.alert(
        `Deleting user ${username}`,
        `All the training data of this user will also be permanently removed. Make sure you've exported all the necessary data.\n\nDo you really want to continue?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            style: "default",
            onPress: async () => {
              await clearUserStoredData(username);
              deleteUser(username);
            },
          },
        ],
        { cancelable: true },
      );
    },
    [username, deleteUser],
  );

  return (
    <Pressable style={styles.plaque} onPress={() => selectUser(username)}>
      <Text style={{ width: "90%" }}>{username}</Text>
      <AntDesign name="closecircleo" size={24} onPress={removeUser} />
    </Pressable>
  );
};

const styles = listItemCommonStyles;
