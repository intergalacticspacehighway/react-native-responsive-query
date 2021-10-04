import * as React from 'react';

import { View } from 'react-native';
import { useResponsiveQuery } from 'react-native-responsive-query';

export default function App() {
  const { dataSet, styles } = useResponsiveQuery({
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
        minWidth: 1200,
        style: {
          height: 400,
          width: 400,
          backgroundColor: 'black',
        },
      },
      {
        minWidth: 1600,
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
