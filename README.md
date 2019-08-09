# Focus

[![Travis build status](http://img.shields.io/travis/jamesplease/focus.svg?style=flat)](https://travis-ci.org/jamesplease/focus)
[![npm version](https://img.shields.io/npm/v/@xdproto/focus.svg)](https://www.npmjs.com/package/@xdproto/focus)

A [React](https://reactjs.org/) library for managing focus in TV apps.

✓ Controls LRUD navigation for you – automatically  
✓ Hooks-first declarative API

## Motivation

Users of TV apps most often use LRUD controls to navigate within the app. Consequently, the focused element on the page
is of particular importance.

It is not always the case that your runtime environment includes a built-in system for managing focus.
Environments that _do_ include such a system, like the browser, often have a simple
focus system that doesn't align with the complex needs of LRUD environments.

Because of this, it is up to the application to manage its own focus state. This library helps you to do that.

## Installation

Install using [npm](https://www.npmjs.com):

```
npm install @xdproto/focus
```

or [yarn](https://yarnpkg.com/):

```
yarn add @xdproto/focus
```

This library has the following peer dependencies:

- [`react@^16.8.0`](https://www.npmjs.com/package/react)

## Table of Contents

- [**Guides**](#guides)
  - [Getting started](#getting-started)
  - [FAQ](#faq)
- [**API**](#api)
  - [\<FocusRoot/\>](#focusroot-)
  - [\<FocusNode/\>](#FocusNode-)
  - [useIsFocused()](#useisfocused-focusid-options-)
  - [useFocusTree()](#usefocustree)
  - [useFocusHierarchy()](#usefocushierarchy)
- [**Prior Art**](#prior-art)
- [**Limitations**](#limitations)

## Guides

### Getting Started

Render the `FocusRoot` somewhere high up in your application's component tree. This is the root node of the focus tree.

```jsx
import { FocusRoot } from '@xdproto/focus';

export default function App() {
  return (
    <FocusRoot>
      <AppContents />
    </FocusRoot>
  );
}
```

Next, use the FocusNode component to create a focusable node on the page.

```jsx
import { FocusNode } from '@xdproto/focus';

export default function Profile() {
  return <FocusNode className="profile">Profile</FocusNode>;
}
```

This library manages moving focus between the FocusNode nodes as the user inputs
LRUD commands.

Configuring this behavior is managed entirely through props of the FocusNode components. To
learn more about those props, refer to the API documentation below.

### FAQ

#### What is LRUD?

LRUD is an acronym that stands for left-right-up-down, and it refers to the directional buttons typically found on remotes. In LRUD systems,
input devices usually also have some kind of "submit" button, and, less commonly, a back button.

#### Is this library right for me?

The [limitations](#limitations) described below may help you to determine that.

## API

This library has three named exports: `FocusRoot`, `FocusNode`, and `useFocus`.

### `<FocusRoot />`

Serves as the root node of a new focus hierarchy.

All props are optional.

| Prop          | Type    | Default value | Description                                                                                             |
| ------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `orientation` | string  | 'horizontal'  | Whether the children of the root node are arranged horizontally or vertically.                          |
| `wrapping`    | boolean | 'false'       | Set to `true` for the navigation to wrap when the user reaches the start or end of the root's children. |

```jsx
import { FocusRoot } from '@xdproto/focus';

export default function App() {
  return (
    <FocusRoot orientation="vertical">
      <AppContents />
    </FocusRoot>
  );
}
```

### `<FocusNode />`

A [Component](https://reactjs.org/docs/react-component.html) that represents a FocusNode node in the focus tree.

All props are optional.

| Prop                     | Type                | Default value    | Description                                                                                                                               |
| ------------------------ | ------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `propsFromNode`          | function            |                  | A function you can supply to compute additional props to apply to the element. The function is passed one argument: the focus node.       |
| `className`              | string              |                  | A class name to apply to this element.                                                                                                    |
| `focusedClass`           | string              | "isFocused"      | A class name that is applied when this element is focused.                                                                                |
| `focusedExactClass`      | string              | "isFocusedExact" | A class name that is applied this element is exactly focused.                                                                             |
| `disabledClass`          | string              | "focusDisabled"  | A class name that is applied this element is disabled.                                                                                    |
| `elementType`            | string\|elementType | 'div'            | The React element type to render. For instance, `"img"` or [`motion.div`](https://www.framer.com/api/motion/component/).                  |
| `focusId`                | string              | `{unique_id}`    | A unique identifier for this node. Specify this yourself for debugging purposes, or when you will need to manually set focus to the node. |
| `focusOnMount`           | boolean             | `false`          | Whether or not to focus this node when the component mounts.                                                                              |
| `orientation`            | string              | 'horizontal'     | Whether the children of this node are arranged horizontally or vertically.                                                                |
| `wrapping`               | boolean             | 'false'          | Set to `true` for the navigation to wrap when the user reaches the start or end of the children list.                                     |
| `disabled`               | boolean             | 'false'          | This node will not receive focus when `true`.                                                                                             |
| `defaultChildFocusIndex` | number              | 0                | The index of the child to move focus to when this element receives focused. Only applies for nodes with children.                         |
| `onFocus`                | function            |                  | A function that is called when the node receives focus.                                                                                   |
| `onBlur`                 | function            |                  | A function that is called when the node loses focus.                                                                                      |
| `onKey`                  | function            |                  | A function that is called when the user presses any TV remote key while this element has focus.                                           |
| `onArrow`                | function            |                  | A function that is called when the user presses a directional button.                                                                     |
| `onLeft`                 | function            |                  | A function that is called when the user presses the left button.                                                                          |
| `onUp`                   | function            |                  | A function that is called when the user presses the up button.                                                                            |
| `onDown`                 | function            |                  | A function that is called when the user presses the down button.                                                                          |
| `onRight`                | function            |                  | A function that is called when the user presses the right button.                                                                         |
| `onSelect`               | function            |                  | A function that is called when the user pressed the select button.                                                                        |
| `onBack`                 | function            |                  | A function that is called when the user presses the back button.                                                                          |
| `onMove`                 | function            |                  | A function that is called when the focused child index of this node changes. Only called for nodes with children.                         |
| `...rest`                | any                 |                  | All other props are applied to the underlying DOM node.                                                                                   |

```jsx
import { FocusNode } from '@xdproto/focus';

export default function Profile() {
  return (
    <FocusNode
      elementType="button"
      className="profileBtn"
      onSelect={({ node }) => {
        console.log('The user just selected this profile', node);
      }}>
      Profile
    </FocusNode>
  );
}
```

### `useFocusTree()`

A [Hook](https://reactjs.org/docs/hooks-intro.html) that returns the
focus tree object.

```js
import { useFocusTree } from '@xdproto/focus';

export default function MyComponent() {
  const focusTree = useFocusTree();

  useEffect(() => {
    console.log('the current state', focusTree.getState());

    focusTree.setFocus('my-node');
  }, []);
}
```

### `useIsFocused( focusId, [options] )`

A [Hook](https://reactjs.org/docs/hooks-intro.html) that returns a boolean representing whether or not the node
with an ID of `focusId` is focused.

```js
import { useIsFocused } from '@xdproto/focus';

export default function MyComponent() {
  const buttonIsFocused = useIsFocused('button');
  const buttonIsExactlyFocused = useIsFocused('button', { exact: true });
}
```

The properties of the object returned from the hook are:

| Property                    | Type     | Description                                     |
| --------------------------- | -------- | ----------------------------------------------- |
| `isFocused( focusId )`      | function | Returns `true` if `focusId` is focused.         |
| `isFocusedExact( focusId )` | function | Returns `true` if `focusId` is exactly focused. |
| `setFocus( focusId )`       | function | Move focus to `focusId`.                        |

### `useFocusHierarchy()`

A [Hook](https://reactjs.org/docs/hooks-intro.html) that returns an array representing the focus hierarchy, which are the
nodes that are focused in the node tree. Each entry in the array is a focus node. The last node in the hierarchy is the node
that is exactly focused.

```js
import { useFocusHierarchy } from '@xdproto/focus';

export default function MyComponent() {
  const focusHierarchy = useFocusHierarchy('button');
  console.log(focusHierarchy);
  // => [
  //   { nodeId: 'root', ... },
  //   { nodeId: 'homePage', ... },
  //   { nodeId: 'mainNav', ... },
  // ]
}
```

## Prior Art

- ["Pass the Remote" on the Netflix Tech Blog](https://medium.com/netflix-techblog/pass-the-remote-user-input-on-tv-devices-923f6920c9a8)
- [bbc/lrud](https://github.com/bbc/lrud)
- [react-tv](https://github.com/raphamorim/react-tv)

## Limitations

- No support for pointer (mouse) inputs
- No spatial navigation
