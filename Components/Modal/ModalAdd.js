import React, {Component, Fragment, useState} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

import CardAdd from '../CardAdd/CardAdd';

import {Button} from 'react-native-elements';

const ModalAdd = ({...props}) => {
  const {visible, setModalVisible} = props;
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width / 1.15,
            backgroundColor: 'white',
            borderRadius: 20,
          }}>
          <CardAdd />

          <Button
            raised
            title="Close"
            onPress={() => setModalVisible(!visible)}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalAdd;
