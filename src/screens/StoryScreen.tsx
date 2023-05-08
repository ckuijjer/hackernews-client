import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  PlatformColor,
  FlatList,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StackScreenProps } from '@react-navigation/stack';

import { RenderHtml } from '../RenderHtml';
import type { StackParamList } from '../../App';
import { Comment } from '../Comment';
import { Comment as CommentType } from '../types';
import { MixedStyleDeclaration } from 'react-native-render-html';
import { getStory } from '../connectors/hackernews';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaPaddingBottom } from '../SafeAreaPaddingBottom';
import { Loading } from '../Loading';
import { FloatingButton } from '../FloatingButton';

const openInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
};

type Props = StackScreenProps<StackParamList, 'Story'>;

type UICommentType = {
  comment: Omit<CommentType, 'comments'>;
  level: number;
  hidden: boolean;
  collapsed: boolean;
  numberOfChildren: number;
};

const flattenComments = (
  comments: CommentType[] = [],
  level: number = 0,
): UICommentType[] => {
  const flatComments = comments.flatMap((comment, index) => {
    const { comments: children, ...rest } = comment;

    const flatChildren = flattenComments(children, level + 1);

    const flatComment: UICommentType = {
      comment: rest, // comment with children comments removed
      level,
      hidden: false,
      collapsed: false,
      numberOfChildren: flatChildren.length,
    };

    return [flatComment, ...flatChildren];
  });

  return flatComments;
};

const collapseAndHideComments = (
  comments: UICommentType[],
  collapsedComments: boolean[],
): UICommentType[] => {
  let collapseLevel: number | undefined = undefined;

  return comments.map((comment, index) => {
    const collapsed = collapsedComments[index];

    // if we're back at the collapse level, stop collapsing
    if (collapseLevel === comment.level) {
      collapseLevel = undefined;
    }

    // if the comment is collapsed, and its ancestors aren't collapsed, set the collapse level
    if (collapseLevel === undefined && collapsed) {
      collapseLevel = comment.level;
    }

    return {
      ...comment,
      collapsed,
      hidden: collapseLevel !== undefined && comment.level > collapseLevel,
    };
  });
};

export const StoryScreen = ({ route }: Props) => {
  const { id, title, url } = route.params;

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getStory(id),
  });

  const [collapsedComments, setCollapsedComments] = useState<boolean[]>([]);
  const [firstViewableComment, setFirstViewableComment] = useState<number>(0);

  useEffect(() => {
    setCollapsedComments(new Array(data?.comments?.length).fill(false));
  }, [data]);

  const flatListRef = useRef<FlatList>();

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    setFirstViewableComment(viewableItems[0].index);
  }, []);

  const handleScrollToIndexFailed = (error) => {
    // console.error(error);
  };

  const flatComments = flattenComments(data?.comments);
  const uiComments = collapseAndHideComments(flatComments, collapsedComments);

  const toggleComment = (index: number) => {
    const newCollapsedComments = [...collapsedComments];
    newCollapsedComments[index] = !newCollapsedComments[index];

    setCollapsedComments(newCollapsedComments);

    // only scroll if the currentItem starts outside of the viewport
    if (index === firstViewableComment) {
      flatListRef?.current?.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <>
      <FlatList
        data={uiComments}
        ref={flatListRef}
        renderItem={({ item, index }) => {
          return (
            <Comment
              comment={item.comment}
              level={item.level}
              key={item.id}
              hidden={item.hidden}
              collapsed={item.collapsed}
              numberOfChildren={item.numberOfChildren}
              onAction={() => toggleComment(index)}
            />
          );
        }}
        keyExtractor={(item) => '' + item.comment.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={() => (
          <ListHeader
            title={data?.title ?? title}
            user={data?.user}
            text={data?.text}
            createdAt={data?.createdAt}
            url={data?.url ?? url}
            isLoading={isLoading}
          />
        )}
        ListFooterComponentStyle={{
          minHeight: '100%',
        }}
        ListFooterComponent={() =>
          isLoading ? <Loading /> : <SafeAreaPaddingBottom />
        }
        style={styles.container}
        onViewableItemsChanged={handleViewableItemsChanged}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
      <FloatingButton
        onPress={() => {
          const nextAtRootLevel = uiComments.findIndex(
            (comment, index) =>
              index > firstViewableComment && comment.level === 0,
          );

          if (nextAtRootLevel) {
            flatListRef?.current?.scrollToIndex({
              index: nextAtRootLevel,
              animated: true,
            });
          }
        }}
      />
    </>
  );
};

type ListHeaderProps = {
  title: string;
  url: string;
  user?: string;
  createdAt?: Date;
  text?: string;
  isLoading: boolean;
};

const ListHeader = ({
  title,
  user,
  createdAt,
  text,
  url,
  isLoading,
}: ListHeaderProps) => {
  const { width } = useWindowDimensions();

  const humanReadableTimeAgo = createdAt
    ? ` on ${createdAt.toLocaleDateString('en-US', {
        dateStyle: 'medium',
      })} at ${createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    : '';

  return (
    <View style={styles.listHeader}>
      <Pressable onPress={() => openInBrowser(url)}>
        <Header>{title}</Header>
      </Pressable>
      {!isLoading && (
        <>
          <View style={styles.metadataContainer}>
            <Text style={styles.metadata}>
              by {user}
              {humanReadableTimeAgo}
            </Text>
          </View>
          {text && (
            <View style={styles.textContainer}>
              <RenderHtml source={{ html: text }} contentWidth={width} />
            </View>
          )}
          <View style={styles.separator} />
        </>
      )}
    </View>
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
  listHeader: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  headerContainer: {
    paddingBottom: 12,
  },
  textContainer: {
    marginBottom: 12,
  },
  separator: {
    borderBottomColor: PlatformColor('separator'),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  metadataContainer: {
    marginBottom: 12,
  },
  metadata: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
});
