import React, { useState, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
  PlatformColor,
  Animated,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Swipeable } from 'react-native-gesture-handler';

import { RenderHtml } from './RenderHtml';
import { Comment as CommentType } from './types';
import { timeAgo } from './timeAgo';
import { CommentLevelIndicator } from './CommentLevelIndicator';
import { Icon } from './Icon';

const PADDING_HORIZONTAL = 20;
const LEVEL_WIDTH = 8;

type CommentProps = {
  comment: CommentType;
  level: number;
  hidden: boolean;
  collapsed: boolean;
  numberOfChildren: number;
  onAction: () => void;
};

export const Comment = ({
  comment,
  level = 0,
  hidden = false,
  collapsed = false,
  numberOfChildren = 0,
  onAction = () => {},
}: CommentProps) => {
  const { width } = useWindowDimensions();
  const swipeRef = useRef<Swipeable>();

  const commentTextWidth = width - 2 * PADDING_HORIZONTAL - level * LEVEL_WIDTH;

  const renderRightActions = (progress) => {
    return (
      <CollapseAction
        progress={progress}
        isCollapsed={collapsed}
        onAction={() => {
          swipeRef?.current?.close();
          onAction();
        }}
      />
    );
  };

  return (
    <>
      {hidden ? null : (
        <Swipeable
          renderRightActions={renderRightActions}
          containerStyle={styles.pressableContainer}
          ref={swipeRef}
          friction={2}
          // enabled={false}
          hitSlop={{ left: -20 }} // To have space room for react-navigation's swipe back gesture
          // onGestureEvent={(...args) => console.log('onGestureEvent', ...args)}
          // onHandlerStateChange={(...args) =>
          //   console.log('onHandlerStateChange', ...args)
          // }
        >
          <Pressable onPress={onAction}>
            <View style={styles.container}>
              <CommentLevelIndicator level={level} />
              <View
                style={[styles.innerContainer, { width: commentTextWidth }]}
              >
                <View style={styles.metadataContainer}>
                  <Text style={styles.metadata}>{comment.user}</Text>
                  {collapsed ? (
                    <Icon name="bubble">+{numberOfChildren}</Icon>
                  ) : (
                    <Icon name="clock">{timeAgo(comment.createdAt)}</Icon>
                  )}
                </View>
                {!collapsed && (
                  <RenderHtml
                    source={{ html: comment.text ?? '' }}
                    contentWidth={commentTextWidth}
                  />
                )}
              </View>
            </View>
          </Pressable>
        </Swipeable>
      )}
    </>
  );
};

const CollapseAction = ({
  progress,
  isCollapsed,
  onAction,
}: {
  progress: Animated.AnimatedInterpolation<number>;
  isCollapsed: boolean;
  onAction: () => void;
}) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [96, 0],
  });

  if (progress.__getValue() > 2) {
    onAction();
  }

  const text = isCollapsed ? 'Uncollapse' : 'Collapse';

  return (
    <Animated.View
      style={[styles.actionsContainer, { transform: [{ translateX: trans }] }]}
    >
      <Pressable onPress={onAction} style={styles.action}>
        <SymbolView
          name="arrow.down.right.and.arrow.up.left"
          size={24}
          tintColor="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING_HORIZONTAL,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: PlatformColor('systemBackground'),
  },
  innerContainer: {
    paddingVertical: 8,
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metadata: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
  pressableContainer: {
    backgroundColor: PlatformColor('link'),
  },
  actionsContainer: {
    flexDirection: 'row',
    // backgroundColor: PlatformColor('link'),
  },
  action: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PlatformColor('link'),
    width: 96,
  },
  actionIcon: {
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
  },
});
