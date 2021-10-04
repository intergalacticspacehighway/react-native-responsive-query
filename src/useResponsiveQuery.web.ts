//@ts-ignore
import createCompileableStyle from 'react-native-web/dist/exports/StyleSheet/createCompileableStyle';
//@ts-ignore
import i18nStyle from 'react-native-web/dist/exports/StyleSheet/i18nStyle';
//@ts-ignore
import { atomic } from 'react-native-web/dist/exports/StyleSheet/compile';
//@ts-ignore
import styleResolver from 'react-native-web/dist/exports/StyleSheet/styleResolver';
import type {
  DataSet,
  Query,
  UseResponsiveQueryProps,
  UseResponsiveQueryReturnType,
} from './types';
import { StyleSheet } from 'react-native';
import { useStableMemo } from './useStableMemo';

// 1. i18nStyle - Does swapping of ltr styles if enabled by user

// 2. createCompileableStyle - Handles shadow/text shadow conversion from RN styles to web styles

// 3. atomic - God function. Pure and memoizes input/output.
// This is a great function, it handles prefixing, converting RN specific styles to web styles and generating the CSS selector
// Input {marginTop: 10}
// Output {"r-margin-top-[hash]-10": {
//   property: "marginTop",
//   value: "10px",
//   identifier: "r-margin-top-[hash]-10",
//   rules: [{`.r-margin-top-[hash]-10: {'margin-top': '10px;`} }]
// }}

// 4. styleResolver - holds the reference of sheet object used to inject CSS. This exposes 2 functions.
// - getTextContent => for ssr style injection
// - insert => for inserting styles in style tag
// If we somehow manage to use these functions, we won't need any extra workarounds for ssr initial style injection or CSS declaration order specifictity

// Here issue is that it internally uses a cache to verify if a css rule is inserted using selector name (class name generated by RN web)
// refer line number 121 in `react-native-web/dist/exports/StyleSheet/createOrdererdCSSStyleSheetfile`.
// We can fool this hash id generator by adding a comment on top of our media query rule in this format. /* media-query + data-attr {} */ then it'll start using media-query + data-attr as cache key

const MEDIA_QUERY_STYLESHEET_GROUP = 3;

export const useResponsiveQuery = (
  queries: UseResponsiveQueryProps
): UseResponsiveQueryReturnType => {
  const values = useStableMemo(() => {
    const styles = queries.initial
      ? [StyleSheet.create({ initial: queries.initial }).initial]
      : undefined;

    let dataSet: DataSet = {};

    queries.query.forEach((queryRule) => {
      const newStyle = createCompileableStyle(i18nStyle(queryRule.style));
      const results = atomic(newStyle);

      // Rule returned by atomic has css selectors, so we'll replace it with data-attr selector
      Object.keys(results).forEach((key) => {
        const oldIdentifier = results[key].identifier;
        const dataAttribute = getDataAttributeForRule(
          queryRule,
          results[key].identifier
        );

        if (dataAttribute) {
          dataSet[dataAttribute] = true;
          const newIdentifier = `[data-${dataAttribute}]`;

          results[key].rules.forEach((oldRule: string) => {
            const newRule = oldRule.replace('.' + oldIdentifier, newIdentifier);

            const mediaQueryRule = getMediaQueryRule(queryRule, newRule);

            // Here by prepending the /*${newIdentifier}{}*/ comment, we're kind of fooling the regex used by rn-web to verify if a rule is inserted or not.
            // Looks safe to me, just need to keep a check if there are any implementation changes in createStyleSheet file in rn-web in future.
            // Second argument defines the order of the insertion. DataSet and class selectors have same CSS specificity so we need to make sure that media rules have higher precedence. Max precendence in RN web is around 2.2 so 3 ensures styles will be appended later
            styleResolver.sheet.insert(
              `/*${newIdentifier}{}*/${mediaQueryRule}`,
              MEDIA_QUERY_STYLESHEET_GROUP
            );
          });
        }
      });
    });

    return { styles, dataSet };
  }, [queries]);

  return values;
};

const getDataAttributeForRule = (queryRule: Query, ruleSelector: string) => {
  if (
    typeof queryRule.minWidth === 'number' &&
    typeof queryRule.maxWidth === 'number'
  ) {
    return `min-width-${queryRule.minWidth}-max-width-${queryRule.maxWidth}-${ruleSelector}`.toLowerCase();
  } else if (typeof queryRule.minWidth === 'number') {
    return `min-width-${queryRule.minWidth}-${ruleSelector}`.toLowerCase();
  } else if (typeof queryRule.maxWidth === 'number') {
    return `max-width-${queryRule.maxWidth}-${ruleSelector}`.toLowerCase();
  }

  return undefined;
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
