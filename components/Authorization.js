import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

export default function Authorization({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signInWithEmailAndPass() {
    fetch('http://www.webapiroads.somee.com/api/account/login', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (data.data.message === 'Авторизован') {
          navigation.navigate('Main', {
            accessToken: data.data.accessToken,
            id: data.data.user.id,
            email: email,
            password: password,
          });
        }
      })
      .catch((error) => Alert.alert(error));
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
            onChangeText={(em) => {
              setEmail(em);
              console.log(email);
            }}
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
