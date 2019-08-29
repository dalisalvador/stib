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
  const [query, setQuery] = useState('');
  const [listResults, setListResults] = useState([]);
  return (
    <View style={styles.container}>
      <Card
        containerStyle={cardContainer}
        wrapperStyle={{borderWidth: 0}}
        title="Add Trasnport Line">
        <View>
          <Search query={query} setQuery={setQuery} />
          {query ? <ListResults /> : <MyLines />}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '90%',
  },
});

const cardContainer = {
  borderWidth: 0, // Remove Border
  shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow IOS
  shadowOffset: {height: 0, width: 0},
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0, // This is for Android
};

export default CardAdd;
