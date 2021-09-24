//@ts-nocheck
import createCompileableStyle from 'react-native-web/dist/exports/StyleSheet/createCompileableStyle';
import i18nStyle from 'react-native-web/dist/exports/StyleSheet/i18nStyle';
import { atomic } from 'react-native-web/dist/exports/StyleSheet/compile';

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

const getMinWidthMediaQuery = (width, value) =>
  `@media only screen and (min-width: ${width}px) { ${value} } `;

const getStyleContent = (css) => {
  return `<style id="responsive-styles">${css}</style>`;
};

export const useResponsiveStyles = (style: any) => {
  // Generate unique data-ids
  const id = 'random-id';
  const dataId = `[data-responsive="${id}"]`;

  let responsiveStyles = '';
  Object.keys(style).map((value) => {
    let cssRulesForThisBreakPoint = '';

    const newStyle = createCompileableStyle(i18nStyle(style[value]));
    const results = atomic(newStyle);

    // Rule returned by atomic has css selectors, so we'll replace it with data-attr selector
    const resultsWithDataAttr = Object.keys(results).map((key) => {
      return {
        ...results[key],
        rules: results[key].rules.map((rule) => {
          return rule.replace('.' + results[key].identifier, dataId);
        }),
      };
    });

    // Loop over all the above rules and generate a single @media rule
    Object.keys(resultsWithDataAttr).forEach((key) => {
      const { rules } = resultsWithDataAttr[key];
      rules.forEach((rule) => {
        cssRulesForThisBreakPoint = cssRulesForThisBreakPoint + rule;
      });
    });
    responsiveStyles =
      responsiveStyles +
      getMinWidthMediaQuery(value, cssRulesForThisBreakPoint);
  });

  // POC HACK
  // Still looking into if we can use the same sheet object used by RN web internally - In progress (I think we can)
  document.head.innerHTML =
    document.head.innerHTML + `${getStyleContent(responsiveStyles)}`;

  return { dataId: { responsive: id } };
};
