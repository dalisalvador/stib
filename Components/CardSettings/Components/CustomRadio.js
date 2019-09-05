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
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>
            <View style={styles.toggle}>
                <ToggleSwitch
                    isOn={value}
                    onColor="green"
                    offColor="red"
                    size="large"
                    onToggle={()=>toggle(!value)}
                />
             </View>
        </View>
    )
}

const styles = StyleSheet.create({
  row: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 8
  },
  instruction: {
        justifyContent: "center",
        flexDirection: "column",
        flex: 0.7
  },
  instructionText: {
        color: "black", 
        fontWeight: "900",
        fontSize: 15
  },
  toggle: {
        textAlign: "center",
        flexDirection: "column",
        flex: 0.3
  }
});

export default CustomRadio;
