import handleArrowUtil from './utils/handle-arrow';
import createNodeUtil from './utils/create-node';
import destroyNodeUtil from './utils/destroy-node';
import setFocusUtil from './utils/set-focus';
import emitEvents from './utils/emit-events';

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
    });

    const oldState = currentState;
    currentState = newState;

    emitEvents({
      currentState: oldState,
      nextState: newState,
    });

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

    emitEvents({
      currentState,
      nextState: newState,
    });

    currentState = newState;
    onUpdate();
  }

  // Silently updates a node. This generally doesn't require a rerender as this only
  // affects changes to the node, and not the focus tree.
  // The exception is when the node is focused, in which case a new focus state is calculated.
  function updateNode(nodeId, opts, silent) {
    const currentNode = currentState.nodes[nodeId];

    let wasFocused = currentNode.isFocused;

    const newNode = {
      ...currentNode,
      ...opts,
    };

    const newState = {
      ...currentState,
      nodes: {
        ...currentState.nodes,
        [nodeId]: newNode,
      },
    };

    if (!wasFocused || silent) {
      currentState = newState;
    } else {
      // Recompute the focus using the parent
      const parentId = newNode.parentId;
      const parentNode = newState.nodes[parentId];

      const nextState = setFocusUtil({
        currentState: newState,
        nodeId: parentId,
        orientation: parentNode.orientation,
        preferEnd: false,
      });

      emitEvents({
        currentState,
        nextState: newState,
      });

      currentState = nextState;
      onUpdate();
    }
  }

  function destroyNode(nodeId) {
    const newState = destroyNodeUtil(currentState, nodeId);

    emitEvents({
      currentState,
      nextState: newState,
    });

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
