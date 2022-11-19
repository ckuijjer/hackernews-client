import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RenderHtml, { MixedStyleDeclaration } from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import type { StackParamList } from '../App';
import { useStory } from './hooks';
import { Comment as CommentType, Story as StoryType } from './types';
import { timeAgo } from './timeAgo';
import { FlashList } from '@shopify/flash-list';

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
  color: PlatformColor('label'),
};

const tagStyles = {
  a: {
    color: PlatformColor('link'),
  },
  p: {
    // backgroundColor: '#9f9',
  },
  pre: {
    backgroundColor: PlatformColor('secondarySystemBackground'),
  },
  code: {
    // backgroundColor: '#eee',
  },
};

const Comment = ({
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
        <View style={styles.commentContainer}>
          <LevelIndicator level={level} />
          <View
            style={[styles.commentInnerContainer, { width: commentTextWidth }]}
          >
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
                  renderersProps={renderersProps}
                  tagsStyles={tagStyles}
                  baseStyle={baseStyle}
                  enableExperimentalMarginCollapsing
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

// unreadable and has issues still
const LevelIndicator = ({ level }: { level: number }) => {
  return (
    <View style={styles.levelIndicator}>
      {Array.from({ length: level })
        .fill(0)
        .map((_, index) => {
          return <View key={index} style={styles.levelIndicatorLine} />;
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

  //   <FlashList
  //   data={stories}
  //   renderItem={renderItem}
  //   keyExtractor={(item) => '' + item.id}
  // />
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
        <FlashList
          data={story?.comments}
          renderItem={({ item }) => (
            <Comment comment={item} level={0} key={item.id} />
          )}
          keyExtractor={(comment) => '' + comment.id}
        />
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
    color: PlatformColor('label'),
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
    backgroundColor: PlatformColor('systemBackground'),
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
    color: PlatformColor('label'),
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
    color: PlatformColor('label'),
  },
  levelIndicator: {
    flexDirection: 'row',
  },
  levelIndicatorLine: {
    width: 8,
    borderLeftWidth: 2,
    borderLeftColor: PlatformColor('separator'),
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
