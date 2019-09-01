import React, {useEffect, Fragment} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Text,
} from 'react-native';

const MapBox = ({...props}) => {
  const {myLines, geoJson} = props;

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    console.log(await MapboxGL.requestAndroidLocationPermissions());
  };

  MapboxGL.setAccessToken(
    'pk.eyJ1IjoiZnNlYmFzdGUiLCJhIjoiY2p6ejh1YTFjMDRzcjNpcnhoN2gyMnBsMSJ9.JXvFU4bITL0RqMNQuaPizg',
  );

  console.log(geoJson, myLines);
  return (
    <MapboxGL.MapView
      compassEnabled={true}
      styleURL={MapboxGL.StyleURL.Light}
      style={styles.map}
      userTrackingMode={1}
      showUserLocation={true}
      pitchEnabled={true}>
      <MapboxGL.Camera
        zoomLevel={16}
        // centerCoordinate={[this.state.longitude, this.state.latitude]}
        followUserMode={'normal'}
        followUserLocation={true}
      />
      {myLines.length > 0 ? (
        <MapboxGL.ShapeSource id="myLines" shape={geoJson}>
          {myLines.map((line, i) => (
            <Fragment>
              <MapboxGL.LineLayer
                key={i}
                id={line.line.shape.name}
                style={{
                  lineColor: ['get', 'COLOR_HEX'],
                  lineWidth: 5,
                }}
              />
              <MapboxGL.SymbolLayer id={line.line.stops.name} />
            </Fragment>
          ))}
        </MapboxGL.ShapeSource>
      ) : null}

      <MapboxGL.UserLocation />
    </MapboxGL.MapView>
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

export default MapBox;
