import React from 'react';

import {FloatingAction} from 'react-native-floating-action';
import {Image} from 'react-native-elements';
import menu from '../../assets/img/menu.png';
import add from '../../assets/img/add.png';

export default function FloatingButton({...props}) {
  const {setModalLines, setModalSettings, setModalAbout} = props;
  const actions = [
    {
      // text: 'Add Line',
      icon: require('../../assets/img/add.png'),
      name: 'addLine',
      position: 1,
      iconWidth: 40,
      iconHeight: 40,
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
      onPressItem={name => {
        if (name === 'addLine') setModalLines(true);
        else if (name === 'settings') setModalSettings(true);
        else if (name === 'about') setModalAbout(true);
      }}
    />
  );
}
