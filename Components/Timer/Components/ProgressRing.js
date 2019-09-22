import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {YellowBox} from 'react-native';

const {divide, multiply, sub} = Animated;

// //TODO:CHECK NOT USING THIS LIFECYCLE METHODS. Ignoring change of lifecycle react-native
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Sending `onReanimatedPropsChange` with no listeners registered.',
]);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({...props}) => {
  const {radius, stroke, progress, background, lastBackground} = props;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = sub(
    circumference,
    multiply(divide(progress, 100), circumference),
  );

  return (
    <Svg height={radius * 2} width={radius * 2}>
      <AnimatedCircle
        fill={lastBackground}
        r={normalizedRadius * 2}
        cx={radius}
        cy={radius}
      />

      <AnimatedCircle
        stroke={background}
        fill={'transparent'}
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{strokeDashoffset}}
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </Svg>
  );
};

export default ProgressRing;
