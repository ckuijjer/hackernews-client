import { View, Text, StyleSheet, Pressable, PlatformColor } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';

import { Story } from './types';
import { UnreadIcon } from './UnreadIcon';
import { timeAgo } from './timeAgo';

export const StoriesList = ({
  stories,
  isLoading,
  navigation,
}: {
  stories: Story[] | undefined;
  isLoading: boolean;
  navigation: any; // TODO: replace
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

  const renderHiddenItem = ({ item }: { item: Story }) => (
    <View style={{ backgroundColor: PlatformColor('systemBlue'), flex: 1 }}>
      <View
        style={{
          alignSelf: 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: 75,
        }}
      >
        {false ? (
          <>
            <Ionicons
              name="mail-unread-outline"
              size={20}
              color={PlatformColor('systemGray6')}
            />
            <Text
              style={{
                color: PlatformColor('systemGray6'),
                fontSize: 15,
                lineHeight: 20,
              }}
            >
              Unread
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="mail-open-outline"
              size={20}
              color={PlatformColor('systemGray6')}
            />
            <Text
              style={{
                color: PlatformColor('systemGray6'),
                fontSize: 15,
                lineHeight: 20,
              }}
            >
              Read
            </Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.listView}>
      <SwipeListView
        data={stories}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-75}
        keyExtractor={(item) => '' + item.id}
      />
    </View>
  );
};

const Item = ({
  story,
  onPress,
}: {
  story: Story;
  onPress: any; // TODO: typing
}) => (
  <Pressable style={styles.itemContainer} onPress={onPress}>
    <View style={styles.unreadContainer}>
      <UnreadIcon />
    </View>
    <View style={styles.item}>
      <View style={styles.itemTitleContainer}>
        <Text style={styles.title}>{story.title}</Text>
      </View>
      <View style={styles.metadataContainer}>
        <Text style={styles.metadata}>
          <Ionicons
            name="time-outline"
            size={15}
            color={PlatformColor('secondaryLabel')}
          />{' '}
          {timeAgo.format(story.createdAt, 'mini')}
        </Text>
        <Text style={styles.metadata}>
          <Ionicons
            name="arrow-up-sharp"
            size={15}
            color={PlatformColor('secondaryLabel')}
          />{' '}
          {story.score}
        </Text>
        <Text style={styles.metadata}>
          <Ionicons
            name="chatbubble-outline"
            size={15}
            color={PlatformColor('secondaryLabel')}
          />{' '}
          {story.numberOfComments}
        </Text>
      </View>
    </View>
  </Pressable>
);

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
  unreadContainer: {
    paddingTop: 15, // Figma showed 13?
    paddingHorizontal: 8,
  },
  metadataContainer: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  metadata: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
  item: {
    flexDirection: 'row',
    flex: 1,
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
