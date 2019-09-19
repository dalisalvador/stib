import React from 'react';

import {FloatingAction} from 'react-native-floating-action';
import {Image} from 'react-native-elements';
import menu from '../../assets/img/menu.png';
import add from '../../assets/img/add.png';

export default function FloatingButton({...props}) {
  const {
    setMainPressed,
    mainPressed,
    setModalVisible,
    setModalSettings,
  } = props;
  const actions = [
    {
      // text: 'Add Line',
      icon: require('../../assets/img/add.png'),
      name: 'addLine',
      position: 1,
      iconWidth: 45,
      iconHeight: 45,
    },
    {
      // text: 'Settings',
      icon: require('../../assets/img/settings.png'),
      name: 'settings',
      position: 1,
      iconWidth: 40,
      iconHeight: 40,
    },
    {
      // text: 'About',
      icon: require('../../assets/img/about.png'),
      name: 'about',
      position: 2,
      iconWidth: 40,
      iconHeight: 40,
    },
  ];

  return (
    <FloatingAction
      actions={actions}
      floatingIcon={menu}
      iconWidth={57}
      iconHeight={57}
      onPressMain={() => setMainPressed(!mainPressed)}
      onPressBackdrop={() => setMainPressed(false)}
      onPressItem={name => {
        if (name === 'addLine') {
          setMainPressed(false);
          setModalVisible(true);
        } else if (name === 'settings') {
          setModalSettings(true);
        }
      }}
    />
  );
}
