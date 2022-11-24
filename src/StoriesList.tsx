import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PlatformColor,
  FlatList,
  GestureResponderEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Story } from './types';
import { timeAgo } from './timeAgo';
import { Icon } from './Icon';
import { StackParamList } from '../App';
import { SafeAreaPaddingBottom } from './SafeAreaPaddingBottom';
import { Loading } from './Loading';

type StoriesListProps = {
  stories: Story[] | undefined;
  isLoading: boolean;
  navigation: NativeStackNavigationProp<StackParamList, 'FrontPage'>;
};

export const StoriesList = ({
  stories,
  isLoading,
  navigation,
}: StoriesListProps) => {
  if (isLoading) {
    return <Loading />;
  }

  const renderItem = ({ item }: { item: Story }) => (
    <Item
      story={item}
      onPress={() =>
        navigation.navigate('Story', {
          story: {
            id: item.id,
            user: item.user,
            title: item.title,
            text: item.text,
          },
        })
      }
    />
  );

  return (
    <View style={styles.listView}>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={(item) => '' + item.id}
      />
      <SafeAreaPaddingBottom />
    </View>
  );
};

type ItemProps = {
  story: Story;
  onPress: (event: GestureResponderEvent) => void;
};

const Item = ({ story, onPress }: ItemProps) => {
  return (
    <Pressable style={styles.itemContainer} onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.itemTitleContainer}>
          <Text style={styles.title}>{story.title}</Text>
        </View>
        <View style={styles.metadataContainer}>
          <Icon name="ios-time-outline">{timeAgo(story.createdAt)}</Icon>
          <Icon name="arrow-up-sharp">{story.score}</Icon>
          <Icon name="chatbubble-outline">{story.numberOfComments}</Icon>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackground'),
  },
  itemContainer: {
    backgroundColor: PlatformColor('systemBackground'),
    minHeight: 60,
    flexDirection: 'row',
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
