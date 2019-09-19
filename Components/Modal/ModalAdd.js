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

const ModalAdd = ({...props}) => {
  const {visible, setModalVisible} = props;
  return (
    <Modal animationType="slide" visible={visible}>
      <View style={styles.modalBody}>
        <CardAdd setModalVisible={setModalVisible} visible={visible} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    height: '100%',
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    width: Dimensions.get('window').width,
    // backgroundColor: 'blue',
  },
});
export default ModalAdd;
