import React, {useContext} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import { SvgUri } from 'react-native-svg';

import AllLinesContext from '../../../../allLinesContext';

const MyLines = ({...props}) => {
  const {myLines} = useContext(AllLinesContext);

  const renderItem = ({item}) => (
    <ListItem
      bottomDivider={true}
      title={`${item.selection.mode} line ${item.selection.nroStop}`}
      subtitle={`to ${item.selection.direction}`}
      leftAvatar={{ source: item.selection.icon }}
      rightAvatar={{ source: require("../../../../assets/img/delete.png")}}
    />
  );

  const keyExtractor = (item, index) => index.toString();


  return myLines.length > 0 ? 
    <KeyboardAwareFlatList
      keyExtractor={keyExtractor}
      style={{flex: 1, marginTop: 5}}
      data={myLines}
      renderItem={renderItem}
    />
    : <Text>No lines yet</Text>

};

export default MyLines;
