import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useFrontPage } from './hooks';
import { StoriesList } from './StoriesList';

export default function FrontPage() {
  const { stories, isLoading, isRefreshing, onRefresh } = useFrontPage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Header>Front Page</Header>
        <StoriesList stories={stories} isLoading={isLoading} />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

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
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
});
