import React from 'react';
import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const ButtonClose = ({...props}) => {
  const {onPress} = props;
  return (
    <Button
      raised
      title="Close"
      ViewComponent={LinearGradient}
      linearGradientProps={{
        colors: ['#00F490', '#00A2FD'],
        start: {x: 0, y: 0.5},
        end: {x: 1, y: 0.5},
      }}
      buttonStyle={{borderRadius: 150}}
      onPress={onPress}
    />
  );
};

export default ButtonClose;
