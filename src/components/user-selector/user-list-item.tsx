import { Text, ListRenderItemInfo, Pressable, Alert } from "react-native";

import { listItemCommonStyles } from "../../global";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUsersStore, clearUserStoredData } from "../../store";
import { useCallback } from "react";
import type { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";
import { useTranslation } from "react-i18next";

export const UserListItem = (props: ListRenderItemInfo<string>) => {
  const { t } = useTranslation();
  const username = props.item;

  const { selectUser, deleteUser } = useUsersStore();

  const removeUser = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();

      Alert.alert(
        t("alert.confirmDeleteUser.title", { username }),
        t("alert.confirmDeleteUser.text"),
        [
          { text: t("action.cancel"), style: "cancel" },
          {
            text: t("action.confirm"),
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
