import type {
  UseResponsiveQueryParams,
  UseResponsiveQueryReturnType,
  GetResponsiveStylesParams,
  GetResponsiveStylesReturnType,
} from './types';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useStableMemo } from './useStableMemo';

export const useResponsiveQuery = (
  queries?: UseResponsiveQueryParams
): UseResponsiveQueryReturnType => {
  const windowWidth = useWindowDimensions().width;

  const values = useStableMemo(() => {
    const getResponsiveStyles = getResponsiveStylesImpl(windowWidth);
    if (queries) {
      const { styles } = getResponsiveStyles(queries);
      return { styles, getResponsiveStyles };
    } else {
      return { getResponsiveStyles };
    }
  }, [queries, windowWidth]);

  return values;
};

const getResponsiveStylesImpl =
  (width: number) =>
  (queries: GetResponsiveStylesParams): GetResponsiveStylesReturnType => {
    if (typeof width === 'number') {
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
            if (width >= queryRule.minWidth && width <= queryRule.maxWidth) {
              styles.push(
                StyleSheet.create({ rangeStyle: flattenQueryStyle }).rangeStyle
              );
            }
          } else if (typeof queryRule.minWidth === 'number') {
            if (width >= queryRule.minWidth) {
              styles.push(
                StyleSheet.create({ minWidthStyle: flattenQueryStyle })
                  .minWidthStyle
              );
            }
          } else if (typeof queryRule.maxWidth === 'number') {
            if (width <= queryRule.maxWidth) {
              styles.push(
                StyleSheet.create({ maxWidthStyle: flattenQueryStyle })
                  .maxWidthStyle
              );
            }
          }
        }
      });
      return { styles };
    }

    return {};
  };
