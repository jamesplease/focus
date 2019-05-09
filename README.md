# use-focus-path

A [React](https://reactjs.org/) [Hook](https://reactjs.org/docs/hooks-intro.html) for managing focus in TV apps.

## Motivation

Users of TV apps typically use LRUD for navigation. Accordingly, the item that has focus
is of particular importance.

It is not always the case that your app environment includes a system for managing focus.
Environments that do support it, like the browser, typically have support for a
one dimensional navigation system (<kbd>Tab</kbd> and <kbd>Shift + Tab</kbd>), rather than two dimensional
navigation (LRUD).

For these reasons, it is up to the app to manage its own focus state. This hook helps you to do that.

## Installation

Install using [npm](https://www.npmjs.com):

```
npm install use-focus-path
```

or [yarn](https://yarnpkg.com/):

```
yarn add use-focus-path
```

## Getting Started

Configure the Provider somewhere high up in your application's component tree. You may
optionally specify an initial focus path.

```jsx
import { FocusProvider } from 'use-focus-path';

export default function App() {
  return (
    <FocusProvider initialFocusPath="app.profile.settings.0">
      <AppContents />
    </FocusProvider>
  );
}
```

Next, use the hook in your components.

```jsx
import { useFocusPath } from 'use-focus-path';

export default function Profile() {
  const focusPath = useFocusPath('profile');

  // ...use the focusPath variable

  return <div className="profile">Profile</div>;
}
```

To learn more about the different properties of the `focusPath`, refer to the API documentation below.

## API

This library has two named exports: `FocusProvider` and `useFocusPath`.

### `<FocusProvider />`

A [Context](https://reactjs.org/docs/context.html) Provider that you must place at the root of your application.

```jsx
import { FocusProvider } from 'use-focus-path';

export default function App() {
  return (
    <FocusProvider initialFocusPath="app.profile.settings.0">
      <AppContents />
    </FocusProvider>
  );
}
```

| Prop               | Default value | Description                                        |
| ------------------ | ------------- | -------------------------------------------------- |
| `initialFocusPath` | `""`          | The focus path to use when the app is initialized. |

### `useFocusPath( targetFocusPath )`

A [Hook](https://reactjs.org/docs/hooks-intro.html) that returns information about whether or not `targetFocusPath` is focused, as well as
functions to update the focus path.

| Arguments         | Type   | Default value | Description                                              |
| ----------------- | ------ | ------------- | -------------------------------------------------------- |
| `targetFocusPath` | string | `""`          | The focus path you are interested in knowing more about. |

The return value of the hook has the following properties:

| Arguments           | Type           | Description                                                                       |
| ------------------- | -------------- | --------------------------------------------------------------------------------- |
| `isFocused`         | boolean        | `true` when the `targetFocusPath`, or a child path, is focused.                   |
| `isFocusedExact`    | boolean        | `true` when the `targetFocusPath` is focused, but not a child of it.              |
| `child`             | string\|number | The direct child of `targetFocusPath`. Will be a number if the child is a number. |
| `focusPath`         | string         | The full focus path.                                                              |
| `setFocusPath`      | function       | Set a new focus path.                                                             |
| `setFocusedChild`   | function       | Update the focused child of `targetFocusPath`.                                    |
| `setFocusedSibling` | function       | Update the focus path with a sibling of `targetFocusPath`.                        |

```jsx
import { useFocusPath } from 'use-focus-path';

export default function Profile() {
  const { isFocused } = useFocusPath('profile');

  useEffect(() => {
    console.log('The focus state changed', isFocused);
  }, [isFocused]);

  return <div className="profile">Profile</div>;
}
```

## Prior Art

- ["Pass the Remote" on the Netflix Tech Blog](https://medium.com/netflix-techblog/pass-the-remote-user-input-on-tv-devices-923f6920c9a8)
- [bb/lrud](https://github.com/bbc/lrud)
- [react-tv](https://github.com/raphamorim/react-tv)
