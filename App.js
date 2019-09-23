import React, {Fragment, useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';

import Geojson from 'react-native-geojson';
import ModalAdd from './Components/Modal/ModalAdd';
import ModalSettings from './Components/Modal/ModalSettings';
import ModalAbout from './Components/Modal/ModalAbout';

import {AllLinesProvider} from './allLinesContext';
import map from './assets/map';
import allStops from './assets/info/stops';
import lines from './assets/info/lines';
import MapBox from './Components/MapBox/MapBox';
import Toast, {DURATION} from 'react-native-easy-toast';
import Timer from './Components/Timer/Timer';

import Animated, {Easing} from 'react-native-reanimated';
import FloatingButton from './Components/FloatingButton/FloatingButton';

import IntroSlides from './Components/IntroSlides/IntroSlides';

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
  and,
} = Animated;

const runTiming = (clock, value, dest) => {
  const config = {
    duration: 15000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        cond(not(changeBg), [
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, value),
          set(state.frameTime, 0),
          set(config.toValue, dest),
          startClock(clock),
        ]),
      ],
    ),
    timing(clock, state, config),
    cond(state.finished, [stopClock(clock), set(changeBg, not(changeBg))]),
    state.position,
  ]);
};

const clock = new Clock();
const changeBg = new Value(0);
const progress = runTiming(clock, 0, 100);

const App = () => {
  //Init
  const [initDone, setInitDone] = useState();

  //First Time User Slides
  const [showSlides, setShowSlides] = useState(false);

  //Modals
  const [modalLines, setModalLines] = useState(false);
  const [modalSettings, setModalSettings] = useState(false);
  const [modalAbout, setModalAbout] = useState(false);

  //Lines+Stops
  const [allLines, setAllLines] = useState();
  const [myLines, setMyLines] = useState([]);

  //Animation Backgrounds
  const [lastBackground, setLastBackground] = useState('blue');
  const [background, setBackground] = useState('red');
  const backgroundRef = useRef(background);
  backgroundRef.current = background;
  const lastBackgroundRef = useRef(lastBackground);
  lastBackgroundRef.current = lastBackground;

  //GeoJson objects
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
  const [showStopName, setShowStopName] = useState(true);
  const [showBus, setShowBus] = useState(true);
  const [showTram, setShowTram] = useState(true);
  const [showMetro, setShowMetro] = useState(true);

  useEffect(() => {
    if (initDone) {
      startDelay(2).then(() => {
        SplashScreen.hide();
      });
    }
  }, [initDone]);

  useEffect(() => {
    if (initDone) storeSettingsData();
  }, [allVehicles, showStopName, showBus, showTram, showMetro, showSlides]);

  useEffect(() => {
    if (initDone) {
      console.log('storing mylines');
      storeMyLinesData();
    }
  }, [myLines]);

  useEffect(() => {
    //updateAllVehicleGeoJson(myLines);
  }, [lastBackground]);

  useEffect(() => {
    set(changeBg, 1);
    setBackground(
      '#' +
        Math.random()
          .toString(16)
          .slice(2, 8),
    );
  }, [vehiculesGeoJson]);

  useEffect(() => {
    getStoredData();
    setAllLines(map.initLines(allStops));
  }, []);

  // *** FUNCTIONS ** //

  const resetSettings = () => {
    setModalSettings(false);
    storeSettingsData(true);
  };

  const startDelay = async seconds => {
    return new Promise(resolve => {
      setTimeout(resolve, seconds * 1000);
    });
  };

  const getStoredData = async () => {
    let storageData = {
      settings: '',
      myLines: '',
    };
    try {
      storageData.settings = await AsyncStorage.getItem('settings');
      if (storageData.settings !== null) {
        storageData.settings = JSON.parse(storageData.settings);
        setShowSlides(!storageData.settings.slidesShowed);
        setAllVehicles(storageData.settings.allVehicles);
        setShowStopName(storageData.settings.showStopName);
        setShowBus(storageData.settings.showBus);
        setShowMetro(storageData.settings.showMetro);
        setShowTram(storageData.settings.showTram);
      } else console.log('Settings storage null!');

      storageData.myLines = await AsyncStorage.getItem('myLines');
      if (storageData.myLines !== null) {
        storageData.myLines = JSON.parse(storageData.myLines);
        let sotredLines = [];
        storageData.myLines.map(line => {
          map.addToMyLines(line).then(response => {
            sotredLines.push(response.newLine);
            addLineToGeoJson(response.newLine);
            editVehiclesGeoJson(line, 'add');
          });
        });
        setMyLines(sotredLines);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    setInitDone(true);
  };

  const storeSettingsData = async defaultValues => {
    let settings = {};
    if (defaultValues) {
      settings.allVehicles = false;
      settings.showStopName = true;
      settings.showBus = true;
      settings.showTram = true;
      settings.showMetro = true;
      settings.slidesShowed = false;
    } else {
      settings.allVehicles = allVehicles;
      settings.showStopName = showStopName;
      settings.showBus = showBus;
      settings.showTram = showTram;
      settings.showMetro = showBus;
      settings.slidesShowed = !showSlides;
    }
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
  };

  const storeMyLinesData = async () => {
    let myLinesData = [];
    myLines.map(line => myLinesData.push(line.selection));
    await AsyncStorage.setItem('myLines', JSON.stringify(myLinesData));
  };

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

  const updateAllVehicleGeoJson = async myLines => {
    let features = await map.updateAllVehicles();
    if (features) {
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
    } //nothing returned from server. Update geoJson with old values
    else
      setVehiculesGeoJson({
        ...vehiculesGeoJson,
      });
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

  return !initDone ? (
    <View />
  ) : showSlides ? (
    <IntroSlides setShowSlides={setShowSlides} />
  ) : (
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
        showBus,
        showMetro,
        showTram,
        setShowBus,
        setShowMetro,
        setShowTram,
        resetSettings,
      }}>
      <View style={styles.container}>
        {/* <MapBox
          myLines={myLines}
          geoJson={geoJson}
          vehiculesGeoJson={vehiculesGeoJson}
          myVehiculesGeoJson={myVehiculesGeoJson}
          allStops={allStops}
          mapFunctions={map}
        /> */}
      </View>
      <Timer
        progress={progress}
        background={backgroundRef.current}
        lastBackground={lastBackgroundRef.current}
      />
      <Animated.Code>
        {() =>
          onChange(changeBg, [
            cond(
              changeBg,
              call([], ([]) => {
                setLastBackground(backgroundRef.current);
              }),
            ),
          ])
        }
      </Animated.Code>

      <FloatingButton
        setModalLines={setModalLines}
        setModalSettings={setModalSettings}
        setModalAbout={setModalAbout}
      />
      <ModalAdd visible={modalLines} setModalVisible={setModalLines} />
      <ModalSettings
        modalSettings={modalSettings}
        setModalSettings={setModalSettings}
      />
      <ModalAbout visible={modalAbout} setModalVisible={setModalAbout} />
      <Toast position="bottom" ref={toast} />
    </AllLinesProvider>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
};

export default App;
