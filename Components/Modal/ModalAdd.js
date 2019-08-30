import React, {Component, Fragment, useState} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';

import CardAdd from '../CardAdd/CardAdd';

import {Button} from 'react-native-elements';

const ModalAdd = ({...props}) => {
  const {visible, setModalVisible, addLine} = props;
  return (
    <Modal animationType="slide" visible={visible}>
      <View style={styles.modalBody}>
        <CardAdd setModalVisible={setModalVisible} visible={visible} addLine={addLine}/>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    height: '100%',
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: 'blue',
  },
});
export default ModalAdd;
