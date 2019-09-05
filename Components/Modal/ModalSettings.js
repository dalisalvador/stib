import React, {Component, Fragment, useState} from 'react';
import {
  Modal,
  Text,
  View,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';

import CardSettings from '../CardSettings/CardSettings';

const ModalSettings = ({...props}) => {
  const {modalSettings, setModalSettings} = props;
  return (
    <Modal animationType="slide" visible={modalSettings}>
        <View style={styles.modalBody}>
            <CardSettings setModalVisible={setModalSettings} visible={modalSettings} />
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
