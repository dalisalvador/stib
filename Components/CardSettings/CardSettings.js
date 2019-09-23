import React, {useContext} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Card} from 'react-native-elements';
import CustomRadio from './Components/CustomRadio';
import AllLinesContext from '../../allLinesContext';
import ButtonClose from '../Common/ButtonClose';

import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const CardSettings = ({...props}) => {
  const {setModalVisible, visible} = props;
  const {
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
  } = useContext(AllLinesContext);

  const ButtonReset = ({...props}) => {
    const {onPress} = props;
    const pressed = () => {
      Alert.alert(
        'Reset settings to default ?',
        '',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'OK', onPress},
        ],
        {cancelable: false},
      );
    };

    return (
      <Button
        raised
        title="Reset Settings"
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#fffc00', '#ff9500'],
          start: {x: 0, y: 0.5},
          end: {x: 1, y: 0.5},
        }}
        buttonStyle={{borderRadius: 150}}
        containerStyle={{marginBottom: 15}}
        titleStyle={{color: 'black'}}
        onPress={pressed}
      />
    );
  };

  return (
    <Card
      containerStyle={cardContainer}
      wrapperStyle={cardWrapperStyle}
      title="Settings">
      <View style={styles.body}>
        <CustomRadio
          value={allVehicles}
          toggle={setAllVehicles}
          instruction={'Show all vehicles from all lines'}
        />
        <CustomRadio
          value={showStopName}
          toggle={setShowStopName}
          instruction={'Show stop name'}
        />
        <CustomRadio
          value={showBus}
          toggle={setShowBus}
          instruction={'Show Bus'}
        />
        <CustomRadio
          value={showMetro}
          toggle={setShowMetro}
          instruction={'Show Metro'}
        />
        <CustomRadio
          value={showTram}
          toggle={setShowTram}
          instruction={'Show Tram'}
        />
      </View>
      <View style={styles.button}>
        <ButtonReset onPress={() => resetSettings()} />
        <ButtonClose onPress={() => setModalVisible(!visible)} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    // backgroundColor: 'white',
  },
  button: {
    justifyContent: 'flex-end',
  },
});

const cardWrapperStyle = {
  borderWidth: 0,
  flex: 1,
};

const cardContainer = {
  // backgroundColor: 'black',
  flex: 1,
  height: '100%',
  flexDirection: 'column',
  borderWidth: 0, // Remove Border
  shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow IOS
  shadowOffset: {height: 0, width: 0},
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0, // This is for Android
};

export default CardSettings;
