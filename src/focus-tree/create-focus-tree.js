import getIndex from './utils/get-index';
import findTargetNode from './utils/find-target-node';
import getUnfocusedNodes from './utils/reset-focused-nodes';
import getNodesFromFocusChange from './utils/get-nodes-from-focus-change';
import defaultNode from './utils/default-node';
import createNodeUtil from './utils/create-node';
import destroyNodeUtil from './utils/destroy-node';

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

  function updateNodes(
    nodeUpdates,
    { clearFocus = false, focusedNodeId, focusHierarchy }
  ) {
    const updatedNodes = {};

    const currentNodes = clearFocus
      ? getUnfocusedNodes(currentState.nodes)
      : currentState.nodes;

    for (let nodeId in nodeUpdates) {
      const update = nodeUpdates[nodeId];
      const currentNode = currentNodes[nodeId];

      updatedNodes[nodeId] = {
        ...defaultNode,
        ...currentNode,
        ...update,
      };
    }

    let newState = {
      ...currentState,
      nodes: {
        ...currentNodes,
        ...updatedNodes,
      },
    };

    if (typeof focusedNodeId === 'string') {
      newState.focusedNodeId = focusedNodeId;
    }

    if (Array.isArray(focusHierarchy)) {
      newState.focusHierarchy = focusHierarchy;
    }

    currentState = newState;
    onUpdate();
  }

  function setFocus(nodeId, orientation, preferEnd) {
    const { nodes, focusHierarchy, focusedNodeId } = getNodesFromFocusChange(
      currentState,
      nodeId,
      orientation,
      preferEnd
    );

    updateNodes(nodes, {
      clearFocus: true,
      focusHierarchy,
      focusedNodeId,
    });
  }

  function handleArrow(arrow) {
    const orientation =
      arrow === 'right' || arrow === 'left' ? 'horizontal' : 'vertical';
    const direction =
      arrow === 'down' || arrow === 'right' ? 'forward' : 'backward';

    const focusedNode = currentState.nodes[currentState.focusedNodeId];

    const targetNode = findTargetNode(
      currentState.nodes,
      focusedNode,
      orientation,
      direction
    );

    if (targetNode) {
      const parentId = targetNode.parentId;
      let parentNode = {};
      if (typeof parentId === 'string') {
        parentNode = currentState.nodes[parentId];
      }

      const distance = direction === 'forward' ? 1 : -1;
      const wrapping = parentNode.wrapping;
      const preferEnd = direction === 'forward' ? false : true;

      const targetNodeId = targetNode.id;
      const parentsChildren = parentNode.children || [];
      const index = parentsChildren.indexOf(targetNodeId);

      const newIndex = getIndex(
        parentsChildren.length,
        index + distance,
        wrapping
      );

      const newFocusedId = parentsChildren[newIndex];

      const newFocusedNode = currentState.nodes[newFocusedId];

      // Disabled nodes cannot receive focus
      // TODO: skip over the disabled node and find the first one node
      // that is not disabled.
      // NOTE: currently not actually in use
      if (newFocusedNode.disabled) {
        return;
      }

      const currentActiveIndex = parentNode.activeChildIndex;
      const currentActiveNodeId = parentNode.children[currentActiveIndex];
      const currentActiveNode = currentState.nodes[currentActiveNodeId];

      setFocus(newFocusedId, orientation, preferEnd);

      const newActiveIndex = currentState.nodes[parentId].activeChildIndex;
      const newActiveNodeId =
        currentState.nodes[parentId].children[newActiveIndex];
      const newActiveNode = currentState.nodes[newActiveNodeId];

      if (typeof parentNode.onMove === 'function') {
        parentNode.onMove({
          orientation,
          direction,
          arrow,
          node: parentNode,
          prevChildIndex: parentNode.activeChildIndex,
          nextChildIndex: newActiveIndex,
          prevChildNode: currentActiveNode,
          nextChildNode: newActiveNode,
        });
      }
    }
  }

  function createNode(nodeId, opts) {
    const newState = createNodeUtil(currentState, nodeId, opts);
    currentState = newState;
    onUpdate();
  }

  // Silently updates a node. Doesn't require a rerender as this only
  // affects changes to the node.
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
