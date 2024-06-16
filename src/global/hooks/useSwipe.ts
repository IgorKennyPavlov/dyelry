import { useRef } from "react";
import { Dimensions } from "react-native";
import { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

const windowWidth = Dimensions.get("window").width;

export function useSwipe(
  onSwipeLeft?: (e: GestureResponderEvent) => void,
  onSwipeRight?: (e: GestureResponderEvent) => void,
  rangeOffset = 4,
) {
  const startRef = useRef(0);

  // set user touch start position
  const onTouchStart = (e: GestureResponderEvent) =>
    (startRef.current = e.target === e.currentTarget ? e.nativeEvent.pageX : 0);

  // when touch ends check for swipe directions
  const onTouchEnd = (e: GestureResponderEvent) => {
    if (!startRef.current) {
      return;
    }

    // get touch position and screen size
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth / rangeOffset;

    // check if swipe is wide enough
    if (Math.abs(positionX - startRef.current) < range) {
      return;
    }

    // check direction
    startRef.current - positionX > 0 ? onSwipeLeft?.(e) : onSwipeRight?.(e);
    startRef.current = 0;
  };

  return { onTouchStart, onTouchEnd };
}
