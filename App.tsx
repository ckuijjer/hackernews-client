import React from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FrontPageScreen } from './src/FrontPageScreen';
import { StoryScreen } from './src/StoryScreen';

import type { Story } from './src/types';

export type StackParamList = {
  FrontPage: undefined;
  Story: Pick<Story, 'id' | 'title'>;
};

const Stack = createNativeStackNavigator<StackParamList>();

const queryClient = new QueryClient();

const App = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const { width } = useWindowDimensions();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ fullScreenGestureEnabled: true }}>
          <Stack.Screen
            name="FrontPage"
            component={FrontPageScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Story"
            component={StoryScreen}
            options={{ title: '' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
