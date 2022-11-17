import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FrontPageScreen } from './src/FrontPageScreen';
import { StoryScreen } from './src/StoryScreen';

import type { Story } from './src/types';

export type StackParamList = {
  FrontPage: undefined;
  Story: Pick<Story, 'id' | 'title'>;
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
  );
};

export default App;
