import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const SelectLine = ({...props}) => {
  const [query, setQuery] = useState('');
  const defaultData = ['azdaz', 'azdazd', 'azdazd'];

  const filterData = keyword => {
    return defaultData.find(x => x.includes(keyword));
  };

  const data = filterData(query);
};

export default SelectLine;
