import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

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
        style={styles.map}
        minZoomLevel={10}>
        {this.props.isOnline ? (
          <Marker
            coordinate={{
              latitude: this.props.location.latitude,
              longitude: this.props.location.longitude,
            }}
          />
        ) : null}
        {this.props.isOnline ? (
          <Polyline
            coordinates={this.props.route}
            strokeColor={'#fe7968'}
            strokeWidth={5}
          />
        ) : null}
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
