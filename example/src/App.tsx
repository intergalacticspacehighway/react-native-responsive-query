import * as React from 'react';

import { View } from 'react-native';
import { useResponsiveStyles } from 'react-native-responsive-breakpoints';

export default function App() {
  const { dataId } = useResponsiveStyles({
    480: {
      backgroundColor: 'black',
      height: 100,
      width: 100,
    },
    800: {
      backgroundColor: 'pink',
      height: 50,
      width: 50,
    },
  });

  return <View dataSet={dataId} />;
}
