# React native responsive query

## Installation

```sh
yarn add react-native-responsive-query

// or

npm install react-native-responsive-query
```

## Usage

```js
import { View } from 'react-native';
import { useResponsiveQuery } from 'react-native-responsive-query';

export default function App() {
  const { dataSet, styles } = useResponsiveQuery({
    initial: {
      backgroundColor: 'yellow',
      height: 200,
      width: 200,
    },
    query: [
      {
        minWidth: 400,
        style: {
          height: 300,
          width: 300,
          backgroundColor: 'pink',
        },
      },
      {
        minWidth: 1200,
        style: {
          height: 400,
          width: 400,
          backgroundColor: 'black',
        },
      },
      {
        minWidth: 1600,
        style: {
          height: 600,
          width: 600,
          backgroundColor: 'purple',
        },
      },
    ],
  });

  return <View dataSet={dataSet} style={styles} />;
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
