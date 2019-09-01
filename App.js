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
  Text,
} from 'react-native';

// import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import Geojson from 'react-native-geojson';
import {FloatingAction} from 'react-native-floating-action';
import ModalAdd from './Components/Modal/ModalAdd';

import {AllLinesProvider} from './allLinesContext';
import map from './assets/map';
import allStops from './assets/info/stops';
import MapBox from './Components/MapBox/MapBox';

const App = () => {
  const [marginBottom, setMarginBottom] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainPressed, setMainPressed] = useState(false);
  const [allLines, setAllLines] = useState();
  const [myLines, setMyLines] = useState([]);
  const [geoJson, setGeoJson] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  useEffect(() => {
    setAllLines(map.initLines(allStops));
  }, []);

  // const _onMapReady = () => {
  //   PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   ).then(granted => {
  //     setMarginBottom(0);
  //   });
  // };

  const addLine = selectedLine => {
    map.addToMyLines(selectedLine).then(newLine => {
      setMyLines([...myLines, newLine]);
      addLineToGeoJson(newLine);
    });
  };

  const deleteLine = lineTodelete => {
    setMyLines([
      ...myLines.filter((line, i) => myLines.indexOf(lineTodelete) !== i),
    ]);

    deleteLineFromGeoJson(lineTodelete);
  };

  const addLineToGeoJson = line => {
    setGeoJson({
      ...geoJson,
      features: [
        ...geoJson.features,
        ...line.line.shape.features,
        ...line.line.stops,
      ],
    });
  };

  const deleteLineFromGeoJson = line => {
    setGeoJson({
      ...geoJson,
      features: [
        ...geoJson.features.filter(
          (feature, i) =>
            geoJson.features.indexOf(line.line.shape.features[0]) !== i,
        ),
      ],
    });
  };

  const renderMarkers = () => {
    return myLines.map(line => {
      return line.markers.map((coord, key) => (
        <Marker
          icon={line.iconType}
          key={key}
          coordinate={{
            latitude: coord[1],
            longitude: coord[0],
          }}
        />
      ));
    });
  };

  const actions = [
    {
      text: 'Add Line',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/201/201531.svg',
      },
      name: 'addLine',
      position: 1,
    },
    {
      text: 'About',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/205/205577.svg',
      },
      name: 'about',
      position: 2,
    },
  ];

  return (
    <AllLinesProvider value={{allLines, myLines, deleteLine, addLine}}>
      <Fragment>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <MapBox myLines={myLines} geoJson={geoJson} />
        </View>
        <FloatingAction
          actions={actions}
          overlayColor={'rgba(0, 0, 0, 0)'}
          onPressMain={() => setMainPressed(!mainPressed)}
          onPressBackdrop={() => setMainPressed(false)}
          onPressItem={name => {
            if (name === 'addLine') {
              setMainPressed(false);
              setModalVisible(true);
            }
          }}
        />
        <ModalAdd visible={modalVisible} setModalVisible={setModalVisible} />
      </Fragment>
    </AllLinesProvider>
  );
};

export default App;
