import { StyleSheet } from "react-native";

export const listItemCommonStyles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 12,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  plaque: {
    height: 44,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
    borderRadius: 8,
  },
});
