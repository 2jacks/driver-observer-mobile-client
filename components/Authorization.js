import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, Alert, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import Main from './Main';

// const firebaseConfig = {
//   apiKey: 'AIzaSyByruty5exPhybFoEfyLdL_5lRf2cqam9s',
//   authDomain: 'driver-observer.firebaseapp.com',
//   databaseURL: 'https://driver-observer-default-rtdb.firebaseio.com',
//   projectId: 'driver-observer',
//   storageBucket: 'driver-observer.appspot.com',
//   messagingSenderId: '902202774868',
//   appId: '1:902202774868:web:47c2ff275a92125ed6a4c1',
// };
// // Initialize Firebase
// !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default function Authorization({navigation}) {
  // this.state = {
  //   email: 'anton.nozdrin.21@gmail.com',
  //   password: '315220kalter',
  //   errorMessage: null,
  //   uid: '',
  // };

  // this.handleLogin = () => {
  //   const {email, password} = this.state;
  //   firebase
  //     .auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //       // let driver = {
  //       //    geo: {
  //       //       location: {
  //       //          lat: 55.55,
  //       //          long: 55.55,
  //       //       },
  //       //    },
  //       //    object: 'null',
  //       //    personal: {
  //       //       uid: userCredential.user.uid,
  //       //       email: email,
  //       //       name: 'Anton',
  //       //       age: 20
  //       //    },
  //       //    state: {
  //       //       status: 'no-data',
  //       //       timestamp: 'no-data',
  //       //    },
  //       // }
  //       // firebase.database().ref('/drivers/' + userCredential.user.uid).set(driver)
  //       this.props.navigation.navigate('Main', {
  //         uid: userCredential.user.uid,
  //         email: email,
  //         password: password,
  //       });
  //     })
  //     .catch(() => Alert.alert('Wrong login or password'));
  // };
  //
  //   return (
  //     <View>
  //       <View style={styles.authHello}>
  //         <Text style={styles.authHelloText}>Авторизация</Text>
  //       </View>
  //       <View style={styles.authMain}>
  //         <TextInput
  //           style={styles.authInput}
  //           placeholder="Почта"
  //           placeholderTextColor="#FFE0DB"
  //           autoCorrect={false}
  //           autoCapitalize="none"
  //           onChangeText={(email) => this.setState({email})}
  //           value={this.state.email}
  //         />
  //         <TextInput
  //           style={styles.authInput}
  //           placeholder="Пароль"
  //           placeholderTextColor="#FFE0DB"
  //           autoCorrect={false}
  //           autoCapitalize="none"
  //           onChangeText={(password) => this.setState({password})}
  //           value={this.state.password}
  //         />
  //         <View style={{width: '100%'}}>
  //           <Button
  //             title="Войти"
  //             buttonStyle={styles.authButton}
  //             onPress={this.handleLogin}
  //           />
  //         </View>
  //         <View style={{width: '100%'}}>
  //           <Button
  //             title="Отписка"
  //             buttonStyle={styles.authButton}
  //             onPress={() => {
  //               firebase
  //                 .auth()
  //                 .signOut()
  //                 .then(
  //                   function () {
  //                     // console.log('Signed Out');
  //                     Alert.alert('Signed Out');
  //                   },
  //                   function (error) {
  //                     // console.error('Sign Out Error', error);
  //                     Alert.alert('Sign Out Error', error);
  //                   },
  //                 );
  //             }}
  //           />
  //         </View>
  //       </View>
  //     </View>
  //   );

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('anton.nozdrin.21@gmail.com');
  const [password, setPassword] = useState('315220kalter');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // if (initializing) {
  //   return null;
  // }
  function signInWithEmailAndPass() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setUser(userCredential);
        navigation.navigate('Main', {
          uid: userCredential.user.uid,
          email: email,
          password: password,
        });
        // Alert.alert(user.user.uid);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }
        console.error(error);
        Alert.alert('Something went wrong :-(');
      });
  }
  //
  // if (!user) {
  //   return (
  //     <View>
  //       <Text>Login</Text>
  //     </View>
  //   );
  // }

  return (
    <View>
      <View style={styles.authHello}>
        <Text style={styles.authHelloText}>{'Авторизация'}</Text>
      </View>
      <View style={styles.authLoginForm}>
        <View style={styles.container}>
          <TextInput
            style={styles.authTextInput}
            onChangeText={(email) => setEmail(email)}
            placeholder={'Email'}
            value={email}
          />
          <TextInput
            style={styles.authTextInput}
            onChangeText={(pass) => setPassword(pass)}
            placeholder={'Password'}
            value={password}
          />
          <View style={styles.authButtonWrapper}>
            <Button
              style={styles.authButton}
              title={'Войти'}
              onPress={signInWithEmailAndPass}
              color={'#FE7968'}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  authHello: {
    height: 185,
    backgroundColor: '#FE7968',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authHelloText: {
    fontSize: 36,
    color: '#fff',
  },
  authLoginForm: {
    marginTop: 30,
  },
  authTextInput: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderColor: '#FE7968',
  },
  authButtonWrapper: {
    marginTop: 15,
  },
});
