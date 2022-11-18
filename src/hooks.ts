import { useState, useCallback, useEffect } from 'react';

import { getFrontPage, getStory } from './connectors/hackernews';

import { Story } from './types';

export const useFrontPage = () => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{
    stories: Story[] | undefined;
    isLoading: boolean;
  }>({ stories: undefined, isLoading: true });

  useEffect(() => {
    async function fetchFrontPage() {
      const stories = await getFrontPage();
      setData({ stories, isLoading: false });
    }
    fetchFrontPage();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const stories = await getFrontPage();
    setData({ stories, isLoading: false });

    setRefreshing(false);
  }, [data, setRefreshing]);

  return { ...data, isRefreshing, onRefresh };
};

export const useStory = (id: number) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{
    story: Story | undefined;
    isLoading: boolean;
  }>({ story: undefined, isLoading: true });

  useEffect(() => {
    async function fetchStory() {
      const story = await getStory(id);
      setData({ story, isLoading: false });
    }
    fetchStory();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const story = await getStory(id);
    setData({ story, isLoading: false });

    setRefreshing(false);
  }, [data, setRefreshing]);

  return { ...data, isRefreshing, onRefresh };
};
