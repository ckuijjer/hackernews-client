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

export const StoriesList = ({
  stories,
  isLoading,
  navigation,
}: {
  stories: Story[] | undefined;
  isLoading: boolean;
  navigation: NativeStackNavigationProp<StackParamList, 'FrontPage'>;
}) => {
  if (isLoading) {
    return (
      <View style={styles.listViewLoading}>
        <Text style={styles.listViewLoadingText}>Checking for Updates...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Story }) => (
    <Item
      story={item}
      onPress={() =>
        navigation.navigate('Story', {
          id: item.id,
          title: item.title,
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
          <Icon name="ios-time-outline">
            {timeAgo.format(story.createdAt, 'mini')}
          </Icon>
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
  listViewLoading: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: PlatformColor('secondarySystemBackground'),
    paddingTop: 2 * 44,
  },
  listViewLoadingText: {
    fontSize: 15,
    color: PlatformColor('secondaryLabel'),
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
