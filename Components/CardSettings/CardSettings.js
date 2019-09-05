import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card, Button} from 'react-native-elements';

const CardSettings = ({...props}) => {
  const {setModalVisible, visible} = props;

  return (
    <Card
      containerStyle={cardContainer}
      wrapperStyle={cardWrapperStyle}
      title="Settings">
       <View style={styles.body}>
        <Text>Settings Body</Text>
      </View>
      <View style={styles.button}>
        <Button
          raised
          title="Close"
          onPress={() => setModalVisible(!visible)}
        />
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