import React, {Component, Fragment, useState} from 'react';
import {
  Modal,
  Text,
  View,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';

import {Button} from 'react-native-elements';

const ModalSettings = ({...props}) => {
  const {modalSettings, setModalSettings} = props;
  return (
    <Modal animationType="slide" visible={modalSettings}>
      <View style={styles.modalBody}>
        <Text>Settings</Text>
      </View>
      <View style={styles.button}>
        <Button
          raised
          title="Close"
          onPress={() => setModalSettings(!modalSettings)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    button: {
    justifyContent: 'flex-end',
  },
  modalBody: {
    height: '100%',
    flex: 1,
    width: Dimensions.get('window').width,
    // backgroundColor: 'blue',
  },
});
export default ModalSettings;
