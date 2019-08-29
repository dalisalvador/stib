import React, {Component, Fragment, useState} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from 'react-native';

const ModalAdd = ({...props}) => {
  const {visible, setModalVisible} = props;
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        onPress={() => setModalVisible(!visible)}
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width / 1.5,
            backgroundColor: 'white',
            borderRadius: 20,
          }}>
          <Text>Hello World!</Text>

          <TouchableHighlight onPress={() => setModalVisible(!visible)}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalAdd;
