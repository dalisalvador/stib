import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'slide1',
    image: require('./assets/1.jpg'),
  },
  {
    key: 'slide2',
    image: require('./assets/2.jpeg'),
  },
  {
    key: 'slide3',
    image: require('./assets/3.jpeg'),
  },
];

const IntroSlides = ({...props}) => {
  const {setShowSlides} = props;

  _renderItem = ({item}) => {
    return (
      <View style={styles.container}>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      showDoneButton={true}
      slides={slides}
      onDone={() => setShowSlides(false)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default IntroSlides;
