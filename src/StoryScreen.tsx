import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useStory } from './hooks';
import { JSONStringify } from './JSONStringify';

export const StoryScreen = ({ route, navigation }) => {
  const { id, title } = route.params;
  const { story, isLoading, isRefreshing, onRefresh } = useStory(id);

  // navigation.setOptions({ title: story?.title ?? title });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Header>{story?.title}</Header>
        <JSONStringify>{isLoading ? 'Loading...' : story}</JSONStringify>
        {/* <Story story isLoading={isLoading} /> */}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const Header = ({ children }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    // height: 54,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
});
