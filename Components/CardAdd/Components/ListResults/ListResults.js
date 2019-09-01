import React, {useEffect, useState, useContext} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

import AllLinesContext from '../../../../allLinesContext';

const ListResults = ({...props}) => {
  const {query, resetQuery} = props;
  const {allLines, addLine} = useContext(AllLinesContext);
  const resultLines = allLines.filter(
    line =>
      line.direction.toLowerCase().includes(query) ||
      line.mode.toLowerCase().includes(query) ||
      String(line.nroStop).includes(query),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        addLine(item);
        resetQuery();
      }}>
      <ListItem
        bottomDivider={true}
        title={`${item.mode} line ${item.nroStop}`}
        subtitle={`to ${item.direction}`}
        leftAvatar={{source: item.icon}}
      />
    </TouchableOpacity>
  );

  const keyExtractor = (item, index) => index.toString();

  return (
    <KeyboardAwareFlatList
      keyExtractor={keyExtractor}
      style={{flex: 1, marginTop: 5}}
      data={resultLines}
      renderItem={renderItem}
    />
  );
};

export default ListResults;
