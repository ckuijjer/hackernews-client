import { useQuery } from '@tanstack/react-query';

import { getFrontPage } from '../connectors/hackernews';
import { StoriesList } from '../StoriesList';

export const FrontPageScreen = () => {
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['topstories'],
    queryFn: getFrontPage,
  });

  return (
    <StoriesList
      title="Front Page"
      stories={data}
      isLoading={isLoading}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
};
