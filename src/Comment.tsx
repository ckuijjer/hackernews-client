import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native-gesture-handler';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { RenderHtml } from './RenderHtml';
import { Comment as CommentType } from './connectors/types';
import { timeAgo } from './utils/timeAgo';
import { CommentLevelIndicator } from './CommentLevelIndicator';
import { Icon } from './Icon';

const PADDING_HORIZONTAL = 20;
const LEVEL_WIDTH = 8;
const SWIPEABLE_ACTIONS_WIDTH = 96;

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

  const commentTextWidth = width - 2 * PADDING_HORIZONTAL - level * LEVEL_WIDTH;

  const renderRightActions = (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
    swipeableMethods: SwipeableMethods,
  ) => {
    return (
      <CollapseAction
        progress={progress}
        drag={drag}
        swipeableMethods={swipeableMethods}
        isCollapsed={collapsed}
        onAction={onAction}
      />
    );
  };

  return (
    <>
      {hidden ? null : (
        <Swipeable
          renderRightActions={renderRightActions}
          containerStyle={styles.pressableContainer}
          friction={2}
          rightThreshold={40}
          overshootFriction={8}
          hitSlop={{ left: -20 }} // To have space room for react-navigation's swipe back gesture
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
  drag,
  swipeableMethods,
  isCollapsed,
  onAction,
}: {
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  swipeableMethods: SwipeableMethods;
  isCollapsed: boolean;
  onAction: () => void;
}) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + SWIPEABLE_ACTIONS_WIDTH }],
    };
  });

  const text = isCollapsed ? 'Uncollapse' : 'Collapse';

  const handlePress = () => {
    swipeableMethods.close();
    onAction();
  };

  return (
    <Reanimated.View style={[styles.actionsContainer, styleAnimation]}>
      <Pressable onPress={handlePress} style={styles.action}>
        <SymbolView
          name="arrow.down.right.and.arrow.up.left"
          size={24}
          tintColor="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>{text}</Text>
      </Pressable>
    </Reanimated.View>
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
  },
  action: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PlatformColor('link'),
    width: SWIPEABLE_ACTIONS_WIDTH,
  },
  actionIcon: {
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
  },
});
