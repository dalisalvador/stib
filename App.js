/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  Text,
} from 'react-native';

import Geojson from 'react-native-geojson';
import {FloatingAction} from 'react-native-floating-action';
import ModalAdd from './Components/Modal/ModalAdd';
import ModalSettings from './Components/Modal/ModalSettings';

import {AllLinesProvider} from './allLinesContext';
import map from './assets/map';
import allStops from './assets/info/stops';
import lines from './assets/info/lines';
import MapBox from './Components/MapBox/MapBox';
import Toast, {DURATION} from 'react-native-easy-toast'

const App = () => {
  const [marginBottom, setMarginBottom] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSettings, setModalSettings] = useState(false);
  const [mainPressed, setMainPressed] = useState(false);
  const [allLines, setAllLines] = useState();
  const [myLines, setMyLines] = useState([]);
  const [geoJson, setGeoJson] = useState({
    type: 'FeatureCollection',
    features: [],
  });
  const [vehiculesGeoJson, setVehiculesGeoJson] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  const toast = useRef(null)
  //Settings
  const [allVehicles, setAllVehicles] = useState(true)

  useEffect(() => {
    setAllLines(map.initLines(allStops));
   // setInterval(() => {updateAllVehiculeGeoJson()}, 1000*10)
  }, []);

  useEffect(() => {
   updateAllVehicleGeoJson(allLines)
   setInterval(() => {updateAllVehicleGeoJson(allLines)}, 1000*31)
  }, [allLines]);


  const addLine = selectedLine => {
    map.addToMyLines(selectedLine).then(response => {
      setMyLines([...myLines, response.newLine]);
      addLineToGeoJson(response.newLine);
      //addVehiculesToGeoJson(response.vehicules)
    });
    toast.current.show("line Added", 200)
  };

  const deleteLine = lineTodelete => {
    setMyLines([
      ...myLines.filter((line, i) => myLines.indexOf(lineTodelete) !== i),
    ]);
    deleteLineFromGeoJson(lineTodelete);
    //updateVehiculeGeoJson();
    //deleteStopsFromGeoJson(lineTodelete);
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

    const addVehiculesToGeoJson = features => {
    setVehiculesGeoJson({
      ...vehiculesGeoJson,
      features,
    });
  };

  const deleteStopsFromGeoJson = (lineTodelete) => {
    setGeoJson({
        ...geoJson,
        features: [
          ...geoJson.features.filter(
            (feature, i) =>
              geoJson.features.indexOf(line.line.shape.features[0]) !== i
          ),
        ],
      });
  }

  const updateVehiculeGeoJson = async () => {
    let updated;
    if(myLines.length > 0) {
      updated = myLines.map(async line => {
                  return new Promise((resolve, reject)=>{
                      let updated = map.updateVehicules(line.selection, line.line.stops);
                      if(updated) resolve(updated)
                      else reject("error")
                  })
      })
      
      Promise.all(updated).then(features => {
        setVehiculesGeoJson({
              ...vehiculesGeoJson,
              features: features.reduce((a,b)=>{
          return a.concat(b)
        }),
        })
      })

    }
  }

  const  updateAllVehicleGeoJson = async () => {
    if(allLines){
      let responses = await map.updateAllVehicles(chunkArray(allLines.map(line => line.nroStop).filter((x,i,arr) =>arr.indexOf(x)=== i),10));

      Promise.all(responses).then(features => 
        setVehiculesGeoJson({
           ...vehiculesGeoJson,
           features: features.reduce((a,b)=>{
            return a.concat(b)
          })
        }))
    }
   }
  
  const chunkArray = (myArray, chunk_size) => {
    var results = [];
    
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    
    return results;
}



  const deleteLineFromGeoJson = line => {
  let newfeatures = geoJson.features.filter(feature => line.line.stops.indexOf(feature) ===-1)
  newfeatures = newfeatures.filter(feature => line.line.shape.features.indexOf(feature) === -1)

  setGeoJson({
        ...geoJson,
        features: [
          ...newfeatures,
        ],
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
      text: 'Settings',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/201/201531.svg',
      },
      name: 'settings',
      position: 1,
    },
    {
      text: 'About',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/205/205577.svg',
      },
      name: 'about',
      position: 2,
    }
  ];

 
  //console.log(vehiculesGeoJson, myLines)
  return (
    <AllLinesProvider value={{allLines, myLines, deleteLine, addLine, allVehicles, setAllVehicles}}>
      <Fragment>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <MapBox myLines={myLines} geoJson={geoJson} vehiculesGeoJson={vehiculesGeoJson} allStops={allStops} mapFunctions={map} />
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
            } else if(name === 'settings'){
              setModalSettings(true);
            }
          }}
        />
        <ModalAdd visible={modalVisible} setModalVisible={setModalVisible} />
        <ModalSettings modalSettings={modalSettings} setModalSettings={setModalSettings} />
        <Toast position='top' ref={toast}/>
      </Fragment>
    </AllLinesProvider>
  );
};

export default App;
