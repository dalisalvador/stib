import React, {useEffect, Fragment, useRef, useContext, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Text,
} from 'react-native';

import {lineString, along, lineDistance} from '@turf/turf';

const route = [
  [4.371497, 50.80585],
  [4.370361, 50.808182],
  [4.36858, 50.810528],
];

// const route = [
//   [50.80585, 4.371497],
//   [50.808182, 4.370361],
//   [50.810528, 4.36858],
// ];

import tramIcon from '../../assets/img/tram.png';

const MapBoxAnimated = ({...props}) => {
  const mapBox = useRef(null);
  const [geoJson, setGeoJson] = useState({
    type: 'FeatureCollection',
    name: 'stops',
    features: [
      {
        type: 'Feature',
        properties: {
          numero_lig: 78,
          terminus: 'HUMANITE',
          variante: '2',
          mode: 'B',
          stop_id: '1663',
          succession: 1,
          descr_fr: 'GARE DU MIDI',
          descr_nl: 'ZUIDSTATION',
          coord_x: 147710,
          coord_y: 169714,
          alpha_fr: 'Gare du Midi',
          alpha_nl: 'zuidstation',
        },
        geometry: {
          type: 'Point',
          coordinates: route[0],
        },
      },
    ],
  });

  //Need this for setInterval
  const geoJsonRef = useRef(geoJson);
  geoJsonRef.current = geoJson;

  const getPermissions = async () => {
    console.log(await MapboxGL.requestAndroidLocationPermissions());
  };

  MapboxGL.setAccessToken(
    'pk.eyJ1IjoiZnNlYmFzdGUiLCJhIjoiY2p6ejh1YTFjMDRzcjNpcnhoN2gyMnBsMSJ9.JXvFU4bITL0RqMNQuaPizg',
  );

  useEffect(() => {
    getPermissions();
    let arc = [];
    let i = 0;

    const line = lineString(route); // our array of lat/lngs
    const distance = lineDistance(line, {units: 'meters'});
    for (let i = 0; i < distance; i += distance / 100) {
      let segment = along(line, i, {units: 'meters'});
      arc.push(segment.geometry.coordinates);
    }

    setInterval(() => {
      setGeoJson({
        ...geoJsonRef.current,
        features: [
          {
            ...geoJsonRef.current.features[0],
            geometry: {type: 'Point', coordinates: arc[i]},
          },
        ],
      });
      i++;
      if (i >= 99) i = 0;
    }, 1);
  }, []);

  console.log(geoJsonRef.current);

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
        <MapboxGL.ShapeSource id="myLines" shape={geoJsonRef.current}>
          <MapboxGL.Animated.SymbolLayer
            id="symbolLocationSymbols"
            minZoomLevel={10}
            style={{iconImage: tramIcon, iconAllowOverlap: true}}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.UserLocation />
      </MapboxGL.MapView>
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
