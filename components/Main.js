import React from 'react';
import {StyleSheet, View} from 'react-native';
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
      data: {
        accessToken: null,
        id: null,
        email: null,
        password: null,
      },
      personal: {},

      object: null,

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
      .ref('drivers/' + uid + '/personal')
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({personal: snapshot.val()});
          console.log(this.state);
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
      console.log('isOnline', this.state.isOnline);
      if (this.state.isOnline) {
        BackgroundGeolocation.start();
      }
      if (!this.state.isOnline) {
        BackgroundGeolocation.stop();
      }
      // if (!this.state.isOnline) {
      //   this.setState({isDriving: false});
      //   database()
      //     .ref('drivers/' + this.state.personal.uid + '/state')
      //     .update({
      //       isOnline: false,
      //       status: 'Смена закончена',
      //       timestamp: moment().format(),
      //     })
      //     .then(() => {
      //       BackgroundGeolocation.stop();
      //     });
      // } else {
      //   database()
      //     .ref('drivers/' + this.state.personal.uid + '/state')
      //     .update({
      //       isOnline: false,
      //       status: 'Заступил на смену',
      //       timestamp: moment().format(),
      //     })
      //     .then(() => {
      //       BackgroundGeolocation.start();
      //     });
      // }
      //   database()
      //     .ref('drivers/' + this.state.personal.uid + '/state/isOnline')
      //     .set(this.state.isOnline)
      //     .then(() => {
      //       this.state.isOnline
      //         ?
      //         : BackgroundGeolocation.stop();
      //     });
      // });
    });
  }
  isDrivingHandler(isDriving) {
    this.setState({isDriving: isDriving}, () => {
      const status = this.state.isDriving ? 'В пути' : 'Перерыв';
      database()
        .ref('drivers/' + this.state.personal.uid + '/state/status')
        .set(status);
      database()
        .ref('drivers/' + this.state.personal.uid + '/state/timestamp')
        .set(moment().format());
    });
  }

  componentDidMount() {
    this.setState({data: this.props.route.params});
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 30,
      distanceFilter: 30,
      notificationTitle: 'Driver Client',
      notificationText: 'Пока вы на смене - ваше местоположение отслеживается',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 3000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
    });
    BackgroundGeolocation.on('location', (location) => {
      console.log(location);
      this.setState({
        location: {lat: location.latitude, lng: location.longitude},
      });
      database().ref('drivers/v2NLAYVwvzcTbnSN9lK2U4ADWPE2/state/geo/').update({
        lat: location.latitude,
        lng: location.longitude,
      });
      fetch('http://www.webapiroads.somee.com/api/routes/insertpoint', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Id: this.state.data.id,
          RouteId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          lat: location.latitude,
          lng: location.longitude,
          speed: location.speed,
        }),
      });
    });
  }
  // componentDidUpdate() {
  //   console.log('state', this.state.data);
  // }
  componentWillUnmount() {
    BackgroundGeolocation.stop();
    BackgroundGeolocation.removeAllListeners();
    this.setState({isOnline: false, isDriving: false});
    // database()
    //   .ref('/drivers/' + this.state.personal.uid + '/state/')
    //   .update({
    //     isOnline: false,
    //     status: 'Смена закончена',
    //     timestamp: moment().format(),
    //   });
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
          <Map />
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
