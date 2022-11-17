import { Pressable, useWindowDimensions } from 'react-native';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RenderHtml from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';

import { useStory } from './hooks';
import { Comment as CommentType, Story as StoryType } from './types';

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

const Comment = ({
  comment,
  level = 0,
}: {
  comment: CommentType;
  level: number;
}) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <View style={[styles.commentContainer, { paddingLeft: 20 + level * 8 }]}>
        <View style={styles.commentInnerContainer}>
          <RenderHtml
            contentWidth={width}
            source={{ html: comment.text ?? '' }}
            renderersProps={renderersProps}
          />
        </View>
      </View>
      {comment.comments.map((childComment) => (
        <Comment
          comment={childComment}
          level={level + 1}
          key={childComment.id}
        />
      ))}
    </>
  );
};

export const StoryScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const { id, title } = route.params;
  const { story, isLoading, isRefreshing, onRefresh } = useStory(id);

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
          <Header>{story?.title ?? title ?? ''}</Header>
        </Pressable>
        <View style={styles.storyTextContainer}>
          <RenderHtml
            contentWidth={width}
            source={{ html: story?.text ?? '' }}
            renderersProps={renderersProps}
          />
        </View>
        {story?.comments?.map((comment) => (
          <Comment comment={comment} level={0} key={comment.id} />
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const Header = ({ children }: { children: string }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.headerContainer}>
      <RenderHtml contentWidth={width} source={{ html: children }} />
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
  },
  commentInnerContainer: {
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    // backgroundColor: '#f99',
  },
  commentText: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.40799999237060547,
  },
});
