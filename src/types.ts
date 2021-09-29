import type { TextStyle, ImageStyle, ViewStyle } from 'react-native';

type NamedStyles = ViewStyle | TextStyle | ImageStyle;

export type Query = {
  minWidth?: number;
  maxWidth?: number;
  style?: NamedStyles;
};

export type UseResponsiveProps = {
  initial?: NamedStyles;
  query: Query[];
};
