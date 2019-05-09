# use-focus-path

A [React](https://reactjs.org/) [Hook](https://reactjs.org/docs/hooks-intro.html) for managing focus in TV apps.

## Motivation

Users of TV apps typically use LRUD for navigation. Accordingly, the element on the page that has focus
is of particular importance.

It is not always the case that your runtime environment includes a system for managing focus.
Environments that do include such a system, like the browser, typically have support for a
one dimensional navigation system (i.e.; <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd>), rather than two dimensional
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

## Guides

### What is LRUD?

LRUD is an acronym that stands for left-right-up-down, and it refers to the directional buttons typically found on remotes. In LRUD systems,
input devices usually also have some kind of "submit" button, and, less commonly, a back button.

### What is a Focus Path?

A focus path is a string that represents an element on the page that has focus. For instance, you may
have a focus path of `"profilePage"`, representing that the profile page of your app has focus.

Focus paths can be hierarchical, too. A period is used to separate pieces of the path. In the focus
path `profilePage.0`, the focus is on the 0th item within the profile page.

If you have used a modern JavaScript router, such as [React Router](https://github.com/ReactTraining/react-router),
you may notice the similarity between routes and focus paths. Focus paths are very similar to routes. The
difference is that routes represent the user's location within the app, whereas focus paths represent what has
focus within the app.

### Is this library right for me?

The [limitations](#limitations) described below may help you to determine that.

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
  const { isFocused } = useFocusPath('profile');

  // ...use `isFocused`, or any of the other things returned by `useFocusPath`

  return <div className="profile">Profile</div>;
}
```

To learn more about the different properties of the return value of the hook, refer to the API
documentation below.

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
| `isFocusedExact`    | boolean        | `true` when the `targetFocusPath` is focused exactly.                             |
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

## Limitations

- No support for pointer (mouse) inputs
- No spatial navigation; everything is declarative
