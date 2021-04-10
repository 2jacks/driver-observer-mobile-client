import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import moment from 'moment';
import BackgroundGeolocation, {
  Location,
} from '@mauron85/react-native-background-geolocation';

import Map from './Map';
import OnlineStatusField from './OnlineStatusField';
import UserInfoField from './UserInfoField';
import StatusField from './StatusField';

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
      isOnline: false,
      isDriving: false,
      location: {
        longitude: 0,
        latitude: 0,
      },
    };

    this.isOnlineHandler = this.isOnlineHandler.bind(this);
    this.isDrivingHandler = this.isDrivingHandler.bind(this);
  }

  _getUser(uid) {
    database()
      .ref('drivers/' + uid)
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
  }

  isOnlineHandler(isOnline) {
    this.setState({isOnline: isOnline}, () => {
      database()
        .ref('drivers/' + this.state.user.personal.uid + '/state/isOnline')
        .set(this.state.isOnline)
        .then(() => {
          this.state.isOnline
            ? BackgroundGeolocation.start()
            : BackgroundGeolocation.stop();
        });
    });
  }
  isDrivingHandler(isDriving) {
    this.setState({isDriving: isDriving}, () => {
      const status = this.state.isDriving ? 'В пути' : 'Перерыв';
      database()
        .ref('drivers/' + this.state.user.personal.uid + '/state/status')
        .set(status);
      database()
        .ref('drivers/' + this.state.user.personal.uid + '/state/timestamp')
        .set(moment().format());
    });
  }

  componentDidMount() {
    this._getUser(this.props.route.params.uid);
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
      activitiesInterval: 10000,
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
  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    console.log('is Online: ', this.state.user.state.i);
  }

  render() {
    return (
      <View style={styles.mainDiv}>
        <View style={styles.headerDiv}>
          <OnlineStatusField
            toggleHandler={this.isOnlineHandler}
            uid={this.state.user.personal.uid}
          />
          <UserInfoField
            userStatus={this.state.isDriving}
            userIsOnline={this.state.isOnline}
          />
        </View>

        <View style={styles.mapDiv}>
          <Map />
        </View>

        <View style={styles.footerDiv}>
          <StatusField
            uid={this.state.user.personal.uid}
            pressHandler={this.isDrivingHandler}
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
