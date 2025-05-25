import React from 'react';
import { SymbolView } from 'expo-symbols';
import {
  StyleSheet,
  View,
  PlatformColor,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const NAVIGATION_BAR_HEIGHT = 44;
const BUTTON_SIZE = 44;
const BUTTON_MARGIN = 80;

export const FloatingButton = ({ onPress = () => {} }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isPressed = useSharedValue(false);

  const initialPosition = {
    x: BUTTON_MARGIN, // defaults somewhere bottom left of the screen
    y:
      height -
      insets.top -
      insets.bottom -
      BUTTON_SIZE -
      BUTTON_MARGIN -
      NAVIGATION_BAR_HEIGHT,
  };

  const offset = useSharedValue(initialPosition);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
    };
  });

  const start = useSharedValue(initialPosition);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const tapGesture = Gesture.Tap().onEnd((event, success) => {
    console.log('Tapped!', { event, success });
    console.log('onPress', onPress);
    // onPress();
  });

  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.iconContainer, animatedStyles]}>
          <SymbolView
            name="circle.fill"
            size={BUTTON_SIZE}
            style={styles.iconBackground}
          />
          <SymbolView
            name="chevron.down.circle"
            size={BUTTON_SIZE}
            style={styles.icon}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'box-none',
  },
  iconContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  iconBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: PlatformColor('systemBackground'),
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: PlatformColor('link'),
  },
});
