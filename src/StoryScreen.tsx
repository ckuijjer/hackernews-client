import { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RenderHtml, { MixedStyleDeclaration } from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { StackParamList } from '../App';
import { useStory } from './hooks';
import { Comment as CommentType, Story as StoryType } from './types';
import { timeAgo } from './timeAgo';

const onPressA = (event: any, href: string) => {
  openInBrowser(href);
};

const openInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
};

const renderersProps = {
  a: {
    onPress: onPressA,
  },
};

const baseStyle: MixedStyleDeclaration = {
  fontSize: 17,
  lineHeight: 24,
};

const tagStyles = {
  p: {
    // backgroundColor: '#9f9',
  },
  pre: {
    backgroundColor: '#f99',
  },
  code: {
    backgroundColor: '#eee',
  },
};

const Comment = ({
  comment,
  level = 0,
  isFirst = false,
  isLast = false,
}: {
  comment: CommentType;
  level: number;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const [renderHtml, setRenderHtml] = useState(true);
  const { width } = useWindowDimensions();

  // TODO: so magic!
  const commentTextWidth = width - 20 * 2 - level * 8;

  return (
    <>
      <View style={styles.commentContainer}>
        <LevelIndicator
          level={level}
          isFirst={isFirst}
          isLast={isLast}
          hasChildren={comment.comments.length > 0}
        />
        <View
          style={[styles.commentInnerContainer, { width: commentTextWidth }]}
        >
          <Pressable onPress={() => setRenderHtml(!renderHtml)}>
            <View style={styles.metadataContainer}>
              <Text style={styles.metadata}>{comment.user}</Text>
              <Text style={styles.metadata}>
                {timeAgo.format(comment.createdAt, 'mini')}
              </Text>
            </View>
            {renderHtml ? (
              <RenderHtml
                source={{ html: comment.text ?? '' }}
                renderersProps={renderersProps}
                tagsStyles={tagStyles}
                baseStyle={baseStyle}
                enableExperimentalMarginCollapsing
                contentWidth={commentTextWidth}
              />
            ) : (
              <Text style={styles.commentText}>{comment.text}</Text>
            )}
          </Pressable>
        </View>
      </View>
      {comment.comments.map((childComment, i, children) => (
        <Comment
          comment={childComment}
          level={level + 1}
          key={childComment.id}
          isFirst={i === 0}
          isLast={i === children.length - 1}
        />
      ))}
    </>
  );
};

// unreadable and has issues still
const LevelIndicator = ({
  level,
  isFirst,
  isLast,
  hasChildren,
}: {
  level: number;
  isFirst: boolean;
  isLast: boolean;
  hasChildren: boolean;
}) => {
  return (
    <View style={styles.levelIndicator}>
      {Array.from({ length: level })
        .fill(0)
        .map((_, index) => {
          const isLastLevel = index === level - 1;
          const styling = {
            marginTop: isLastLevel && isFirst ? 8 : 0,
            marginBottom: isLastLevel && isLast && !hasChildren ? 8 : 0,
          };
          return (
            <View key={index} style={[styles.levelIndicatorLine, styling]} />
          );
        })}
    </View>
  );
};

type Props = NativeStackScreenProps<StackParamList, 'Story'>;

export const StoryScreen = ({ route, navigation }: Props) => {
  const { id, title } = route.params;
  const { story, isLoading, isRefreshing, onRefresh } = useStory(id);

  const { width } = useWindowDimensions();

  // navigation.setOptions({ title: story?.title ?? title });

  const onPressStoryTitle = () => {
    openInBrowser(story?.url ?? '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Pressable onPress={onPressStoryTitle}>
          <Header>{story?.title ?? ''}</Header>
        </Pressable>
        <View style={styles.storyTextContainer}>
          <RenderHtml
            source={{ html: story?.text ?? '' }}
            renderersProps={renderersProps}
            tagsStyles={tagStyles}
            baseStyle={baseStyle}
            enableExperimentalMarginCollapsing
            contentWidth={width}
          />
        </View>
        {story?.comments?.map((comment, i, children) => (
          <Comment
            comment={comment}
            level={0}
            key={comment.id}
            isFirst={i === 0}
            isLast={i === children.length - 1}
          />
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const Header = ({ children }: { children: string }) => {
  const { width } = useWindowDimensions();

  const baseStyle: MixedStyleDeclaration = {
    fontSize: 34,
    fontWeight: 'bold',
  };

  return (
    <View style={styles.headerContainer}>
      <RenderHtml
        source={{ html: children }}
        baseStyle={baseStyle}
        contentWidth={width}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  storyTextContainer: {
    paddingHorizontal: 20,
  },
  storyText: {
    // fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.40799999237060547,
  },
  commentContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    // backgroundColor: '#9f9',
    width: '100%',
  },
  commentInnerContainer: {
    // backgroundColor: '#f99',
    paddingVertical: 8,
  },
  commentText: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.40799999237060547,
  },
  levelIndicator: {
    flexDirection: 'row',
  },
  levelIndicatorLine: {
    width: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e5ea',
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metadata: {
    color: '#3C3C4399',
    fontSize: 15,
    lineHeight: 20,
  },
});
