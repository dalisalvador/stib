import React, {Component, Fragment} from 'react';
import ToggleSwitch from 'toggle-switch-react-native'
import {
  Text,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
const CustomRadio = ({...props}) => {
    const {value, toggle, instruction} = props;
    return (
        <View style={styles.row}>
            <View style={styles.instruction}>
                <Text>{instruction}</Text>
            </View>
            <View style={styles.toggle}>
                <ToggleSwitch
                    isOn={value}
                    onColor="green"
                    offColor="red"
                    size="large"
                    onToggle={toggle}
                />
             </View>
        </View>
    )
}

const styles = StyleSheet.create({
  row: {
        width: "100%",
        flexDirection: "row",
  },
  instruction: {
        justifyContent: "center",
        flexDirection: "column",
        flex: 0.7,
        color: "black", 
        fontWeight: "900",
  },
  toggle: {
        flexDirection: "column",
        flex: 0.3
  },
  labelStyle: {
        color: "black", 
        fontWeight: "900"
  }
});

export default CustomRadio;
