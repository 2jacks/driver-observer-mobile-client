import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {View} from 'react-native';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MapView
        initialRegion={{
          latitude: 54.73,
          longitude: 55.95,
          latitudeDelta: 0.135,
          longitudeDelta: 0.123,
        }}
        // initialCamera={{latitude: 54.73, longitude: 55.95}}
        style={styles.map}
        minZoomLevel={10}>
        {/* {this.state.onDuty ? (
                <Marker coordinate={this.state.location} />
              ) : null} */}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
