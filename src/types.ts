import type { TextStyle, ImageStyle, ViewStyle } from 'react-native';

type NamedStyles = ViewStyle | TextStyle | ImageStyle;

export type Query = {
  minWidth?: number;
  maxWidth?: number;
  style?: NamedStyles;
};

export type UseResponsiveQueryProps = {
  initial?: NamedStyles;
  query: Query[];
};

export type DataSet = { [key: string]: boolean };

export type UseResponsiveQueryReturnType = {
  styles?: NamedStyles[];
  dataSet?: DataSet;
};
