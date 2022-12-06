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
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { RenderHtml } from './RenderHtml';
import { Comment as CommentType } from './types';
import { timeAgo } from './timeAgo';
import { CommentLevelIndicator } from './CommentLevelIndicator';
import { Icon } from './Icon';

const PADDING_HORIZONTAL = 20;
const LEVEL_WIDTH = 8;

const getNumberOfChildren = (comment: CommentType): number =>
  comment.comments.map(getNumberOfChildren).reduce((acc, cur) => acc + cur, 1);

type CommentProps = {
  comment: CommentType;
  level: number;
  hidden: boolean;
};

export const Comment = ({
  comment,
  level = 0,
  hidden = false,
}: CommentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const swipeRef = useRef<Swipeable>();

  const commentTextWidth = width - 2 * PADDING_HORIZONTAL - level * LEVEL_WIDTH;
  const numberOfChildren = getNumberOfChildren(comment);

  const renderRightActions = (progress) => {
    return (
      <CollapseAction
        progress={progress}
        onAction={() => {
          swipeRef?.current?.close();
          setIsCollapsed(true);
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
        >
          <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
            <View style={styles.container}>
              <CommentLevelIndicator level={level} />
              <View
                style={[styles.innerContainer, { width: commentTextWidth }]}
              >
                <View style={styles.metadataContainer}>
                  <Text style={styles.metadata}>{comment.user}</Text>
                  {isCollapsed ? (
                    <Icon name="chatbubble-outline">+{numberOfChildren}</Icon>
                  ) : (
                    <Icon name="time-outline">
                      {timeAgo(comment.createdAt)}
                    </Icon>
                  )}
                </View>
                {!isCollapsed && (
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
      {comment.comments.map((childComment) => (
        <Comment
          comment={childComment}
          level={level + 1}
          key={childComment.id}
          hidden={isCollapsed || hidden}
        />
      ))}
    </>
  );
};

const CollapseAction = ({
  progress,
  onAction,
}: {
  progress: Animated.AnimatedInterpolation<number>;
  onAction: () => void;
}) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [96, 0],
  });

  if (progress.__getValue() > 2) {
    onAction();
  }

  return (
    <Animated.View
      style={[styles.actionsContainer, { transform: [{ translateX: trans }] }]}
    >
      <Pressable onPress={onAction} style={styles.action}>
        <Ionicons
          name="contract"
          size={24}
          color="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>Collapse</Text>
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
    // padding: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
  },
});
