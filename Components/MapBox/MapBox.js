import React, {useEffect, Fragment, useRef} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Text
} from 'react-native';

import {Button} from "react-native-elements"

import stopIcon from '../../assets/img/stop.png';
import tramIcon from '../../assets/img/tram.png';
import busIcon from '../../assets/img/bus.png';
import metroIcon from '../../assets/img/metro.png';

const MapBox = ({...props}) => {
  const {myLines, geoJson, vehiculesGeoJson} = props;
  const mapBox = useRef(null)

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    console.log(await MapboxGL.requestAndroidLocationPermissions());
  };

  MapboxGL.setAccessToken(
    'pk.eyJ1IjoiZnNlYmFzdGUiLCJhIjoiY2p6ejh1YTFjMDRzcjNpcnhoN2gyMnBsMSJ9.JXvFU4bITL0RqMNQuaPizg',
  );

  const iconStyles = {
    stops: { 
          iconImage: stopIcon,
          iconAllowOverlap: true,
          iconSize: 0.1
    },
    vehicules:{
      tram:{
        iconImage: tramIcon,
        iconAllowOverlap: true,
      },
      metro:{
        iconImage: metroIcon,
        iconAllowOverlap: true,
      },
      bus:{
        iconImage: busIcon,
        iconAllowOverlap: true,
      }
    }
  }

  // console.log(geoJson, myLines);
  //console.log(vehiculesGeoJson);
  
  return (
    <View style={{flex : 1}}>
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
        // centerCoordinate={[this.state.longitude, this.state.latitude]}
        followUserMode={'normal'}
        followUserLocation={true}
      />
      {myLines.length > 0 ? (
        <Fragment>
        <MapboxGL.ShapeSource id="myLines" shape={geoJson}>
              <MapboxGL.LineLayer
                // key={i}
                id={"lines"}
                style={{
                  lineColor: ['get', 'COLOR_HEX'],
                  lineWidth: 5,
                }}
              />
          <MapboxGL.SymbolLayer
                id="symbolLocationSymbols"
                minZoomLevel={12}
                style={iconStyles.stops}
          />
        </MapboxGL.ShapeSource>
        {/* Temporal fix. Cant filter using Case expression. As a result need to create 3 shapesources */}
        <MapboxGL.ShapeSource id="vehicules" shape={vehiculesGeoJson}>
         <MapboxGL.SymbolLayer
                id="myvehicules"
                minZoomLevel={12}
                style={iconStyles.vehicules.tram}
          />
         </MapboxGL.ShapeSource>
         {/* <MapboxGL.ShapeSource id="tram" shape={vehiculesGeoJson}>
         <MapboxGL.SymbolLayer
                id="myTrams"
                filter={['==', ['get', 'mode'], "Tram"]}
                minZoomLevel={12}
                style={iconStyles.vehicules.tram}
          />
         </MapboxGL.ShapeSource>
                  <MapboxGL.ShapeSource id="metro" shape={vehiculesGeoJson}>
         <MapboxGL.SymbolLayer
                id="myMetros"
                filter={['==', ['get', 'mode'], "Metro"]}
                minZoomLevel={12}
                style={iconStyles.vehicules.metro}
          />
         </MapboxGL.ShapeSource>
                  <MapboxGL.ShapeSource id="bus" shape={vehiculesGeoJson}>
         <MapboxGL.SymbolLayer
                id="myBus"
                filter={['==', ['get', 'mode'], "Bus"]}
                minZoomLevel={12}
                style={iconStyles.vehicules.bus}
          />
         </MapboxGL.ShapeSource> */}
         </Fragment>
       
      ) : null}

    <MapboxGL.UserLocation />
    </MapboxGL.MapView>
    <View style={{position: "absolute"}}>
      <Button
        title="Outline button"
        type="outline"
        onPress={async ()=> {
          console.log(mapBox)
          let zoom = await mapBox.current.getZoom();
          alert(zoom)}}
      />
    </View>
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

export default MapBox;
