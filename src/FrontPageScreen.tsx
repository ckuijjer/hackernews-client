import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  PlatformColor,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList } from '../App';

import { useFrontPage } from './hooks';
import { StoriesList } from './StoriesList';

type Props = NativeStackScreenProps<StackParamList, 'FrontPage'>;

export const FrontPageScreen = ({ navigation }: Props) => {
  const { stories, isLoading, isRefreshing, onRefresh } = useFrontPage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Header>Front Page</Header>
        <StoriesList
          stories={stories}
          isLoading={isLoading}
          navigation={navigation}
        />
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
    backgroundColor: PlatformColor('systemBackground'),
  },
  contentContainer: {
    minHeight: '100%',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: PlatformColor('label'),
  },
});
