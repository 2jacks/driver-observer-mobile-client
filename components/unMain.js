import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Button, CheckBox, Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import Map from './Map';

import moment from 'moment';

import BackgroundGeolocation, {
  Location,
} from '@mauron85/react-native-background-geolocation';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        personal: '',
        geo: '',
        object: '',
        state: '',
      },
      onDuty: false,
      isDriving: false,
      location: {
        longitude: 0,
        latitude: 0,
      },
    };
  }

  componentDidMount() {
    database()
      .ref('drivers/' + this.props.route.params.uid)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({user: snapshot.val()});
          console.log(this.state.user);
        } else {
          console.log('No data available');
        }
      })
      .catch(function (error) {
        console.error(error);
      });

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 30,
      distanceFilter: 30,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 3000,
      fastestInterval: 5000,
      activitiesInterval: 10000, // Not Duplicate
    });
    BackgroundGeolocation.on('location', (location) => {
      database()
        .ref('/drivers/' + this.state.user.personal.uid + '/geo/location/')
        .set({
          lat: location.latitude,
          long: location.longitude,
        });
      this.setState({
        location: {lat: location.latitude, lng: location.longitude},
      });
    });
  }
  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.removeAllListeners();
  }

  render() {
    return (
      <View style={styles.appMain}>
        <View style={styles.header}>
          <View style={styles.container}>
            <View style={styles.headerInner}>
              <Text style={styles.dutyStatus}>
                {this.state.isDriving ? 'В пути' : 'Перерыв'}
              </Text>
              <View style={styles.user}>
                <Text style={styles.userName}>
                  {this.state.user.personal.name}
                </Text>
                <Image
                  style={styles.userAvatar}
                  PlaceholderContent={<Text>U</Text>}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.infoPanel}>
            <CheckBox
              containerStyle={styles.dutyCheckBox}
              textStyle={styles.dutyCheckBoxText}
              checked={this.state.onDuty}
              // iconType="material"
              size={36}
              checkedColor={'red'}
              checkedTitle={'На смене'}
              title="Вне смены"
              onPress={() => {
                this.setState({
                  onDuty: !this.state.onDuty,
                });
                !this.state.onDuty
                  ? BackgroundGeolocation.start()
                  : BackgroundGeolocation.stop();
              }}
            />
          </View>
          <View style={styles.controls}>
            <View style={styles.container}>
              <View style={styles.controlsInner}>
                <Button
                  buttonStyle={styles.buttonGo}
                  containerStyle={styles.buttonContainer}
                  icon={
                    <Icon
                      reverse
                      name="car"
                      type="font-awesome"
                      color="#3B3B3B"
                      size={20}
                    />
                  }
                  title="В пути"
                  titleStyle={styles.buttonText}
                  disabled={this.state.isDriving}
                  onPress={() => {
                    this.setState({isDriving: !this.state.isDriving});
                    database()
                      .ref(
                        '/drivers/' + this.state.user.personal.uid + '/state/',
                      )
                      .set({
                        status: 'В пути',
                        timestamp: moment().format(),
                      });
                  }}
                />
                <Button
                  buttonStyle={styles.buttonRest}
                  icon={
                    <Icon
                      reverse
                      name="anchor"
                      type="font-awesome"
                      color="#3B3B3B"
                      size={20}
                    />
                  }
                  title="Перерыв"
                  titleStyle={styles.buttonText}
                  disabled={!this.state.isDriving}
                  onPress={() => {
                    this.setState({isDriving: !this.state.isDriving});
                    database()
                      .ref(
                        '/drivers/' + this.state.user.personal.uid + '/state/',
                      )
                      .set({
                        status: 'Перерыв',
                        timestamp: moment().format(),
                      });
                  }}
                />
              </View>
            </View>
          </View>
          <View>
            <Map />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appMain: {
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 15,
  },

  header: {
    height: 60,
    width: '100%',
    borderBottomColor: '#FFE0DB',
    borderBottomWidth: 1,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  burger: {
    backgroundColor: '#fff',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '300',
    color: '#3B3B3B',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#EC4F43',
    marginLeft: 10,
  },

  main: {
    marginTop: 15,
  },
  backgroundGradient: {
    height: '100%',
  },

  infoPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    backgroundColor: '#FFBDB3',
    paddingRight: 15,
  },
  dutyCheckBoxWrapper: {
    elevation: 3,
    width: '100%',
  },
  dutyCheckBox: {
    backgroundColor: '#FFBDB3',

    borderColor: 'transparent',
  },
  dutyCheckBoxText: {
    fontSize: 20,
    color: '#3B3B3B',
    fontWeight: '300',
  },
  dutyStatus: {
    fontSize: 20,
    color: '#3B3B3B',
    fontWeight: '300',
  },

  controls: {
    marginTop: 25,
    position: 'relative',
    zIndex: 2,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',

    elevation: 3,
  },
  controlsInner: {
    paddingVertical: 15,
  },
  buttonGo: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#4FFFA9',
    marginBottom: 30,
  },
  buttonRest: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFEE82',
  },
  buttonText: {
    fontSize: 24,
    color: '#3B3B3B',
    marginLeft: 15,
    fontWeight: '200',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
