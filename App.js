import React, {Fragment, useState, useEffect, useRef, useInterval} from 'react';
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
import MapBoxAnimated from './Components/MapBox/MapBoxAnimated';
import Toast, {DURATION} from 'react-native-easy-toast';
import Timer from './Components/Timer/Timer';

import Animated, {Easing} from 'react-native-reanimated';

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  stopClock,
  block,
  onChange,
  call,
  not,
} = Animated;

const runTiming = (clock, value, dest, state, config) => {
  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    timing(clock, state, config),
    cond(state.finished, [stopClock(clock), set(changeBg, not(changeBg))]),
    state.position,
  ]);
};

const state = {
  finished: new Value(0),
  position: new Value(0),
  time: new Value(0),
  frameTime: new Value(0),
};

const config = {
  duration: 15000,
  toValue: new Value(0),
  easing: Easing.inOut(Easing.ease),
};

const clock = new Clock();
const changeBg = new Value(0);
const startAnim = new Value(1);
const progress = runTiming(clock, 0, 100, state, config);

const App = () => {
  const [marginBottom, setMarginBottom] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSettings, setModalSettings] = useState(false);
  const [mainPressed, setMainPressed] = useState(false);
  const [allLines, setAllLines] = useState();
  const [myLines, setMyLines] = useState([]);

  //Animation
  const [lastBackground, setLastBackground] = useState('blue');
  const [background, setBackground] = useState('red');
  const backgroundRef = useRef(background);
  backgroundRef.current = background;
  const lastBackgroundRef = useRef(lastBackground);
  lastBackgroundRef.current = lastBackground;

  useEffect(() => {
    setBackground(
      '#' +
        Math.random()
          .toString(16)
          .slice(2, 8),
    );
    updateAllVehicleGeoJson(myLinesRef.current);
  }, [lastBackground]);

  //Need this for setInterval
  const allLinesRef = useRef(allLines);
  allLinesRef.current = allLines;
  const myLinesRef = useRef(myLines);
  myLinesRef.current = myLines;

  const [geoJson, setGeoJson] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  const [vehiculesGeoJson, setVehiculesGeoJson] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  const [myVehiculesGeoJson, setMyVehiculesGeoJson] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  const toast = useRef(null);

  //Settings
  const [allVehicles, setAllVehicles] = useState(false);
  const [showStopName, setShowStopName] = useState(false);

  useEffect(() => {
    setAllLines(map.initLines(allStops));
  }, []);

  // useEffect(() => {
  //   updateAllVehicleGeoJson();
  //   // setInterval(() => {
  //   //   updateAllVehicleGeoJson(allLinesRef.current, myLinesRef.current);
  //   // }, 1000 * 35);
  //   // updateAllVehicleGeoJson(allLinesRef.current, myLinesRef.current);
  //   // setInterval(() => {
  //   //   updateAllVehicleGeoJson(allLinesRef.current, myLinesRef.current);
  //   // }, 1000 * 35);
  // }, [allLines]);

  const addLine = selectedLine => {
    if (
      !myLines.find(
        line =>
          line.selection.nroStop === selectedLine.nroStop &&
          line.selection.variantStop === selectedLine.variantStop,
      )
    ) {
      map.addToMyLines(selectedLine).then(response => {
        setMyLines([...myLines, response.newLine]);
        addLineToGeoJson(response.newLine);
        editVehiclesGeoJson(selectedLine, 'add');
      });
      toast.current.show('line Added', 2000);
    } else toast.current.show("Line already stored in 'myLines'", 2000);
  };

  const editVehiclesGeoJson = (line, action) => {
    let newFeatures = vehiculesGeoJson.features;
    if (action === 'add') {
      vehiculesGeoJson.features.map((vehicle, i) => {
        if (
          vehicle.properties.numero_lig === line.nroStop &&
          vehicle.properties.variante === line.variantStop
        ) {
          newFeatures[i].properties.myLine = 1;
        }
      });
    } else {
      vehiculesGeoJson.features.map((vehicle, i) => {
        if (
          vehicle.properties.numero_lig === line.selection.nroStop &&
          vehicle.properties.variante === line.selection.variantStop
        ) {
          newFeatures[i].properties.myLine = 0;
        }
      });
    }

    setVehiculesGeoJson({
      ...vehiculesGeoJson,
      features: newFeatures,
    });

    setMyVehiculesGeoJson({
      ...vehiculesGeoJson,
      features: newFeatures.filter(feature => feature.properties.myLine === 1),
    });
  };

  const deleteLine = lineTodelete => {
    deleteLineFromGeoJson(lineTodelete);
    editVehiclesGeoJson(lineTodelete, 'delete');
    setMyLines([
      ...myLines.filter((line, i) => myLines.indexOf(lineTodelete) !== i),
    ]);
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

  const deleteStopsFromGeoJson = lineTodelete => {
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

  const updateAllVehicleGeoJson = async myLines => {
    let features = await map.updateAllVehicles();
    features.map((vehicle, i) => {
      myLines.map(line => {
        if (
          vehicle.properties.numero_lig === line.selection.nroStop &&
          vehicle.properties.variante === line.selection.variantStop &&
          vehicle.properties.mode === line.selection.mode[0]
        ) {
          features[i].properties.myLine = 1;
        }
      });
    });

    setVehiculesGeoJson({
      ...vehiculesGeoJson,
      features,
    });
  };

  const chunkArray = (myArray, chunk_size) => {
    var results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  };

  const deleteLineFromGeoJson = line => {
    let newfeatures = geoJson.features.filter(
      feature => line.line.stops.indexOf(feature) === -1,
    );
    newfeatures = newfeatures.filter(
      feature => line.line.shape.features.indexOf(feature) === -1,
    );

    setGeoJson({
      ...geoJson,
      features: [...newfeatures],
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
    },
  ];

  return (
    <AllLinesProvider
      value={{
        allLines,
        myLines,
        deleteLine,
        addLine,
        allVehicles,
        setAllVehicles,
        showStopName,
        setShowStopName,
      }}>
      <Fragment>
        <View
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            backgroundColor: 'white',
          }}>
          <MapBox
            myLines={myLines}
            geoJson={geoJson}
            vehiculesGeoJson={vehiculesGeoJson}
            myVehiculesGeoJson={myVehiculesGeoJson}
            allStops={allStops}
            mapFunctions={map}
          />
          {/* <MapBoxAnimated /> */}
        </View>

        <Timer
          progress={progress}
          background={background}
          lastBackground={lastBackground}
        />
        <Animated.Code>
          {() =>
            onChange(changeBg, [
              call([], ([]) => {
                setLastBackground(backgroundRef.current);
              }),
            ])
          }
        </Animated.Code>
        <FloatingAction
          actions={actions}
          overlayColor={'rgba(0, 0, 0, 0)'}
          onPressMain={() => setMainPressed(!mainPressed)}
          onPressBackdrop={() => setMainPressed(false)}
          onPressItem={name => {
            if (name === 'addLine') {
              setMainPressed(false);
              setModalVisible(true);
            } else if (name === 'settings') {
              setModalSettings(true);
            }
          }}
        />
        <ModalAdd visible={modalVisible} setModalVisible={setModalVisible} />
        <ModalSettings
          modalSettings={modalSettings}
          setModalSettings={setModalSettings}
        />
        <Toast position="bottom" ref={toast} />
      </Fragment>
    </AllLinesProvider>
  );
};

export default App;
