import getIndex from './utils/get-index';
import findTargetNode from './utils/find-target-node';
import getUnfocusedNodes from './utils/reset-focused-nodes';
import getNodesFromFocusChange from './utils/get-nodes-from-focus-change';
import defaultNode from './utils/default-node';
import mergeTwoNodes from './utils/merge-two-nodes';
import mergeTwoNodeLists from './utils/merge-two-node-lists';
import createNodeUtil from './utils/create-node';
import destroyNodeUtil from './utils/destroy-node';

export default function createFocusTree({
  rootOrientation = 'horizontal',
  rootWrapping = false,
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
        orientation: rootOrientation,
        wrapping: rootWrapping,
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
      currentState.nodes,
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
      setFocus(newFocusedId, orientation, preferEnd);
    }
  }

  function handleRightArrow() {
    handleArrow('right');
  }

  function handleLeftArrow() {
    handleArrow('left');
  }

  function handleUpArrow() {
    handleArrow('up');
  }

  function handleDownArrow() {
    handleArrow('down');
  }

  function createNode(nodeId, opts) {
    console.log('wot', nodeId, opts);
    const newState = createNodeUtil(currentState, nodeId, opts);
    currentState = newState;
    onUpdate();
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
    destroyNode,
    setFocus,
    handleRightArrow,
    handleLeftArrow,
    handleUpArrow,
    handleDownArrow,
  };
}
