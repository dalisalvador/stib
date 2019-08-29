/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, useState, useEffect} from 'react';
import {StyleSheet, View, PermissionsAndroid, Dimensions} from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {FloatingAction} from 'react-native-floating-action';
import ModalAdd from './Components/Modal/ModalAdd';

const App = () => {
  const [marginBottom, setMarginBottom] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainPressed, setMainPressed] = useState(false);

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
    <Fragment>
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        {/* <MapView
          onMapReady={_onMapReady}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            flex: 1,
            marginBottom,
            opacity: mainPressed || modalVisible ? 0.5 : 1,
          }}
          initialRegion={{
            latitude: 50.848637,
            longitude: 4.353461,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}></MapView> */}
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
