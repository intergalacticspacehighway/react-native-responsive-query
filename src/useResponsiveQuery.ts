import type {
  UseResponsiveQueryProps,
  UseResponsiveQueryReturnType,
} from './types';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useStableMemo } from './useStableMemo';

export const useResponsiveQuery = (
  queries: UseResponsiveQueryProps
): UseResponsiveQueryReturnType => {
  const windowWidth = useWindowDimensions().width;

  const values = useStableMemo(() => {
    let styles = queries.initial
      ? [
          StyleSheet.create({ initial: StyleSheet.flatten(queries.initial) })
            .initial,
        ]
      : [];

    queries.query.forEach((queryRule) => {
      if (queryRule.style) {
        const flattenQueryStyle = StyleSheet.flatten(queryRule.style);

        if (
          typeof queryRule.maxWidth === 'number' &&
          typeof queryRule.minWidth === 'number'
        ) {
          if (
            windowWidth >= queryRule.minWidth &&
            windowWidth <= queryRule.maxWidth
          ) {
            styles.push(
              StyleSheet.create({ rangeStyle: flattenQueryStyle }).rangeStyle
            );
          }
        } else if (typeof queryRule.minWidth === 'number') {
          if (windowWidth >= queryRule.minWidth) {
            styles.push(
              StyleSheet.create({ minWidthStyle: flattenQueryStyle })
                .minWidthStyle
            );
          }
        } else if (typeof queryRule.maxWidth === 'number') {
          if (windowWidth <= queryRule.maxWidth) {
            styles.push(
              StyleSheet.create({ maxWidthStyle: flattenQueryStyle })
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
