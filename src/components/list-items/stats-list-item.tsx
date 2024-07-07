import { Text, ListRenderItemInfo, View } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";

interface DataByMuscleProps {
  title: string;
  sets: number;
  weight: number;
}

export const StatsListItem = (props: ListRenderItemInfo<DataByMuscleProps>) => {
  const { title, sets, weight } = props.item;

  return (
    <View style={styles.plaque}>
      <Text style={{ width: "50%" }}>{title}</Text>
      <Text style={{ width: "25%" }}>{sets}</Text>
      <Text style={{ width: "25%" }}>{weight}</Text>
    </View>
  );
};

const styles = listItemCommonStyles;
