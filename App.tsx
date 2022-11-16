import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FrontPageScreen } from './src/FrontPageScreen';
import { StoryScreen } from './src/StoryScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="frontpage"
          component={FrontPageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="story"
          component={StoryScreen}
          options={{ title: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
