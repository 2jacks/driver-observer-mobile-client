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

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

export default App;
