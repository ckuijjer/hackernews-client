import { useState, useCallback } from 'react';
import {
  FlatList,
  GestureResponderEvent,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Story } from './types';
import { timeAgo } from './timeAgo';
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
  const [isScrolling, setIsScrolling] = useState(false);
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
        if (!isScrolling) {
          setActiveItem(item.id);
        }
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
        onScroll={() => {
          setIsScrolling(true);
        }}
        onScrollBeginDrag={() => {
          setIsScrolling(true);
        }}
        onScrollEndDrag={() => {
          setIsScrolling(false);
        }}
      />
    </SafeAreaView>
  );
};

type ItemProps = {
  story: Story;
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
  isActive: boolean;
};

const Item = ({
  story,
  onPress,
  onPressIn,
  onPressOut,
  isActive,
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
