import React, {useState} from 'react';
import {SearchBar} from 'react-native-elements';
import {Icon} from 'react-native-elements';

const Search = ({...props}) => {
  const {query, setQuery} = props;
  console.log(query);
  return (
    <SearchBar
      placeholder="Type Here..."
      platform="default"
      lightTheme
      round
      searchIcon={<Icon name="search" />}
      inputContainerStyle={styles.inputContainer}
      containerStyle={styles.container}
      inputStyle={{fontSize: 14}}
      onChangeText={setQuery}
      value={query}
    />
  );
};

const styles = {
  container: {
    borderRadius: 30,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  inputContainer: {backgroundColor: 'transparent'},
};

export default Search;
