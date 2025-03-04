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

import { SessionListItem } from "../../../components";
import {
  useSwipe,
  useHorizontalSwipeAnimation,
  listItemCommonStyles,
} from "../../../global";
import { useTemplatesStore } from "../../../store";
import type { SessionProps } from "../../../global/types";
import { router } from "expo-router";
import { TEMPLATES } from "../../../store/keys";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

const Templates = () => {
  const { t } = useTranslation();
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

  const { animateSwipe, animatedXPos } = useHorizontalSwipeAnimation();
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
              <Text style={{ width: "75%" }}>
                {t("list.template.tag").toUpperCase()}
              </Text>
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
            <Text>{t("list.template.empty.title")}</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.confirmBtn}>
        <Button title={t("action.addTemplate")} onPress={addTemplate} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  swipeable: { flexGrow: 1 },
  list: { paddingBottom: 116 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  confirmBtn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Templates;
