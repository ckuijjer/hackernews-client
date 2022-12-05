import {
  FlatList,
  GestureResponderEvent,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
  navigation: NativeStackNavigationProp<StackParamList, 'FrontPage'>;
  title: string;
  onRefresh: (() => void) | null | undefined;
  refreshing: boolean | null | undefined;
};

export const StoriesList = ({
  stories,
  isLoading,
  navigation,
  title,
  onRefresh,
  refreshing,
}: StoriesListProps) => {
  const renderItem = ({ item }: { item: Story }) => (
    <Item
      story={item}
      onPress={() =>
        navigation.navigate('Story', {
          id: item.id,
          title: item.title,
          url: item.url,
        })
      }
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
      />
    </SafeAreaView>
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
  container: {
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
