import React, { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  View,
  PanResponder,
  PlatformColor,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVIGATION_BAR_HEIGHT = 44;
const BUTTON_SIZE = 44;
const BUTTON_MARGIN = 80;

export const FloatingButton = ({ onPress = () => {} }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const pan = useRef(
    new Animated.ValueXY({
      x: BUTTON_MARGIN,
      y:
        height -
        insets.top -
        insets.bottom -
        BUTTON_SIZE -
        BUTTON_MARGIN -
        NAVIGATION_BAR_HEIGHT,
    }),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      >
        <Pressable style={styles.button} onPress={onPress}>
          <Ionicons
            name="chevron-down-circle-outline"
            size={BUTTON_SIZE}
            color={PlatformColor('link')}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  button: {
    backgroundColor: PlatformColor('systemBackground'),
    borderRadius: BUTTON_SIZE / 2,
  },
});
