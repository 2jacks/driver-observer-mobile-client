import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
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
      route: [],
    };

    this.isOnlineHandler = this.isOnlineHandler.bind(this);
    this.isDrivingHandler = this.isDrivingHandler.bind(this);
  }

  // _getUser(uid) {
  //   database()
  //     .ref('drivers/' + uid + '/personal')
  //     .once('value')
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         this.setState({personal: snapshot.val()});
  //         console.log(this.state);
  //       } else {
  //         console.log('No data available');
  //       }
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // }

  isOnlineHandler(isOnline) {
    this.setState({isOnline: isOnline}, () => {
      console.log('main-isOnline', this.state.isOnline);
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
    this.setState({isDriving: isDriving});
    // this.setState({isDriving: isDriving}, () => {
    //   const status = this.state.isDriving ? 'В пути' : 'Перерыв';
    //   database()
    //     .ref('drivers/' + this.state.personal.uid + '/state/status')
    //     .set(status);
    //   database()
    //     .ref('drivers/' + this.state.personal.uid + '/state/timestamp')
    //     .set(moment().format());
    // });
  }

  componentDidMount() {
    this.setState({data: this.props.route.params});
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 15,
      distanceFilter: 15,
      notificationTitle: 'Driver Distance Short',
      notificationText: 'Пока вы на смене - ваше местоположение отслеживается',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 5000,
      fastestInterval: 5000,
      activitiesInterval: 20000,
    });
    BackgroundGeolocation.on('location', (location) => {
      console.log(location.latitude, location.longitude);
      this.setState({
        location: {latitude: location.latitude, longitude: location.longitude},
        route: [...this.state.route, location],
      });
      fetch(
        `http://www.webapiroads.somee.com/api/routes/getroute?driverId=${this.state.data.id}`,
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch('http://www.webapiroads.somee.com/api/routes/insertpoint', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              RouteId: data.id,
              lat: location.latitude,
              lng: location.longitude,
              speed: location.speed,
            }),
          });
        });
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

        <TouchableOpacity style={styles.sosButton}>
          <Text style={{fontSize: 24, color: '#ec4f43'}}>SOS</Text>
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
    marginTop: 50,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 1,
    width: 70,
    justifyContent: 'center',
  },
});
