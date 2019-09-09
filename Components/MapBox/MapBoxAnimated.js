import React, {useEffect, Fragment, useRef, useContext, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Text,
} from 'react-native';

import tramIcon from '../../assets/img/tram.png';

const MapBoxAnimated = ({...props}) => {
  const mapBox = useRef(null);
  const [permissions, setPermissions] = useState(false);

  useEffect(() => {
    setPermissions(getPermissions());
  }, []);

  const getPermissions = async () => {
    console.log(await MapboxGL.requestAndroidLocationPermissions());
  };

  MapboxGL.setAccessToken(
    'pk.eyJ1IjoiZnNlYmFzdGUiLCJhIjoiY2p6ejh1YTFjMDRzcjNpcnhoN2gyMnBsMSJ9.JXvFU4bITL0RqMNQuaPizg',
  );

  if (permissions)
    return (
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapBox}
          compassEnabled={true}
          styleURL={MapboxGL.StyleURL.Light}
          style={styles.map}
          userTrackingMode={1}
          showUserLocation={true}
          pitchEnabled={true}>
          <MapboxGL.Camera
            zoomLevel={30}
            followUserMode={'normal'}
            followUserLocation={true}
          />
          <MapboxGL.UserLocation />
        </MapboxGL.MapView>
      </View>
    );
  else
    return (
      <View>
        <Text>Not allowed</Text>
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

export default MapBoxAnimated;
