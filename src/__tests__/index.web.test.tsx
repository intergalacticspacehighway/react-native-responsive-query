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
    const query = {
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
    };

    const App = () => {
      const { styles } = useResponsiveQuery(query);

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([{ backgroundColor: 'yellow' }]);
    expect(styleResolver.sheet.getTextContent()).toMatchSnapshot();
  });

  it('verifies min width and max width query', () => {
    const query = {
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
    };

    const App = () => {
      const { styles } = useResponsiveQuery(query);

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([{ backgroundColor: 'yellow' }]);
    expect(styleResolver.sheet.getTextContent()).toMatchSnapshot();
  });

  it('verifies min width and max width array queries', () => {
    const query = {
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
    };

    const App = () => {
      const { styles } = useResponsiveQuery(query);

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([
      { backgroundColor: 'yellow', height: 100 },
    ]);
    // console.log('text content', styleResolver.sheet.getTextContent());
    expect(styleResolver.sheet.getTextContent()).toMatchSnapshot();
  });
});
