import React from 'react';
import {StyleSheet, View, Alert} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import moment from 'moment';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import Map from './Map';
import OnlineStatusField from './OnlineStatusField';
import UserInfoField from './UserInfoField';
import StatusField from './StatusField';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.route.params.uid,
      personal: {},

      object: null,

      isOnline: false,
      isDriving: false,
      location: {
        longitude: 0,
        latitude: 0,
      },
      route: [],
    };

    this.isOnlineHandler = this.isOnlineHandler.bind(this);
    this.isDrivingHandler = this.isDrivingHandler.bind(this);
  }

  _getUser(uid) {
    database()
      .ref('drivers/' + uid + '/personal')
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({personal: snapshot.val()});
        } else {
          Alert.alert('No data available');
        }
      })
      .catch(function (error) {
        Alert.alert(error);
      });
  }

  isOnlineHandler(isOnline) {
    this.setState({isOnline: isOnline}, () => {
      if (!this.state.isOnline) {
        this.setState({isDriving: false});
        database()
          .ref('drivers/' + this.state.uid + '/state')
          .update({
            isOnline: false,
            status: 'Смена закончена',
            timestamp: moment().format(),
          })
          .then(() => {
            BackgroundGeolocation.stop();
          });
      } else {
        database()
          .ref('drivers/' + this.state.uid + '/state')
          .update({
            isOnline: false,
            status: 'Заступил на смену',
            timestamp: moment().format(),
          })
          .then(() => {
            BackgroundGeolocation.start();
          });
      }
    });
  }

  isDrivingHandler(isDriving) {
    this.setState({isDriving: isDriving}, () => {
      const status = this.state.isDriving ? 'В пути' : 'Перерыв';
      database()
        .ref('drivers/' + this.state.uid + '/state/status')
        .set(status);
      database()
        .ref('drivers/' + this.state.uid + '/state/timestamp')
        .set(moment().format());
    });
  }

  componentDidMount() {
    this._getUser(this.props.route.params.uid);
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 30,
      distanceFilter: 30,
      notificationTitle: 'Driver Client',
      notificationText: 'Пока вы на смене - ваше местоположение отслеживается',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 3000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
    });
    BackgroundGeolocation.on('location', (location) => {
      this.setState(
        {
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          route: [...this.state.route, location],
        },
        () => {
          database()
            .ref('/drivers/' + this.state.uid + '/state/geo/')
            .set({
              lat: location.latitude,
              lng: location.longitude,
              speed: location.speed,
            });
        },
      );
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.stop();
    BackgroundGeolocation.removeAllListeners();
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
});
