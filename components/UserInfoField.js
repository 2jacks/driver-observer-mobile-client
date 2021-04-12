import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function UserInfoField(props) {
  return (
    <View style={styles.userInfoField}>
      <View
        style={{
          ...styles.userIsOnlineCircle,
          backgroundColor: props.userIsOnline ? '#4FFFA9' : '#EC4F43',
        }}
      />
      <Text style={styles.userStatus}>
        {props.userStatus ? 'В пути' : 'Перерыв'}
      </Text>
      <View style={styles.userAvatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  userInfoField: {
    elevation: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 30,

    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatus: {
    marginLeft: 10,
  },
  userIsOnlineCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFBDB3',

    marginLeft: 20,
  },
});
