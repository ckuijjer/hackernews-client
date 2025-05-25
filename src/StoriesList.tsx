import { useState, useCallback } from 'react';
import { FlatList, PlatformColor, StyleSheet, Text, View } from 'react-native';
import {
  Pressable,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import { PressableEvent } from 'react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Story } from './connectors/types';
import { timeAgo } from './utils/timeAgo';
import { Icon } from './Icon';
import { StackParamList } from '../App';
import { SafeAreaPaddingBottom } from './SafeAreaPaddingBottom';
import { Loading } from './Loading';
import { Header } from './Header';

type StoriesListProps = {
  stories: Story[] | undefined;
  isLoading: boolean;
  title: string;
  onRefresh: (() => void) | null | undefined;
  refreshing: boolean | null | undefined;
};

export const StoriesList = ({
  stories,
  isLoading,
  title,
  onRefresh,
  refreshing,
}: StoriesListProps) => {
  const navigation = useNavigation<StackParamList>();
  const [activeItem, setActiveItem] = useState<number | undefined>();

  useFocusEffect(
    useCallback(() => {
      setActiveItem(undefined);
    }, []),
  );

  const renderItem = ({ item }: { item: Story }) => (
    <Item
      story={item}
      isActive={activeItem === item.id}
      onPressIn={() => {
        setActiveItem(item.id);
      }}
      onPressOut={() => {
        setActiveItem(undefined);
      }}
      onPress={() => {
        setActiveItem(item.id);
        navigation.navigate('Story', {
          id: item.id,
          title: item.title,
          url: item.url,
        });
      }}
    />
  );

  const native = Gesture.Native();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <GestureDetector gesture={native}>
        <FlatList
          data={stories}
          renderItem={renderItem}
          keyExtractor={(item) => '' + item.id}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListHeaderComponent={() => <Header>{title}</Header>}
          ListFooterComponentStyle={{
            minHeight: '100%',
          }}
          ListFooterComponent={() =>
            isLoading ? <Loading /> : <SafeAreaPaddingBottom />
          }
          style={styles.container}
        />
      </GestureDetector>
    </SafeAreaView>
  );
};

type ItemProps = {
  story: Story;
  onPressIn: (event: PressableEvent) => void;
  onPressOut: (event: PressableEvent) => void;
  onPress: (event: PressableEvent) => void;
  isActive: boolean;
};

const Item = ({
  story,
  isActive,
  onPressIn,
  onPressOut,
  onPress,
}: ItemProps) => {
  return (
    <Pressable
      style={[styles.itemContainer, isActive && styles.itemContainerActive]}
      unstable_pressDelay={50}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <View style={styles.item}>
        <View style={styles.itemTitleContainer}>
          <Text style={styles.title}>{story.title}</Text>
        </View>
        <View style={styles.metadataContainer}>
          <Icon name="clock">{timeAgo(story.createdAt)}</Icon>
          <Icon name="arrow.up">{story.score}</Icon>
          <Icon name="bubble">{story.numberOfComments}</Icon>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackground'),
  },
  itemContainer: {
    backgroundColor: PlatformColor('systemBackground'),
    minHeight: 60,
    flexDirection: 'row',
  },
  itemContainerActive: {
    backgroundColor: PlatformColor('secondarySystemBackground'),
  },
  metadataContainer: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: PlatformColor('separator'),
    paddingVertical: 8,
  },
  itemTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
    color: PlatformColor('label'),
  },
});
