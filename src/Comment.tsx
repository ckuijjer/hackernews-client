import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';

import { RenderHtml } from './RenderHtml';
import { Comment as CommentType } from './types';
import { timeAgo } from './timeAgo';
import { LevelIndicator } from './LevelIndicator';
import { Icon } from './Icon';

const PADDING_HORIZONTAL = 20;
const LEVEL_WIDTH = 8;

const getNumberOfChildren = (comment: CommentType): number =>
  comment.comments.map(getNumberOfChildren).reduce((acc, cur) => acc + cur, 1);

export const Comment = ({
  comment,
  level = 0,
  hidden = false,
}: {
  comment: CommentType;
  level: number;
  hidden?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();

  const commentTextWidth = width - 2 * PADDING_HORIZONTAL - level * LEVEL_WIDTH;
  const numberOfChildren = getNumberOfChildren(comment);

  return (
    <>
      {hidden ? null : (
        <View style={styles.container}>
          <LevelIndicator level={level} />
          <View style={[styles.innerContainer, { width: commentTextWidth }]}>
            <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
              <View style={styles.metadataContainer}>
                <Text style={styles.metadata}>{comment.user}</Text>
                <Text style={styles.metadata}>
                  {isCollapsed ? (
                    <Icon name="chatbubble-outline">+{numberOfChildren}</Icon>
                  ) : (
                    <Icon name="time-outline">
                      {timeAgo.format(comment.createdAt, 'mini')}
                    </Icon>
                  )}
                </Text>
              </View>
              {!isCollapsed && (
                <RenderHtml
                  source={{ html: comment.text ?? '' }}
                  contentWidth={commentTextWidth}
                />
              )}
            </Pressable>
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING_HORIZONTAL,
    flexDirection: 'row',
    width: '100%',
  },
  innerContainer: {
    paddingVertical: 8,
  },
  text: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.40799999237060547,
    color: PlatformColor('label'),
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
});
