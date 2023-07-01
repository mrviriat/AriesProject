import React from 'react';
import { Text, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  TransitionSpecs,
  createStackNavigator,
} from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { store } from './redux/Redux';
import { Provider } from 'react-redux';
import TabNavigator from './src/TabNavigator';
import RegisterScreen from './src/RegisterScreen';
import NavigaionPanel from './src/CustomComponents/NavigaionPanel';
import DetailScreen from './src/DetailScreen/DetailScreen';
import TestingPage from './src/Test/TestingPage';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const Stack = createSharedElementStackNavigator();

// const Stack = createStackNavigator();

function App() {

  const transition = {
    // gestureDirection: "vertical",
    transitionSpec: {
      open: {
        animation: "timing",
        config: {
          duration: 400,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 350,
        },
      },
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar
          backgroundColor="transparent"
          translucent={true}
          barStyle={'dark-content'}
        />
        <Stack.Navigator
          screenOptions={{
            // headerStyle: {
            //   backgroundColor: '#c8a2c8'
            // },
            headerTitleStyle: {
              fontFamily: "Inter-Regular"
            }
          }}
        >
          <Stack.Screen
            name="MyTabs"
            component={TabNavigator}
            options={({ navigation, route }) => ({
              title: "projectAries",
              headerRight: () => (<NavigaionPanel navigation={navigation} />)
            })}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              gestureEnabled: false,
              headerShown: false,
              transitionSpec: transition.transitionSpec,
            }}
            sharedElements={(route) => {
              const { id } = route.params;
              return [{ id: id, animation: 'fade' }];
            }}
          />
          <Stack.Screen
            name="Third"
            component={RegisterScreen}
            options={{
              title: "Вход",
              transitionSpec: {
                open: TransitionSpecs.RevealFromBottomAndroidSpec,
                close: TransitionSpecs.FadeOutToBottomAndroidSpec,
              },
            }}
          />
          <Stack.Screen
            name="Test"
            component={TestingPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});