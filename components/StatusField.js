import React, {useEffect, useState} from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';

export default function StatusField(props) {
  const [isDriving, setIsDriving] = useState(false);
  useEffect(() => {
    console.log(props.isOnline);
    if (props.isOnline === false) {
      setIsDriving(false);
    }
  }, [props.isOnline]);

  function toggleStatus() {
    setIsDriving((prevState) => {
      props.pressHandler(!prevState);
      return !prevState;
    });
  }

  if (props.isOnline) {
    return (
      <View style={styles.statusField}>
        <Pressable
          style={
            !isDriving
              ? {...styles.pressable, backgroundColor: '#E9E9E9'}
              : {...styles.pressable, backgroundColor: '#4FFFA9'}
          }
          onPress={toggleStatus}
          disabled={isDriving}>
          <Text>В пути</Text>
        </Pressable>
        <Pressable
          style={
            isDriving
              ? {...styles.pressable, backgroundColor: '#E9E9E9'}
              : {...styles.pressable, backgroundColor: '#FFEE82'}
          }
          onPress={toggleStatus}
          disabled={!isDriving}>
          <Text>Перерыв</Text>
        </Pressable>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  statusField: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 30,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
  },
  pressable: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 20,
  },
});
