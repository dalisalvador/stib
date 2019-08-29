/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const App = () => {
  const [marginBottom, setMarginBottom] = useState(1);

  useEffect(() => {
    // Geolocation.getCurrentPosition(info => alert(info));
  });

  const _onMapReady = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(granted => {
      setMarginBottom(0);
    });
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <MapView
        onMapReady={_onMapReady}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{flex: 1, marginBottom}}
        initialRegion={{
          latitude: 50.848637,
          longitude: 4.353461,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}></MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    justifyContent: 'center',
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default App;
