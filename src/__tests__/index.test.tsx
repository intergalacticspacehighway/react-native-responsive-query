import React from 'react';
import { useResponsive } from '../useResponsive';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';

// In RN Dimension is mocked to 750px
describe('test responsive styles', () => {
  it('verifies min width query', () => {
    const App = () => {
      const { styles } = useResponsive({
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
      const { styles } = useResponsive({
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
});
