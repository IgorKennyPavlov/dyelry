import { Text, ListRenderItemInfo, View } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";

interface DataByMuscleProps {
  title: string;
  sets: number;
  weight: [number, number];
}

export const StatsListItem = (props: ListRenderItemInfo<DataByMuscleProps>) => {
  const {
    title,
    sets,
    weight: [left, right],
  } = props.item;

  return (
    <View style={styles.plaque}>
      <Text style={{ width: "50%" }}>{title}</Text>
      <Text style={{ width: "25%" }}>{sets}</Text>
      <Text style={{ width: "25%" }}>
        {left === right ? left : `${left} | ${right}`}
      </Text>
    </View>
  );
};

const styles = listItemCommonStyles;
