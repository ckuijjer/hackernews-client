import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';

const queryClient = new QueryClient();

const fetchFrontPage = async () => {
  const response = await fetch(
    'http://hn.algolia.com/api/v1/search?tags=front_page',
  );
  const json = await response.json();
  return json;
};

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>Front Page</Text>
    </View>
  );
};

const JSONStringify = ({ children, style }) => {
  return (
    <ScrollView style={style}>
      <Text>{JSON.stringify(children, null, 2)}</Text>
    </ScrollView>
  );
};

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const List = () => {
  const query = useQuery({ queryKey: ['front_page'], queryFn: fetchFrontPage });

  if (query.isLoading) {
    return (
      <View style={styles.listViewLoading}>
        <Text style={styles.listViewLoadingText}>Checking for Updates...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => <Item title={item.title} />;

  const data = query.data.hits.map((item) => ({
    url: item.url,
    title: item.title,
    numberOfComments: item.num_comments,
    id: item.objectID,
  }));

  return (
    <ScrollView style={styles.listView}>
      {/* <JSONStringify style={styles.jsonView}>{query}</JSONStringify> */}
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <Header />
        <List />
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  headerContainer: {
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
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
  item: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    minHeight: 60,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    // fontFamily: 'System',
  },
  jsonView: {
    height: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fbfbfb',
  },
});
