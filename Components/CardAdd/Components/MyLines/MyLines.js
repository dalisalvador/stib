import React from 'react';
import {View, Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {AllLinesConsumer} from '../../../../allLinesContext';

const MyLines = ({...props}) => {
  const list = [
    {
      name: 'Amy Farha',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman',
    },
  ];

  //console.log(user);
  return (
    <AllLinesConsumer>
      {props => {
        return (
          <View>
            <Text>My Lines</Text>
            {/* {list.map((l, i) => (
              <ListItem
                key={i}
                leftAvatar={{source: {uri: l.avatar_url}}}
                title={l.name}
                subtitle={l.subtitle}
              />
            ))} */}
          </View>
        );
      }}
    </AllLinesConsumer>
  );
};

export default MyLines;
