import handleArrowUtil from './utils/handle-arrow';
import createNodeUtil from './utils/create-node';
import destroyNodeUtil from './utils/destroy-node';
import setFocusUtil from './utils/set-focus';

export default function createFocusTree({
  orientation = 'horizontal',
  wrapping = false,
} = {}) {
  let currentState = {
    focusedNodeId: 'root',
    focusHierarchy: ['root'],
    nodes: {
      root: {
        id: 'root',
        parentId: null,
        isFocused: true,
        isFocusedExact: true,
        orientation,
        wrapping,
      },
    },
  };

  let listeners = [];
  function subscribe(listener) {
    listeners.push(listener);
    let subscribed = true;

    return function unsubscribe() {
      if (!subscribed) {
        return;
      }

      subscribed = false;

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function onUpdate() {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function getState() {
    return currentState;
  }

  function setFocus(nodeId, orientation, preferEnd) {
    const newState = setFocusUtil({
      currentState,
      nodeId,
      orientation,
      preferEnd,
      clearFocus: true,
    });

    currentState = newState;
    onUpdate();
  }

  function handleArrow(arrow) {
    handleArrowUtil({
      arrow,
      currentState,
      setFocus,
    });
  }

  function createNode(nodeId, opts) {
    const newState = createNodeUtil(currentState, nodeId, opts);
    currentState = newState;

    onUpdate();
  }

  // Silently updates a node. This generally doesn't require a rerender as this only
  // affects changes to the node, and not the focus tree.
  // Exceptions are when `disabled` is changed, but atm dynamic disabling isn't supported.
  function updateNode(nodeId, opts) {
    const currentNode = currentState.nodes[nodeId];

    const newState = {
      ...currentState,
      nodes: {
        ...currentState.nodes,
        [nodeId]: {
          ...currentNode,
          ...opts,
        },
      },
    };

    currentState = newState;
  }

  function destroyNode(nodeId) {
    const newState = destroyNodeUtil(currentState, nodeId);
    currentState = newState;
    onUpdate();
  }

  return {
    subscribe,
    getState,
    createNode,
    updateNode,
    destroyNode,
    setFocus,
    handleArrow,
  };
}
