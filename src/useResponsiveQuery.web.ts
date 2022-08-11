//@ts-nocheck
import { string as toCSSString } from 'to-style';
import type {
  GetResponsiveStylesReturnType,
  Query,
  UseResponsiveQueryParams,
} from './types';
import React, { useMemo } from 'react';
import getHash from './hash';
import { StyleSheet } from 'react-native';

let styleSheet: any;
let textContentMap: any = {};

const insert = (rule: string) => {
  if (!styleSheet) {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(''));
    document.head.appendChild(styleEl);
    styleSheet = styleEl.sheet;
    window.styleSheet = styleSheet;
  }

  styleSheet.insertRule(rule, styleSheet.cssRules.length);
};

export const useResponsiveQuery = (
  queries: UseResponsiveQueryParams
): GetResponsiveStylesReturnType => {
  const cssClass = 'responsive-' + getHash(JSON.stringify(queries));
  const classSelector = `.${cssClass}`;
  const cssRules = [];

  const styles = useMemo(() => {
    queries?.query?.forEach((query) => {
      const cssString = toCSSRule(query, classSelector);
      cssRules.push(cssString);
      textContentMap[cssString] = true;
    });

    return [
      StyleSheet.create({ a: queries.initial }).a,
      { $$css: true, responsiveStyles: cssClass },
    ];
    // assuming classSelector will be different if queries changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classSelector]);

  (React.useInsertionEffect || React.useLayoutEffect)(() => {
    cssRules.forEach((rule) => {
      insert(rule);
    });
  }, [cssRules]);

  //@ts-ignore
  return { styles };
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

export const getTextContent = () => {
  return Object.keys(textContentMap).join('');
};
