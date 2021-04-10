import React, {useEffect, useState} from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';

export default function StatusField({pressHandler, uid}) {
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

// export default class StatusField extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       uid: null,
//       isDriving: false,
//     };
//   }
//
//   _pressedDriving() {
//     database()
//       .ref('drivers/' + this.props.uid.toString() + '/state/status')
//       .set('В пути');
//     database()
//       .ref('drivers/' + this.props.uid.toString() + '/state/timestamp')
//       .set(moment().format());
//     this.setState({isDriving: true});
//   }
//   _pressedRest() {
//     database()
//       .ref('drivers/' + this.state.uid + '/state/status')
//       .set('Перерыв');
//     database()
//       .ref('drivers/' + this.state.uid + '/state/timestamp')
//       .set(moment().format());
//     this.setState({isDriving: false});
//   }
//   setUid(uid) {
//     this.setState({uid: uid});
//   }
//
//   componentDidMount() {
//     console.log('statusUid', this.props.uid);
//   }
//
//   componentWillUnmount() {
//     database()
//       .ref('drivers/' + this.state.uid + '/state/status')
//       .set('Перерыв');
//     database()
//       .ref('drivers/' + this.state.uid + '/state/timestamp')
//       .set(moment().format());
//   }
//
//   render() {
//     return (
//       <View style={styles.statusField}>
//         <Pressable
//           style={
//             !this.state.isDriving
//               ? {...styles.pressable, backgroundColor: '#4FFFA9'}
//               : {...styles.pressable, backgroundColor: '#E9E9E9'}
//           }
//           onPress={this._pressedDriving}
//           disabled={this.state.isDriving}>
//           <Text>В пути</Text>
//         </Pressable>
//         <Pressable
//           style={
//             this.state.isDriving
//               ? {...styles.pressable, backgroundColor: '#FFEE82'}
//               : {...styles.pressable, backgroundColor: '#E9E9E9'}
//           }
//           onPress={this._pressedRest}
//           disabled={!this.state.isDriving}>
//           <Text>Перерыв</Text>
//         </Pressable>
//       </View>
//     );
//   }
// }

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
