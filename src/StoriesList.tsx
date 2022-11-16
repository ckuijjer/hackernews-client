import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { Story } from './types';
import { UnreadIcon } from './UnreadIcon';

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
        navigation.navigate('story', { id: item.id, title: item.title })
      }
    />
  );

  return (
    <View style={styles.listView}>
      <FlashList
        data={stories}
        renderItem={renderItem}
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
        <Text style={styles.metadata}>Yesterday</Text>
        <Text style={styles.metadata}>{story.score}</Text>
        <Text style={styles.metadata}>{story.numberOfComments}</Text>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listViewLoading: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f7',
    paddingTop: 2 * 44,
  },
  listViewLoadingText: {
    fontSize: 15,
    color: '#8e8e93',
  },
  itemContainer: {
    backgroundColor: '#fff',
    minHeight: 60,
    flexDirection: 'row',
  },
  unreadContainer: {
    paddingTop: 15, // Figma showed 13?
    paddingHorizontal: 8,
  },
  metadataContainer: {
    paddingRight: 8,
    alignItems: 'flex-end',
    // width: 32,
  },
  metadata: {
    color: '#3C3C4399',
    fontSize: 15,
    lineHeight: 20,
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    paddingVertical: 8,
  },
  itemTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
  },
});
