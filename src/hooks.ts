import { useState, useCallback, useEffect } from 'react';

import { getFrontPage } from './connectors/hackernews';

import { Story } from './types';

export const useFrontPage = () => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{
    stories: Story[] | undefined;
    isLoading: boolean;
  }>({ stories: undefined, isLoading: true });

  useEffect(async () => {
    const stories = await getFrontPage();
    setData({ stories, isLoading: false });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const stories = await getFrontPage();
    setData({ stories, isLoading: false });

    setRefreshing(false);
  }, [data, setRefreshing]);

  return { ...data, isRefreshing, onRefresh };
};
