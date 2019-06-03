# focus

A [React](https://reactjs.org/) library for managing focus in TV apps.

## Motivation

Users of TV apps typically use LRUD for navigation. Accordingly, the element on the page that has focus
is of particular importance.

It is not always the case that your runtime environment includes a system for managing focus.
Environments that do include such a system, like the browser, typically have support for a
focus system that doesn't align with the needs of TVs.

Because of this, it is up to the app to manage its own focus state. This library helps you to do that.

## Installation

Install using [npm](https://www.npmjs.com):

```
npm install @xdproto/focus
```

or [yarn](https://yarnpkg.com/):

```
yarn add @xdproto/focus
```

## Guides

### What is LRUD?

LRUD is an acronym that stands for left-right-up-down, and it refers to the directional buttons typically found on remotes. In LRUD systems,
input devices usually also have some kind of "submit" button, and, less commonly, a back button.

### Is this library right for me?

The [limitations](#limitations) described below may help you to determine that.

## Getting Started

Render the `FocusRoot` somewhere high up in your application's component tree. This is the root node of the focus tree.

```jsx
import { FocusRoot } from 'use-focus-path';

export default function App() {
  return (
    <FocusRoot>
      <AppContents />
    </FocusRoot>
  );
}
```

Next, use the Focusable component to create a focusable node on the page.

```jsx
import { Focusable } from 'use-focus-path';

export default function Profile() {
  return <Focusable className="profile">Profile</Focusable>;
}
```

This library manages moving focus between the Focusable nodes as the user inputs
LRUD commands.

Configuring this behavior is managed entirely through props of the Focusable components. To
learn more about those props, refer to the API documentation below.

## API

This library has three named exports: `FocusRoot`, `Focusable`, and `useFocus`.

### `<FocusRoot />`

Serves as the root node of a new focus hierarchy.

All props are optional.

| Prop          | Type    | Default value | Description                                                                                             |
| ------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `orientation` | string  | 'horizontal'  | Whether the children of the root node are arranged horizontally or vertically.                          |
| `wrapping`    | boolean | 'false'       | Set to `true` for the navigation to wrap when the user reaches the start or end of the root's children. |

```jsx
import { FocusRoot } from 'use-focus-path';

export default function App() {
  return (
    <FocusRoot orientation="vertical">
      <AppContents />
    </FocusRoot>
  );
}
```

### `useFocus()`

A [Hook](https://reactjs.org/docs/hooks-intro.html) that returns utilities for working with focus.

```js
import { useFocus } from 'use-focus-path';

export default function MyComponent() {
  const { setFocus, isFocused } = useFocus();

  useEffect(() => {
    if (!isFocused('settings')) {
      setFocus('settings');
    }
  }, []);
}
```

The properties of the object returned from the hook are:

| Property                    | Type     | Description                                     |
| --------------------------- | -------- | ----------------------------------------------- |
| `isFocused( focusId )`      | function | Returns `true` if `focusId` is focused.         |
| `isFocusedExact( focusId )` | function | Returns `true` if `focusId` is exactly focused. |
| `setFocus( focusId )`       | function | Move focus to `focusId`.                        |

### `<Focusable />`

A [Component](https://reactjs.org/docs/react-component.html) that represents a focusable node in the focus tree.

All props are optional.

| Prop                     | Type     | Default value    | Description                                                                                                                               |
| ------------------------ | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `className`              | string   |                  | A class name to apply to this element.                                                                                                    |
| `focusedClass`           | string   | "isFocused"      | A class name that is applied when this element is focused.                                                                                |
| `focusedExactClass`      | string   | "isFocusedExact" | A class name that is applied this element is exactly focused.                                                                             |
| `disabledClass`          | string   | "focusDisabled"  | A class name that is applied this element is disabled.                                                                                    |
| `nodeType`               | string   | 'div'            | The element to render. For leaf nodes, you will likely want to use `"button"`.                                                            |
| `focusId`                | string   | `{unique_id}`    | A unique identifier for this node. Specify this yourself for debugging purposes, or when you will need to manually set focus to the node. |
| `focusOnMount`           | boolean  | `false`          | Whether or not to focus this node when the component mounts.                                                                              |
| `orientation`            | string   | 'horizontal'     | Whether the children of this node are arranged horizontally or vertically.                                                                |
| `wrapping`               | boolean  | 'false'          | Set to `true` for the navigation to wrap when the user reaches the start or end of the children list.                                     |
| `disabled`               | boolean  | 'false'          | This node will not receive focus when `true`.                                                                                             |
| `defaultChildFocusIndex` | number   | 0                | The index of the child to move focus to when this element receives focused. Only applies for nodes with children.                         |
| `onKey`                  | function |                  | A function that is called when the user presses any TV remote key while this element has focus.                                           |
| `onArrow`                | function |                  | A function that is called when the user presses a directional button.                                                                     |
| `onLeft`                 | function |                  | A function that is called when the user presses the left button.                                                                          |
| `onUp`                   | function |                  | A function that is called when the user presses the up button.                                                                            |
| `onDown`                 | function |                  | A function that is called when the user presses the down button.                                                                          |
| `onRight`                | function |                  | A function that is called when the user presses the right button.                                                                         |
| `onSelect`               | function |                  | A function that is called when the user pressed the select button.                                                                        |
| `onBack`                 | function |                  | A function that is called when the user presses the back button.                                                                          |
| `onMove`                 | function |                  | A function that is called when the focused child index of this node changes. Only called for nodes with children.                         |
| `...rest`                | any      |                  | All other props are applied to the underlying DOM node.                                                                                   |

```jsx
import { Focusable } from 'use-focus-path';

export default function Profile() {
  return (
    <Focusable
      nodeType="button"
      className="profileBtn"
      onSelect={({ node }) => {
        console.log('The user just selected this profile', node);
      }}>
      Profile
    </Focusable>
  );
}
```

## Prior Art

- ["Pass the Remote" on the Netflix Tech Blog](https://medium.com/netflix-techblog/pass-the-remote-user-input-on-tv-devices-923f6920c9a8)
- [bbc/lrud](https://github.com/bbc/lrud)
- [react-tv](https://github.com/raphamorim/react-tv)

## Limitations

- No support for pointer (mouse) inputs
- No spatial navigation
