import * as React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { useResponsiveQuery } from 'react-native-responsive-query';

export default function App() {
  const { styles } = useResponsiveQuery({
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
        minWidth: 800,
        style: {
          height: 400,
          width: 400,
          backgroundColor: 'black',
        },
      },
      {
        minWidth: 1300,
        style: [
          StyleSheet.create({
            wrapper: {
              height: 600,
              width: 600,
            },
          }).wrapper,
          {
            width: 600,
            backgroundColor: 'purple',
          },
        ],
      },
    ],
  });

  console.log('styles ', styles);

  return (
    <ScrollView>
      <View style={styles} />

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
