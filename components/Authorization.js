import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, Alert, Button} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Authorization({navigation}) {
  const [email, setEmail] = useState('anton.nozdrin.21@gmail.com');
  const [password, setPassword] = useState('315220kalter');

  function signInWithEmailAndPass() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        navigation.navigate('Main', {
          uid: userCredential.user.uid,
          email: email,
          password: password,
        });
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
