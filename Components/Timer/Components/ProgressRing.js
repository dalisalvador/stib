import React, {Component, useState, useEffect} from 'react';
import Svg, {Circle} from 'react-native-svg';
import Animated from 'react-native-reanimated';

const {divide, multiply, sub} = Animated;

import {YellowBox, View} from 'react-native';

// //TODO:CHECK NOT USING THIS LIFECYCLE METHODS. Ignoring change of lifecycle react-native
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
]);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({...props}) => {
  const {radius, stroke, progress, background, lastBackground} = props;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  //Animation
  // const [background, setBackground] = useState();
  // const [lastBackground, setLastBackground] = useState();

  // useEffect(() => {
  //   if (updateColors === 1) {
  //     // console.log('udpating colors');
  //     generateBackgorund();
  //   }
  // }, [updateColors]);

  // useEffect(() => {
  //   generateBackgorund();
  // }, []);

  // useEffect(() => {
  //   //Backgournd color has changed. Only then clock can start
  //   setUpdateColors(0);
  // }, [background]);

  // const generateBackgorund = () => {
  //   console.log('Generating Backgournds');
  //   console.log({background});
  //   console.log({lastBackground});
  //   if (background) setLastBackground(background);
  //   else setLastBackground('red');

  //   setBackground(
  //     '#' +
  //       Math.random()
  //         .toString(16)
  //         .slice(2, 8),
  //   );
  // };

  const strokeDashoffset = sub(
    circumference,
    multiply(divide(progress, 100), circumference),
  );

  return (
    <Svg height={radius * 2} width={radius * 2}>
      <AnimatedCircle
        // fill={lastBackground}
        fill={lastBackground}
        r={normalizedRadius * 2}
        cx={radius}
        cy={radius}
      />

      <AnimatedCircle
        // stroke={background}
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
