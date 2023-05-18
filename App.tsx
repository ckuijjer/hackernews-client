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
import * as Sentry from 'sentry-expo';

import { FrontPageScreen } from './src/screens/FrontPageScreen';
import { StoryScreen } from './src/screens/StoryScreen';
import type { Story } from './src/types';
import { configureLogging } from './src/logger';

export type StackParamList = {
  FrontPage: undefined;
  Story: Pick<Story, 'id' | 'title' | 'url'>;
};

configureLogging();

const Stack = createStackNavigator<StackParamList>();

const queryClient = new QueryClient();

// Sentry.init({
//   dsn: 'https://f1a0d36f911a454983bef785fb775170@o4505205662416896.ingest.sentry.io/4505205673033728',
//   enableInExpoDevelopment: true,
//   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

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
