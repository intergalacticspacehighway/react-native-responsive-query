import React from 'react';
import type { UseResponsiveProps, UseResponsiveReturnType } from './types';
import { StyleSheet, useWindowDimensions } from 'react-native';

export const useResponsive = (
  queries: UseResponsiveProps
): UseResponsiveReturnType => {
  const windowWidth = useWindowDimensions().width;

  const values = React.useMemo(() => {
    let styles = queries.initial
      ? [StyleSheet.create({ initial: queries.initial }).initial]
      : [];

    queries.query.forEach((queryRule) => {
      if (queryRule.style) {
        if (
          typeof queryRule.maxWidth === 'number' &&
          typeof queryRule.minWidth === 'number'
        ) {
          if (
            windowWidth >= queryRule.minWidth &&
            windowWidth <= queryRule.maxWidth
          ) {
            styles.push(
              StyleSheet.create({ rangeStyle: queryRule.style }).rangeStyle
            );
          }
        } else if (typeof queryRule.minWidth === 'number') {
          if (windowWidth >= queryRule.minWidth) {
            styles.push(
              StyleSheet.create({ minWidthStyle: queryRule.style })
                .minWidthStyle
            );
          }
        } else if (typeof queryRule.maxWidth === 'number') {
          if (windowWidth <= queryRule.maxWidth) {
            styles.push(
              StyleSheet.create({ maxWidthStyle: queryRule.style })
                .maxWidthStyle
            );
          }
        }
      }
    });

    return { styles };
  }, [queries, windowWidth]);

  return values;
};
