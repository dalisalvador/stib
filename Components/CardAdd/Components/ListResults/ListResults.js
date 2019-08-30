import React, {useContext} from 'react';
import {View, Text, FlatList, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import { SvgUri } from 'react-native-svg';

import AllLinesContext from '../../../../allLinesContext';

const ListResults = ({...props}) => {
  const {query, addLine} = props;
  const {allLines} = useContext(AllLinesContext);
  const resultLines = allLines.filter(
    line =>
      line.direction.toLowerCase().includes(query) ||
      line.mode.toLowerCase().includes(query) ||
      String(line.nroStop).includes(query),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>addLine(item)}>
    <ListItem
      bottomDivider={true}
      title={`${item.mode} line ${item.nroStop}`}
      subtitle={`to ${item.direction}`}
      // leftAvatar={{source: {uri: "https://image.flaticon.com/icons/svg/1646/1646742.svg"}}}
      leftAvatar={<SvgUri
      width="35px"
      height="35px"
      uri={item.icon}
    />}
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
