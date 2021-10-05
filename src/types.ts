import type { StyleSheet } from 'react-native';

type StyleSheetStyle = Parameters<typeof StyleSheet.create>[0]['initial'];

export type Query = {
  minWidth?: number;
  maxWidth?: number;
  style?: StyleSheetStyle | StyleSheetStyle[];
};

export type UseResponsiveQueryProps = {
  initial?: StyleSheetStyle | StyleSheetStyle[];
  query: Query[];
};

export type DataSet = { [key: string]: boolean };

export type UseResponsiveQueryReturnType = {
  styles?: StyleSheetStyle[];
  dataSet?: DataSet;
};
