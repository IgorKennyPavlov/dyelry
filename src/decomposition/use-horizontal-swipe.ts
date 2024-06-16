import { useRef } from "react";
import { Animated } from "react-native";

export const useHorizontalSwipe = () => {
  const animatedXPos = useRef(new Animated.Value(0)).current;
  const animateSwipe = (
    leaveTo: number,
    enterFrom: number,
    cb?: () => void,
  ) => {
    Animated.timing(animatedXPos, {
      toValue: leaveTo,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      animatedXPos.setValue(enterFrom);
      cb?.();
      Animated.timing(animatedXPos, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  return { animatedXPos, animateSwipe };
};
