import React, {useState} from 'react';
import {Switch, Text, View, StyleSheet} from 'react-native';

export default function OnlineStatusField({toggleHandler}) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((prevState) => {
      toggleHandler(!prevState);
      return !prevState;
    });
  };

  return (
    <View style={styles.onlineStatusField}>
      <View style={styles.onlineStatusSwitch}>
        <Switch
          trackColor={{false: '#767577', true: '#FFBDB3'}}
          thumbColor={isEnabled ? '#EC4F43' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <Text>{isEnabled ? 'В сети' : 'Не в сети'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  onlineStatusField: {
    elevation: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 30,

    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineStatusSwitch: {
    marginRight: 5,
    zIndex: 15,
  },
});
