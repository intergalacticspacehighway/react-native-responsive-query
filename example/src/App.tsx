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
        minWidth: 400,
        style: {
          height: 300,
          width: 300,
          backgroundColor: 'pink',
        },
      },
      {
        minWidth: 400,
        maxWidth: 500,
        style: {
          height: 500,
          width: 500,
          backgroundColor: 'black',
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
