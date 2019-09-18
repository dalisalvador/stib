import React from 'react';

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

const Timer = ({progress, background, lastBackground}) => {
  return (
    <ProgressRing
      radius={65}
      stroke={26}
      progress={progress}
      background={background}
      lastBackground={lastBackground}
    />
  );
};

export default Timer;
