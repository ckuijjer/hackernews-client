import React from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FrontPageScreen } from './src/screens/FrontPageScreen';
import { StoryScreen } from './src/screens/StoryScreen';
import type { Story } from './src/connectors/types';
import { configureLogging } from './src/utils/logger';

export type StackParamList = {
  FrontPage: undefined;
  Story: Pick<Story, 'id' | 'title' | 'url'>;
};

configureLogging();

const Stack = createStackNavigator<StackParamList>();

const queryClient = new QueryClient();

const App = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const { width } = useWindowDimensions();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            screenOptions={{
              cardShadowEnabled: true,
              gestureResponseDistance: width,
            }}
          >
            <Stack.Screen
              name="FrontPage"
              component={FrontPageScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Story"
              component={StoryScreen}
              options={{
                title: '',
                headerBackTitle: 'Back',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
