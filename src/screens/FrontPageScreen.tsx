import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import type { StackParamList } from '../../App';
import { getFrontPage } from '../connectors/hackernews';
import { StoriesList } from '../StoriesList';

type Props = NativeStackScreenProps<StackParamList, 'FrontPage'>;

export const FrontPageScreen = ({ navigation }: Props) => {
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['topstories'],
    queryFn: getFrontPage,
  });

  return (
    <StoriesList
      title="Front Page"
      stories={data}
      isLoading={isLoading}
      navigation={navigation}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
};
