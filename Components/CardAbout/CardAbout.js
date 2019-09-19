import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';
import ButtonClose from '../Common/ButtonClose';

const CardAbout = ({...props}) => {
  const {setModalVisible, visible} = props;

  return (
    <Card
      containerStyle={styles.cardContainer}
      wrapperStyle={styles.cardWrapperStyle}
      title="About StibTrack">
      <View style={styles.body}>
        <Text style={styles.textCommon}>
          The goal of StibTrack is to provide reliable real-time tracking
          information obtained directly from STIB-MIVB public API. You'll find
          any STIB-MIVB vehicle real-time position on the map as well as stops,
          lines road, and more!
        </Text>
        <Text style={styles.textCommon}>
          Most available applications provide only the schedule of any given
          line (potential arrival/departure), so you can only guess where
          exactly you transport is. But if you are an every-day user of
          STIB-MIVB transportation system, you might want to have the
          possibility to check where your next ride is, and be a little bit
          ahead of time.
        </Text>
        <Text style={styles.textCommon}>
          This is an open-source project, so if you want to dig a little bit in
          the code, , please check the GitHub repo "dalisalvador/stib". Also
          please keep in mind this is a free BETA app, therefore you might
          encounter bugs, and if you do, please let me know through Github!
        </Text>
      </View>
      <View style={styles.button}>
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
  cardWrapperStyle: {
    borderWidth: 0,
    flex: 1,
  },
  textCommon: {
    fontSize: 15,
    marginBottom: 5,
  },
  cardContainer: {
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
  },
});

export default CardAbout;
