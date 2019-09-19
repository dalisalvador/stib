import React from 'react';

import {FloatingAction} from 'react-native-floating-action';

export default function FloatingButton({...props}) {
  const {
    setMainPressed,
    mainPressed,
    setModalVisible,
    setModalSettings,
  } = props;
  const actions = [
    {
      text: 'Add Line',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/201/201531.svg',
      },
      name: 'addLine',
      position: 1,
    },
    {
      text: 'Settings',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/201/201531.svg',
      },
      name: 'settings',
      position: 1,
    },
    {
      text: 'About',
      icon: {
        uri: 'https://www.flaticon.com/premium-icon/icons/svg/205/205577.svg',
      },
      name: 'about',
      position: 2,
    },
  ];

  return (
    <FloatingAction
      actions={actions}
      overlayColor={'rgba(0, 0, 0, 0)'}
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
