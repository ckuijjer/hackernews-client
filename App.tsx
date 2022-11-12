import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

const fetchFrontPage = async () => {
  const response = await fetch(
    'http://hn.algolia.com/api/v1/search?tags=front_page',
  );
  const json = await response.json();
  return json;
};

const Header = () => {
  return <Text>Hacker News Client</Text>;
};

const JSONStringify = ({ children }) => {
  return <Text>{JSON.stringify(children, null, 2)}</Text>;
};

const List = () => {
  const query = useQuery({ queryKey: ['front_page'], queryFn: fetchFrontPage });

  return <JSONStringify>{query}</JSONStringify>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <Header />
        <ScrollView>
          <List />
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
