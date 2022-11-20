import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';

import { RenderHtml } from './RenderHtml';
import type { StackParamList } from '../App';
import { Comment } from './Comment';
import { MixedStyleDeclaration } from 'react-native-render-html';
import { getStory } from './connectors/hackernews';
import { useQuery } from '@tanstack/react-query';

const openInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
};

type Props = NativeStackScreenProps<StackParamList, 'Story'>;

export const StoryScreen = ({ route, navigation }: Props) => {
  const { id, title } = route.params;

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getStory(id),
  });

  const { width } = useWindowDimensions();

  // navigation.setOptions({ title: story?.title ?? title });

  const onPressStoryTitle = () => {
    openInBrowser(data?.url ?? '');
  };

  //   <FlashList
  //   data={stories}
  //   renderItem={renderItem}
  //   keyExtractor={(item) => '' + item.id}
  // />
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <Pressable onPress={onPressStoryTitle}>
          <Header>{data?.title ?? ''}</Header>
        </Pressable>
        <View style={styles.storyTextContainer}>
          <View style={styles.metadataContainer}>
            {data?.user && data?.createdAt && (
              <Text style={styles.metadata}>
                by {data.user} on{' '}
                {data.createdAt.toLocaleDateString('en-US', {
                  dateStyle: 'medium',
                })}{' '}
                at{' '}
                {data.createdAt.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Text>
            )}
          </View>
          <RenderHtml
            source={{ html: data?.text ?? '' }}
            contentWidth={width}
          />
        </View>
        <FlashList
          data={data?.comments}
          renderItem={({ item }) => (
            <Comment comment={item} level={0} key={item.id} />
          )}
          keyExtractor={(comment) => '' + comment.id}
        />
      </ScrollView>
      <StatusBar style="auto" />
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
    marginHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PlatformColor('separator'),
    paddingBottom: 4,
    marginBottom: 8,
  },
  metadataContainer: {
    marginBottom: 4,
  },
  metadata: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
});
