import { useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItemInfo,
  Animated,
  Button,
  Dimensions,
} from "react-native";

import { listItemCommonStyles, SessionListItem } from "../../../components";
import { TEMPLATES, useSwipe } from "../../../global";
import { useTemplatesStore } from "../../../store";
import type { SessionProps } from "../../../global/types";
import { useHorizontalSwipe } from "../../../decomposition/use-horizontal-swipe";
import { router } from "expo-router";

const PAGE_SIZE = 10;

const Templates = () => {
  const { [TEMPLATES]: templates } = useTemplatesStore();
  const [startIdx, setStartIdx] = useState(0);

  const page = useMemo(
    () => templates.slice(startIdx, startIdx + PAGE_SIZE),
    [templates, startIdx],
  );

  const changePage = (direction: number) => {
    const newIdx = startIdx + PAGE_SIZE * direction;
    setStartIdx(Math.max(Math.min(newIdx, templates.length), 0));
  };

  const { animateSwipe, animatedXPos } = useHorizontalSwipe();
  const screenWidth = Dimensions.get("window").width;

  const { onTouchStart, onTouchEnd } = useSwipe(
    () => animateSwipe(-screenWidth, screenWidth, () => changePage(1)),
    () => animateSwipe(screenWidth, -screenWidth, () => changePage(-1)),
  );

  const addTemplate = useCallback(() => {
    router.push({ pathname: `template/editor` });
  }, []);

  return (
    <>
      <Animated.View
        style={{
          ...styles.swipeable,
          transform: [{ translateX: animatedXPos }],
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {page?.length ? (
          <View style={styles.list}>
            <View style={listItemCommonStyles.header}>
              <Text style={{ width: "75%" }}>Title</Text>
              <Text style={{ width: "15%" }}>Create</Text>
              <Text style={{ width: "10%" }}>Edit</Text>
            </View>

            <FlatList
              data={page}
              renderItem={(props: ListRenderItemInfo<SessionProps>) => (
                <SessionListItem isTemplate={true} {...props} />
              )}
            />
          </View>
        ) : (
          <View style={styles.emptyList}>
            <Text>No templates created</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.confirmBtn}>
        <Button title="Create template" onPress={addTemplate} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  swipeable: { flexGrow: 1 },
  list: { paddingBottom: 50 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  confirmBtn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Templates;
