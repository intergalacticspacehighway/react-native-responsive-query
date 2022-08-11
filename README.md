# React native responsive query

Responsive style hook for React Native apps.

## Why?

- This hook aims to provide an API that can be useful for universal design systems like [dripsy](https://github.com/nandorojo/dripsy), [NativeBase](https://github.com/GeekyAnts/NativeBase) and React Native apps that uses responsive styling.
- It transforms styles to CSS media-query on [react native web](https://github.com/necolas/react-native-web) that can be useful for responsive SSR react native web apps.
- Read [disableCSSMediaQueries](#disable-css-media-queries) section.

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
  const { styles } = useResponsiveQuery({
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

  return <View style={styles} />;
}
```

- Here, the `View` will have background color `yellow` as default, `pink` when width >= 400, `black` when width >= 1200, `purple` when width >= 1600. It'll have the height and width equals to 200.

## API

### useResponsiveQuery(params?: UseResponsiveQueryParams)

##### UseResponsiveQueryParams

- initial (optional): ReactNativeStyle
- query: Array<{minWidth: number, maxWidth: number, style: ReactNativeStyle}>
- [disableCSSMediaQueries](#disable-css-media-queries) (optional): boolean

### getResponsiveStyles(params?: UseResponsiveQueryParams)

- `useResponsiveQuery` also returns a function named `getResponsiveStyles` for cases where a hook might be inconvenient.

```js
import { View } from 'react-native';
import { useResponsiveQuery } from 'react-native-responsive-query';

export default function App() {
  const { getResponsiveStyles } = useResponsiveQuery();

  const { styles } = getResponsiveStyles({
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

  return <View style={styles} />;
}
```

## Range query

```js
const { styles } = useResponsiveQuery({
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

return <View style={styles} />;
```

- Here, background color `pink` will be applied only when screen width is >= 400 and <= 800.

## Disable CSS media queries

- You can disable CSS media queries by using `disableCSSMediaQueries` boolean at the hook level or the Provider level.

### Using a Provider

- The below snippet will disable CSS media queries for all the hooks.

```js
import { ResponsiveQueryProvider } from 'react-native-responsive-query';

function App() {
  return (
    <ResponsiveQueryProvider disableCSSMediaQueries>
      {/* Your app goes here */}
    </ResponsiveQueryProvider>
  );
}
```

### Using hook

- The below hook will disable CSS media queries for this particular hook.

```js
const { styles } = useResponsiveQuery({
  disableCSSMediaQueries: true,
  query: [
    {
      minWidth: 400,
      style: {
        backgroundColor: 'pink',
      },
    },
  ],
});

return <View style={styles} />;
```

## Examples

- SSR React native web app using NextJS

  GitHub - https://github.com/intergalacticspacehighway/rnw-responsive-ssr

  URL - https://rnw-responsive-ssr.vercel.app/

  Try disabling JavaScript in browser, responsive styles will still work.

## Credits

- Thanks to [Fernando](https://github.com/nandorojo) for the hook idea and helping to shape the hook API :)

---

**NOTE**

Media query is currently a web-only feature. RNW recommends on using Dimension listener (which uses window resize event) for responsive layouts which is better IMO but can be limiting if one needs device dimension based styling for SSR apps.
You can use `disableCSSMediaQueries` option if you are not using SSR responsive styling or if it's a client side rendered app.
Read more here - [#1688](https://github.com/necolas/react-native-web/issues/1688) and [RNW talk](https://youtu.be/tFFn39lLO-U)

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development

## License

MIT
