import React from 'react';
import { useResponsiveQuery } from '../useResponsiveQuery.web';
import { render } from '@testing-library/react-native';
//@ts-ignore
import createStyleResolver from 'react-native-web/dist/exports/StyleSheet/createStyleResolver';
import { View } from 'react-native';

let styleResolver: any;

describe('test responsive styles', () => {
  beforeEach(() => {
    styleResolver = createStyleResolver();
    require('react-native-web/dist/exports/StyleSheet/styleResolver').default =
      styleResolver;
  });

  it('verifies min width query', () => {
    const App = () => {
      const { styles } = useResponsiveQuery({
        initial: {
          backgroundColor: 'yellow',
        },
        query: [
          {
            minWidth: 500,
            style: {
              backgroundColor: 'black',
            },
          },
        ],
      });

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([{ backgroundColor: 'yellow' }]);
    expect(styleResolver.sheet.getTextContent()).toContain(
      '/*[data-min-width-500-r-backgroundcolor-kemksi]{}*/@media only screen and (min-width: 500px) { [data-min-width-500-r-backgroundcolor-kemksi]{background-color:rgba(0,0,0,1.00);} }'
    );
  });

  it('verifies min width and max width query', () => {
    const App = () => {
      const { styles } = useResponsiveQuery({
        initial: {
          backgroundColor: 'yellow',
        },
        query: [
          {
            maxWidth: 400,
            style: {
              backgroundColor: 'black',
            },
          },
          {
            minWidth: 400,
            style: {
              backgroundColor: 'pink',
            },
          },
        ],
      });

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([{ backgroundColor: 'yellow' }]);
    expect(styleResolver.sheet.getTextContent()).toContain(
      `/*[data-max-width-400-r-backgroundcolor-kemksi]{}*/@media only screen and (max-width: 400px) { [data-max-width-400-r-backgroundcolor-kemksi]{background-color:rgba(0,0,0,1.00);} }`
    );
    expect(styleResolver.sheet.getTextContent()).toContain(
      `/*[data-min-width-400-r-backgroundcolor-bwrkcz]{}*/@media only screen and (min-width: 400px) { [data-min-width-400-r-backgroundcolor-bwrkcz]{background-color:rgba(255,192,203,1.00);} }`
    );
  });

  it('verifies min width and max width array queries', () => {
    const App = () => {
      const { styles } = useResponsiveQuery({
        initial: [
          {
            backgroundColor: 'yellow',
          },
          { height: 100 },
        ],
        query: [
          {
            maxWidth: 400,
            style: [
              {
                backgroundColor: 'black',
              },
              { maxHeight: 200 },
            ],
          },
          {
            minWidth: 400,
            style: {
              backgroundColor: 'pink',
            },
          },
        ],
      });

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([
      { backgroundColor: 'yellow', height: 100 },
    ]);
    console.log('text content', styleResolver.sheet.getTextContent());
    expect(styleResolver.sheet.getTextContent()).toContain(
      `/*[data-max-width-400-r-backgroundcolor-kemksi]{}*/@media only screen and (max-width: 400px) { [data-max-width-400-r-backgroundcolor-kemksi]{background-color:rgba(0,0,0,1.00);} }`
    );
    expect(styleResolver.sheet.getTextContent()).toContain(
      `/*[data-max-width-400-r-maxheight-1uq9rlk]{}*/@media only screen and (max-width: 400px) { [data-max-width-400-r-maxheight-1uq9rlk]{max-height:200px;} }`
    );
    expect(styleResolver.sheet.getTextContent()).toContain(
      `/*[data-min-width-400-r-backgroundcolor-bwrkcz]{}*/@media only screen and (min-width: 400px) { [data-min-width-400-r-backgroundcolor-bwrkcz]{background-color:rgba(255,192,203,1.00);} }`
    );
  });
});
