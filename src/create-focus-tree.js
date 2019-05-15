import getIndex from './utils/get-index';
import findTargetNode from './utils/find-target-node';
import getUnfocusedNodes from './utils/reset-focused-nodes';
import getNodesFromFocusChange from './utils/get-nodes-from-focus-change';

const defaultNode = {
  isFocused: false,
  isFocusedExact: false,
  children: null,
};

export default function createFocusTree() {
  let currentState = {
    focusedNodeId: null,
    nodes: {},
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

  function createNode({
    nodeId,
    parentId,
    node,
    focusOnMount = false,
    wrapping,
    orientation,
    children,
    inputThrottle,
    onSelect,
  }) {
    let updatedParentNode;

    if (typeof parentId === 'string') {
      const parentNode = currentState.nodes[parentId] || defaultNode;
      const parentChildren = parentNode.children;

      let newChildren;
      if (Array.isArray(parentChildren)) {
        newChildren = parentChildren.concat(nodeId);
      } else {
        newChildren = [nodeId];
      }

      updatedParentNode = {
        id: parentId,
        children: newChildren,
        // If the child is focused, then the parent is as well. Note: the parent is not focused "exactly"
        // in these situations.
        isFocused: focusOnMount,
      };
    }

    const childrenNodes = {};
    if (Array.isArray(children)) {
      children.forEach(childId => {
        childrenNodes[childId] = {
          ...defaultNode,
          parentId: nodeId,
          id: childId,
        };
      });
    }

    const newNode = {
      ...node,
      parentId,
      id: nodeId,
      wrapping,
      orientation,
      inputThrottle,
      onSelect,
    };

    if (Array.isArray(children)) {
      newNode.children = children;
    }

    let otherNodes;
    let focusedNodeId;
    let focusHierarchy;
    if (focusOnMount) {
      const focusChange = getNodesFromFocusChange(currentState.nodes, nodeId);
      otherNodes = focusChange.nodes;
      focusedNodeId = focusChange.focusedNodeId;
      focusHierarchy = focusChange.focusHierarchy;
      otherNodes[nodeId] = {
        ...otherNodes[nodeId],
        ...newNode,
      };
    } else {
      otherNodes = {
        [nodeId]: newNode,
      };
    }

    const nodeChanges = {
      ...otherNodes,
      ...childrenNodes,
    };

    if (updatedParentNode) {
      nodeChanges[parentId] = updatedParentNode;
    }

    updateNodes(nodeChanges, {
      clearFocus: true,
      focusedNodeId,
      focusHierarchy,
    });
  }

  return {
    subscribe,
    getState,
    createNode,
    setFocus,
    handleRightArrow,
    handleLeftArrow,
    handleUpArrow,
    handleDownArrow,
  };
}
