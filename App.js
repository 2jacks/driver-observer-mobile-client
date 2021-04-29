import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import Authorization from './components/Authorization';
import Main from './components/Main';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={'Authorization'}
          component={Authorization}
          options={{
            headerStyle: {
              backgroundColor: '#ec4f43',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name={'Main'}
          component={Main}
          options={{
            headerStyle: {
              backgroundColor: '#ec4f43',
            },
            headerTintColor: '#fff',
            headerRight: () => (
              <Button
                buttonStyle={styles.burger}
                icon={
                  <Icon
                    reverse
                    name="bars"
                    type="font-awesome"
                    color="#FFF"
                    size={20}
                  />
                }
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  burger: {
    backgroundColor: '#ec4f43',
  },
});

export default App;
