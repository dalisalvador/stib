import React, {Component, useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Animated, {Easing} from 'react-native-reanimated';
import ProgressRing from './Components/ProgressRing';
const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
  call,
} = Animated;

const Timer = ({progress, generateBackgorund, lastBackground, background}) => {
  return (
    <ProgressRing
      radius={65}
      stroke={26}
      progress={progress}
      background={background}
      lastBackground={lastBackground}
      generateBackgorund={generateBackgorund}
    />
  );
};

export default Timer;
