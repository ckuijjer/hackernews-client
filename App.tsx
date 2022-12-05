import React from 'react';
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import { FrontPageScreen } from './src/screens/FrontPageScreen';
import { StoryScreen } from './src/screens/StoryScreen';
import type { Story } from './src/types';
import { configureLogging } from './src/logger';

export type StackParamList = {
  FrontPage: undefined;
  Story: Pick<Story, 'id' | 'title' | 'url'>;
};

configureLogging();

const Stack = createNativeStackNavigator<StackParamList>();

const queryClient = new QueryClient();

const App = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

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
      <StatusBar />
    </QueryClientProvider>
  );
};

export default App;
