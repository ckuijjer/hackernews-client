import React from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RenderHtml } from '../RenderHtml';
import type { StackParamList } from '../../App';
import { Comment } from '../Comment';
import { MixedStyleDeclaration } from 'react-native-render-html';
import { getStory } from '../connectors/hackernews';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaPaddingBottom } from '../SafeAreaPaddingBottom';
import { Loading } from '../Loading';

const openInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
};

type Props = NativeStackScreenProps<StackParamList, 'Story'>;

export const StoryScreen = ({ route }: Props) => {
  const { id, title, url } = route.params;

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getStory(id),
  });

  return (
    <FlatList
      data={data?.comments}
      renderItem={({ item }) => (
        <Comment comment={item} level={0} key={item.id} hidden={false} />
      )}
      keyExtractor={(comment) => '' + comment.id}
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
    />
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
    marginBottom: 8,
  },
  headerContainer: {
    paddingBottom: 12,
  },
  textContainer: {
    marginBottom: 8,
  },
  separator: {
    borderBottomColor: PlatformColor('separator'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  metadataContainer: {
    marginBottom: 8,
  },
  metadata: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
});
