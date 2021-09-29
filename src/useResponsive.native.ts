import type { UseResponsiveProps } from './types';
import { StyleSheet, useWindowDimensions } from 'react-native';

export const useResponsive = (queries: UseResponsiveProps) => {
  let styles = [];

  if (queries.initial) {
    styles.push(StyleSheet.create({ initial: queries.initial }).initial);
  }

  const windowWidth = useWindowDimensions().width;

  queries.query.forEach((queryRule) => {
    if (
      typeof queryRule.maxWidth === 'number' &&
      typeof queryRule.minWidth === 'number'
    ) {
      if (
        windowWidth >= queryRule.minWidth &&
        windowWidth <= queryRule.maxWidth &&
        queryRule.style
      ) {
        styles.push(
          StyleSheet.create({ rangeStyle: queryRule.style }).rangeStyle
        );
      }
    } else if (typeof queryRule.minWidth === 'number') {
      if (windowWidth >= queryRule.minWidth && queryRule.style) {
        styles.push(
          StyleSheet.create({ minWidthStyle: queryRule.style }).minWidthStyle
        );
      }
    } else if (typeof queryRule.maxWidth === 'number') {
      if (windowWidth <= queryRule.maxWidth && queryRule.style) {
        styles.push(
          StyleSheet.create({ maxWidthStyle: queryRule.style }).maxWidthStyle
        );
      }
    }
  });

  return { styles };
};
