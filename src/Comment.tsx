import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { RenderHtml } from './RenderHtml';
import { Comment as CommentType } from './types';
import { timeAgo } from './timeAgo';
import { LevelIndicator } from './LevelIndicator';

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

  // TODO: so magic!
  const commentTextWidth = width - 20 * 2 - level * 8;

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
                  <Ionicons name="time-outline" size={15} color="#3C3C4399" />{' '}
                  {timeAgo.format(comment.createdAt, 'mini')}
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
      {comment.comments.map((childComment, i, children) => (
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    // backgroundColor: '#9f9',
    width: '100%',
  },
  innerContainer: {
    // backgroundColor: '#f99',
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
