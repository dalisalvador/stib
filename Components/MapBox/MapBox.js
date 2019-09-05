import React, {useEffect, Fragment, useRef, useContext} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Text
} from 'react-native';

import {Button} from "react-native-elements"

import AllLinesContext from '../../allLinesContext';

import stopIcon from '../../assets/img/stop.png';
import tramIcon from '../../assets/img/tram.png';
import busIcon from '../../assets/img/bus.png';
import metroIcon from '../../assets/img/metro.png';

const MapBox = ({...props}) => {
  const {myLines, geoJson, vehiculesGeoJson, allStops, mapFunctions} = props;
  const {allLines, addLine, allVehicles} = useContext(AllLinesContext);

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

  const showData = (vehicule) => {
    let stopShape = getStopShape(vehicule)
    let selection =   {
          nroStop: stopShape.properties.numero_lig,
          variantStop: stopShape.properties.variante,
          direction: stopShape.properties.terminus,
          nroLine: mapFunctions.setVariantLine(
            stopShape.properties.numero_lig,
            stopShape.properties.mode,
          ),
          variantLine: stopShape.properties.variante === '1' ? 901 : 902,
          mode:
            stopShape.properties.mode === 'B'
              ? 'Bus'
              : stopShape.properties.mode === 'T'
              ? 'Tram'
              : stopShape.properties.mode === 'M'
              ? 'Metro'
              : null,
          icon:
            stopShape.properties.mode === 'B'
              ? mapFunctions.icons.bus
              : stopShape.properties.mode === 'T'
              ? mapFunctions.icons.tram
              : stopShape.properties.mode === 'M'
              ? mapFunctions.icons.metro
              : mapFunctions.icons.bus,
        }
    addLine(selection)
  }

  const getStopShape = ({mode, numero_lig, variante}) => {
    return allStops.features.find(stop => stop.properties.numero_lig === numero_lig && stop.properties.variante === variante)   
  }

  console.log(allVehicles)
  return (
    <View style={{flex : 1}}>
    <MapboxGL.MapView
      ref={mapBox}
      compassEnabled={true}
      styleURL={MapboxGL.StyleURL.Light}
      // onDidFinishLoadingMap={()=>alert('onDidFinishLoadingMap')}
      // onDidFinishRenderingFrame={()=>alert('onDidFinishRenderingFrame')}
      // onDidFinishRenderingMap={()=>alert('onDidFinishRenderingMap')}
      // onDidFinishRenderingMapFully={()=>alert('onDidFinishRenderingMapFully')}
      // onDidFinishLoadingStyle={()=>alert('onDidFinishLoadingStyle')}
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
                belowLayerID={"myTrams"}
                id="lines"
                style={{
                  lineColor: ['get', 'COLOR_HEX'],
                  lineWidth: 5,
                }}
              />
          <MapboxGL.SymbolLayer
                belowLayerID={"myTrams"}
                layerIndex={2}
                id="symbolLocationSymbols"
                minZoomLevel={12}
                style={iconStyles.stops}
          />
        </MapboxGL.ShapeSource>
        </Fragment>
       
      ) : null}
        <MapboxGL.ShapeSource id="tram" onPress={({ nativeEvent }) => showData(nativeEvent.payload.properties)} shape={vehiculesGeoJson}>
          <MapboxGL.SymbolLayer
            id="myTrams"
            filter={allVehicles ? ['==', ['get', 'mode'], "T"] : ["all", ['==', ['get', 'mode'], "T"], ['==', ['get', 'myLine'], 1]]}
            minZoomLevel={10}
            style={iconStyles.vehicules.tram}
          />
         </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource id="metro" onPress={({ nativeEvent }) => showData(nativeEvent.payload.properties)} shape={vehiculesGeoJson}>
          <MapboxGL.SymbolLayer
            aboveLayerID={"myTrams"}
            id="myMetros"
            filter={allVehicles ? ['==', ['get', 'mode'], "M"] : ["all", ['==', ['get', 'mode'], "M"], ['==', ['get', 'myLine'], 1]]}
            minZoomLevel={10}
            style={iconStyles.vehicules.metro}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource id="bus" onPress={({ nativeEvent }) => showData(nativeEvent.payload.properties)} shape={vehiculesGeoJson}>
        <MapboxGL.SymbolLayer
            aboveLayerID={"myTrams"}
            id="myBus"
            filter={allVehicles ? ['==', ['get', 'mode'], "B"] : ["all", ['==', ['get', 'mode'], "B"], ['==', ['get', 'myLine'], 1]]}
            minZoomLevel={10}
            style={iconStyles.vehicules.bus}
         />
      </MapboxGL.ShapeSource>

       {/* <MapboxGL.ShapeSource id="tram" onPress={({ nativeEvent }) => showData(nativeEvent.payload.properties)} shape={vehiculesGeoJson}>
          <MapboxGL.SymbolLayer
            id="myTrams"
            filter={allVehicles ? ['==', ['get', 'mode'], "T"] : ["all", ['==', ['get', 'mode'], "T"], ['==', ['get', 'myLine'], 1]]}
            minZoomLevel={10}
            style={iconStyles.vehicules.tram}
          />
         </MapboxGL.ShapeSource> */}


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

export default MapBox;
