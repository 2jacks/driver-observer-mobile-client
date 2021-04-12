import React, {useState} from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';

export default function StatusField({pressHandler}) {
  const [isDriving, setIsDriving] = useState(false);

  function toggleStatus() {
    setIsDriving((prevState) => {
      pressHandler(!prevState);
      return !prevState;
    });
  }

  return (
    <View style={styles.statusField}>
      <Pressable
        style={
          !isDriving
            ? {...styles.pressable, backgroundColor: '#4FFFA9'}
            : {...styles.pressable, backgroundColor: '#E9E9E9'}
        }
        onPress={toggleStatus}
        disabled={isDriving}>
        <Text>В пути</Text>
      </Pressable>
      <Pressable
        style={
          isDriving
            ? {...styles.pressable, backgroundColor: '#FFEE82'}
            : {...styles.pressable, backgroundColor: '#E9E9E9'}
        }
        onPress={toggleStatus}
        disabled={!isDriving}>
        <Text>Перерыв</Text>
      </Pressable>
    </View>
  );
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
