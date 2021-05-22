import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Alert} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

import sosIcon from './sos.png';
import supportIcon from './support.png';
import unexpectedIcon from './exclamation.png';

import Map from './Map';
import OnlineStatusField from './OnlineStatusField';
import UserInfoField from './UserInfoField';
import StatusField from './StatusField';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params,
      personal: {},

      object: null,

      isOnline: false,
      isDriving: false,
      drivingTime: 0,
      location: {
        longitude: 0,
        latitude: 0,
      },
      route: [],
      watchId: null,
    };
    this.isOnlineHandler = this.isOnlineHandler.bind(this);
    this.isDrivingHandler = this.isDrivingHandler.bind(this);
    this.exclusiveStatusHandler = this.exclusiveStatusHandler.bind(this);
  }

  drivingTime = 0;
  drivingCounter;
  sendDrivingTime;

  isDrivingHandler(isDriving) {
    this.setState({isDriving: isDriving}, () => {
      const status = this.state.isDriving ? 'On the way' : 'Break';
      fetch(
        `http://www.webapiroads.somee.com/api/driver/${this.state.data.id}/setstatusdriver/${status}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          return json.data;
        })
        .catch((error) => {
          Alert.alert(error);
        });
      if (status === 'On the way') {
        this.drivingCounter = setInterval(() => {
          this.drivingTime++;
        }, 1000);
        this.sendDrivingTime = setInterval(() => {
          fetch(
            `http://www.webapiroads.somee.com/api/driver/${this.state.data.id}/timesecondsdriver/${this.drivingTime}`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            },
          )
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              return json.data;
            })
            .catch((error) => {
              Alert.alert(error);
            });
        }, 10000);
      }
      if (status === 'Break') {
        clearInterval(this.drivingCounter);
        clearInterval(this.sendDrivingTime);
        this.drivingTime = 0;
      }
    });
  }
  exclusiveStatusHandler(status) {
    fetch(
      `http://www.webapiroads.somee.com/api/driver/${this.state.data.id}/setstatusdriver/${status}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json.data;
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  isOnlineHandler(isOnline) {
    this.setState({isOnline: isOnline}, () => {
      if (this.state.isOnline) {
        let watchId = Geolocation.watchPosition(
          (location) => {
            this.setState({
              location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              route: [...this.state.route, location.coords],
            });
            fetch(
              `http://www.webapiroads.somee.com/api/routes/getroute?driverId=${this.state.data.id}`,
            )
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                fetch(
                  'http://www.webapiroads.somee.com/api/routes/insertpoint',
                  {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      RouteId: data.id,
                      lat: location.coords.latitude,
                      lng: location.coords.longitude,
                      speed: location.coords.speed,
                    }),
                  },
                ).error((err) => Alert.alert(err));
              });
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, distanceFilter: 20},
        );
        this.setState({watchId: watchId});
        fetch(
          `http://www.webapiroads.somee.com/api/account/${this.state.data.id}/setonline/true`,
        )
          .then((response) => response.json())
          .then((json) => {
            return json.data;
          })
          .catch((error) => {
            Alert.alert(error);
          });
      }
      if (!this.state.isOnline) {
        Geolocation.clearWatch(this.state.watchId);

        this.drivingTime = 0;
        clearInterval(this.drivingCounter);
        clearInterval(this.sendDrivingTime);

        fetch(
          `http://www.webapiroads.somee.com/api/account/${this.state.data.id}/setonline/false`,
        )
          .then((response) => response.json())
          .then((json) => {
            return json.data;
          })
          .catch((error) => {
            Alert.alert(error);
          });
      }
    });
  }

  componentWillUnmount() {
    Geolocation.stopObserving();

    clearInterval(this.drivingCounter);
    clearInterval(this.sendDrivingTime);
  }

  render() {
    return (
      <View style={styles.mainDiv}>
        <View style={styles.headerDiv}>
          <OnlineStatusField toggleHandler={this.isOnlineHandler} />
          <UserInfoField
            userStatus={this.state.isDriving}
            userIsOnline={this.state.isOnline}
          />
        </View>

        <View style={styles.mapDiv}>
          <Map
            isOnline={this.state.isOnline}
            location={this.state.location}
            route={this.state.route}
          />
        </View>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => {
            this.exclusiveStatusHandler('sos');
          }}>
          <Image source={sosIcon} style={styles.iconInButton} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => {
            this.exclusiveStatusHandler('call me');
          }}>
          <Image source={supportIcon} style={styles.iconInButton} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => {
            this.exclusiveStatusHandler('unexpected');
          }}>
          <Image source={unexpectedIcon} style={styles.iconInButton} />
        </TouchableOpacity>

        <View style={styles.footerDiv}>
          <StatusField
            pressHandler={this.isDrivingHandler}
            isOnline={this.state.isOnline}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainDiv: {
    width: '100%',
    height: '100%',
  },
  mapDiv: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  headerDiv: {
    paddingHorizontal: 10,
    marginTop: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerDiv: {
    elevation: 1,
    position: 'absolute',
    bottom: 30,
    paddingHorizontal: 10,

    width: '100%',
  },
  sosButton: {
    marginTop: 30,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 1,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInButton: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
