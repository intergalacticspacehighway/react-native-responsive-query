//@ts-ignore
import { string as toCSSString } from 'to-style';
import type {
  GetResponsiveStylesReturnType,
  Query,
  UseResponsiveQueryParams,
  GetResponsiveStylesParams,
} from './types';
import React, { useMemo } from 'react';
import getHash from './hash';
import { StyleSheet } from 'react-native';
import { ResponsiveQueryContext } from './ResponsiveQueryProvider';
import { getResponsiveStylesImpl, useDimensionsWithEnable } from './common';

let styleSheet: any;
let textContentMap: any = {};

const useResponsiveQuery = (
  queries: UseResponsiveQueryParams
): GetResponsiveStylesReturnType => {
  const responsiveQueryContext = React.useContext(ResponsiveQueryContext);
  const disableCSSMediaQueries =
    queries?.disableCSSMediaQueries ??
    responsiveQueryContext.disableCSSMediaQueries;

  // Only attaches listener if disableCSSMediaQueries is true
  const windowWidth = useDimensionsWithEnable({
    enable: disableCSSMediaQueries,
  }).width;

  const cssClass = queries
    ? 'responsive-' + getHash(JSON.stringify(queries))
    : undefined;

  const result = useMemo(() => {
    if (disableCSSMediaQueries) {
      const getResponsiveStyles = getResponsiveStylesImpl(windowWidth);
      if (queries) {
        const { styles } = getResponsiveStyles(queries);
        return { styles, getResponsiveStyles };
      } else {
        return { getResponsiveStyles };
      }
    } else {
      if (queries) {
        const { styles } = getResponsiveStyles(queries, cssClass);
        return { styles, getResponsiveStyles };
      } else {
        return { getResponsiveStyles };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssClass, disableCSSMediaQueries, windowWidth]);

  return result;
};

const getResponsiveStyles = (
  queries: GetResponsiveStylesParams,
  cssClass?: string
): GetResponsiveStylesReturnType => {
  const cssClassName =
    cssClass ?? 'responsive-' + getHash(JSON.stringify(queries));

  const classSelector = `.${cssClassName}`;
  queries?.query?.forEach((query) => {
    const cssString = toCSSRule(query, classSelector);
    if (cssString) {
      insert(cssString);
      textContentMap[cssString] = true;
    }
  });

  return {
    styles: [
      //@ts-ignore
      StyleSheet.create({ a: queries.initial }).a,
      { $$css: true, responsiveStyles: cssClassName },
    ],
  };
};

const toCSSRule = (query: Query, classSelector: string) => {
  const cssString = toCSSString(query.style);
  const rule = `${classSelector}{${cssString}}`;
  const cssRuleWithMediaQuery = getMediaQueryRule(query, rule);
  return cssRuleWithMediaQuery;
};

const getMediaQueryRule = (query: Query, newRule: string) => {
  if (
    typeof query.minWidth === 'number' &&
    typeof query.maxWidth === 'number'
  ) {
    return `@media only screen and (min-width: ${query.minWidth}px) and (max-width: ${query.maxWidth}px) { ${newRule} }`;
  } else if (typeof query.minWidth === 'number') {
    return `@media only screen and (min-width: ${query.minWidth}px) { ${newRule} }`;
  } else if (typeof query.maxWidth === 'number') {
    return `@media only screen and (max-width: ${query.maxWidth}px) { ${newRule} }`;
  }
  return undefined;
};

const getStyleElement = () => {
  return (
    <style
      type="text/css"
      dangerouslySetInnerHTML={{ __html: Object.keys(textContentMap).join('') }}
    />
  );
};

const insert = (rule: string) => {
  if (!styleSheet) {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(''));
    document.head.appendChild(styleEl);
    styleSheet = styleEl.sheet;
  }

  styleSheet.insertRule(rule, styleSheet.cssRules.length);
};

export { getStyleElement, useResponsiveQuery };
