import React from 'react';
import { useResponsiveQuery } from '../useResponsiveQuery';
import { render } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';
import { ResponsiveQueryProvider } from '../ResponsiveQueryProvider';

const renderWithProvider = (element: React.ReactNode) => {
  return render(<ResponsiveQueryProvider>{element}</ResponsiveQueryProvider>);
};

// In RN Dimension is mocked to 750px
describe('test responsive styles', () => {
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

    expect(view.props.style).toEqual([
      { backgroundColor: 'yellow' },
      { backgroundColor: 'black' },
    ]);
  });
  it('doesnt apply min width query when it shouldnt', () => {
    const App = () => {
      const { styles } = useResponsiveQuery({
        initial: {
          backgroundColor: 'yellow',
        },
        query: [
          {
            minWidth: 800,
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
      });

      return <View testID="test" style={styles} />;
    };

    const { getByTestId } = renderWithProvider(<App />);
    const view = getByTestId('test');
    expect(view.props.style).toEqual([
      { backgroundColor: 'yellow', height: 100 },
      { backgroundColor: 'black', width: 100 },
    ]);
  });
});
