import * as React from 'react';

import { View } from 'react-native';
import { useResponsive } from 'react-native-responsive-breakpoints';

export default function App() {
  const { dataSet, styles } = useResponsive({
    initial: {
      backgroundColor: 'yellow',
      height: 200,
      width: 200,
    },
    query: [
      {
        maxWidth: 500,
        style: {
          height: 300,
          width: 300,
          backgroundColor: 'pink',
        },
      },
      {
        minWidth: 500,
        style: {
          height: 400,
          width: 400,
          backgroundColor: 'black',
        },
      },
      {
        minWidth: 700,
        maxWidth: 850,
        style: {
          height: 600,
          width: 600,
          backgroundColor: 'purple',
        },
      },
    ],
  });

  return (
    <View
      //@ts-ignore - web only prop
      dataSet={dataSet}
      style={styles}
    />
  );
}
