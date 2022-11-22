import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  PlatformColor,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { StackParamList } from '../App';
import { getFrontPage } from './connectors/hackernews';
import { StoriesList } from './StoriesList';
import { SafeAreaPaddingBottom } from './SafeAreaPaddingBottom';

type Props = NativeStackScreenProps<StackParamList, 'FrontPage'>;

export const FrontPageScreen = ({ navigation }: Props) => {
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['topstories'],
    queryFn: getFrontPage,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <Header>Front Page</Header>
        <StoriesList
          stories={data}
          isLoading={isLoading}
          navigation={navigation}
        />
        <SafeAreaPaddingBottom />
      </ScrollView>
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
