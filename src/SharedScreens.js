import React from 'react';
import HomeScreen from './Schedule/HomeScreen';
import SecondScreen from './StudentsList/SecondScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const StackA = createSharedElementStackNavigator();
const StackB = createSharedElementStackNavigator();

const StackScreenA = () => (
  <StackA.Navigator>
    <StackA.Screen
      name="A"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </StackA.Navigator>
);

const StackScreenB = () => (
  <StackB.Navigator>
    <StackB.Screen
      name="B"
      component={SecondScreen}
      options={{ headerShown: false }}
    />
  </StackB.Navigator>
);

export { StackScreenA, StackScreenB } 