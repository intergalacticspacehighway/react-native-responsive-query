import React from 'react';
import { useResponsiveQuery } from '../useResponsiveQuery.web';
import { render } from '@testing-library/react-native';
//@ts-ignore
import createStyleResolver from 'react-native-web/dist/exports/StyleSheet/createStyleResolver';
import { StyleSheet, View } from 'react-native';
import { ResponsiveQueryProvider } from '../ResponsiveQueryProvider';

const renderWithoutMediaQueries = (element: React.ReactNode) => {
  return render(
    <ResponsiveQueryProvider disableCSSMediaQueries>
      {element}
    </ResponsiveQueryProvider>
  );
};

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

  it('verifies min width query (without media queries)', () => {
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

    const { getByTestId } = renderWithoutMediaQueries(<App />);
    const view = getByTestId('test');

    expect(view.props.style).toEqual([
      { backgroundColor: 'yellow' },
      { backgroundColor: 'black' },
    ]);
  });

  it('verifies min width and max width array queries (without media queries)', () => {
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
            minWidth: 650,
            style: [
              StyleSheet.create({
                wrapper: {
                  backgroundColor: 'black',
                },
              }).wrapper,
              {
                width: 100,
              },
            ],
          },
        ],
        disableCSSMediaQueries: true,
      });

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = render(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([
      { backgroundColor: 'yellow', height: 100 },
      { backgroundColor: 'black', width: 100 },
    ]);
  });

  it("gives higher precedence to hook's disableCSSMediaQueries flag", () => {
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
        disableCSSMediaQueries: false,
      });

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = renderWithoutMediaQueries(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([{ backgroundColor: 'yellow' }]);
    expect(styleResolver.sheet.getTextContent()).toMatchSnapshot();
  });
});
