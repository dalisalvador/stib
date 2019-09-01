import React, {useContext} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

import AllLinesContext from '../../../../allLinesContext';

const MyLines = ({...props}) => {
  const {myLines, deleteLine} = useContext(AllLinesContext);

  const renderItem = ({item}) => {
    return (
      <ListItem
        title={`${item.selection.mode} line ${item.selection.nroStop}`}
        subtitle={`to ${item.selection.direction}`}
        leftAvatar={{source: item.selection.icon}}
        rightAvatar={
          <Avatar
            onPress={() => deleteLine(item)}
            rounded
            source={require('../../../../assets/img/delete.png')}
          />
        }
      />
    );
  };

  const keyExtractor = (item, index) => index.toString();

  return myLines.length > 0 ? (
    <KeyboardAwareFlatList
      keyExtractor={keyExtractor}
      style={{flex: 1, marginTop: 5}}
      data={myLines}
      renderItem={renderItem}
    />
  ) : (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text style={{textAlign: 'center', fontStyle: 'italic'}}>
        No lines yet!
      </Text>
    </View>
  );
};

export default MyLines;
