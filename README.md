# React native responsive query

Responsive style hook for React Native apps.

## Why?

- This hook aims to provide an API that can be useful for universal design systems like [dripsy](https://github.com/nandorojo/dripsy), [NativeBase](https://github.com/GeekyAnts/NativeBase) and React Native apps that uses responsive styling.
- It transforms styles to CSS media-query on [react native web](https://github.com/necolas/react-native-web) that can be useful for responsive SSR react native web apps.

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
          backgroundColor: 'pink',
        },
      },
      {
        minWidth: 1200,
        style: {
          backgroundColor: 'black',
        },
      },
      {
        minWidth: 1600,
        style: {
          backgroundColor: 'purple',
        },
      },
    ],
  });

  return <View dataSet={dataSet} style={styles} />;
}
```

- Here, the `View` will have background color `yellow` as default, `pink` when width >= 400, `black` when width >= 1200, `purple` when width >= 1600. It'll have the height and width equals to 200.

## API

### useResponsiveQuery(params?: UseResponsiveQueryParams)

##### UseResponsiveQueryParams

- initial (optional): ReactNativeStyle
- query: Array<{minWidth: number, maxWidth: number, style: ReactNativeStyle}>

### getResponsiveStyles(params?: UseResponsiveQueryParams)

- `useResponsiveQuery` also returns a function named `getResponsiveStyles` for cases where a hook might be inconvenient.

```js
import { View } from 'react-native';
import { useResponsiveQuery } from 'react-native-responsive-query';

export default function App() {
  const { getResponsiveStyles } = useResponsiveQuery();

  const { dataSet, styles } = getResponsiveStyles({
    initial: {
      height: 200,
      width: 200,
    },
    query: [
      {
        minWidth: 400,
        style: {
          backgroundColor: 'pink',
        },
      },
    ],
  });

  return <View dataSet={dataSet} style={styles} />;
}
```

## Range query

```js
const { getResponsiveStyles } = useResponsiveQuery();

const { dataSet, styles } = getResponsiveStyles({
  initial: {
    height: 200,
    width: 200,
  },
  query: [
    {
      minWidth: 400,
      maxWidth: 800,
      style: {
        backgroundColor: 'pink',
      },
    },
  ],
});

return <View dataSet={dataSet} style={styles} />;
```

- Here, background color `pink` will be applied only when screen width is >= 400 and <= 800.

## How it works?

- It uses `dataSet` prop to add responsive styling.
- This library uses some internal/undocumented functions used by React Native web to transform react native styles to web/css styles. Checkout `src/useResponsiveQuery.web.ts` for comments.

## Examples

- SSR React native web app using NextJS

  GitHub - https://github.com/intergalacticspacehighway/rnw-responsive-ssr

  URL - https://rnw-responsive-ssr.vercel.app/

  Try disabling JavaScript in browser, responsive styles will still work.

## Credits

- Thanks to [Fernando](https://github.com/nandorojo) for the hook idea and helping to shape the hook API :)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development

## License

MIT
