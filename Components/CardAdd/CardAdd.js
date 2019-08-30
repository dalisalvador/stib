import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card, ListItem, Button} from 'react-native-elements';
// import SelectLine from '../SelectLine/SelectLine';
import Search from '../SelectLine/Components/Search/Search';
import ListResults from './Components/ListResults/ListResults';
import MyLines from './Components/MyLines/MyLines';
import {Icon} from 'react-native-elements';

// implemented without image with header
const CardAdd = ({...props}) => {
  const {setModalVisible, visible, addLine} = props;
  const [query, setQuery] = useState('');
  const [listResults, setListResults] = useState([]);
  return (
    <Card
      containerStyle={cardContainer}
      wrapperStyle={cardWrapperStyle}
      title="Add Trasnport Line">
      <Search query={query} setQuery={setQuery} />
      <View style={styles.lines}>
        {query ? <ListResults query={query} addLine={addLine}/> : <MyLines />}
      </View>
      <View style={styles.button}>
        <Button
          raised
          title="Close"
          onPress={() => setModalVisible(!visible)}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  lines: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'red',
    height: '100%',
    padding: 5,
  },
  button: {
    justifyContent: 'flex-end',
  },
});
const cardWrapperStyle = {
  borderWidth: 0,
  flex: 1,
};

const cardContainer = {
  backgroundColor: 'black',
  flex: 1,
  height: '100%',
  flexDirection: 'column',
  borderWidth: 0, // Remove Border
  shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow IOS
  shadowOffset: {height: 0, width: 0},
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0, // This is for Android
};

export default CardAdd;
