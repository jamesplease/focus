import getIndex from './utils/get-index';
import findTargetNode from './utils/find-target-node';
import getUnfocusedNodes from './utils/reset-focused-nodes';
import getNodesFromFocusChange from './utils/get-nodes-from-focus-change';
import defaultNode from './utils/default-node';
import mergeTwoNodes from './utils/merge-two-nodes';
import mergeTwoNodeLists from './utils/merge-two-node-lists';

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

  function createNode(
    nodeId,
    {
      parentId = 'root',
      node,
      focusOnMount = false,
      wrapping = false,
      orientation = 'horizontal',
      children = null,
      onSelect = null,
    } = {}
  ) {
    // TODO: warn
    if (nodeId === 'root') {
      return;
    }

    let updatedParentNode;

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
      ...defaultNode,
      ...node,
      parentId,
      id: nodeId,
      wrapping,
      orientation,
      onSelect,
    };

    if (Array.isArray(children)) {
      newNode.children = children;
    }

    const nextNodes = {
      ...currentState.nodes,
      [parentId]: {
        parentId: 'root',
        ...currentState.nodes[parentId],
        ...updatedParentNode,
      },
      [nodeId]: newNode,
    };

    let otherNodes;
    let focusedNodeId;
    let focusHierarchy;

    const parentExists = Boolean(currentState.nodes[parentId]);
    const attachedNodeId = parentExists ? parentId : 'root';
    const attachedNode =
      currentState.nodes[parentId] || currentState.nodes.root;

    const updatedRoot = {
      ...currentState.nodes.root,
    };

    if (!parentExists) {
      let newRootChildren;
      if (Array.isArray(updatedRoot.children)) {
        newRootChildren = updatedRoot.children.concat(parentId);
      } else {
        newRootChildren = [parentId];
      }

      updatedRoot.children = newRootChildren;
    }

    nextNodes.root = updatedRoot;

    if (focusOnMount || attachedNode.isFocusedExact) {
      const focusId =
        focusOnMount || attachedNode.isFocusedExact
          ? nodeId
          : currentState.focusedNodeId;

      const focusChange = getNodesFromFocusChange(nextNodes, focusId);
      otherNodes = focusChange.nodes;

      focusedNodeId = focusChange.focusedNodeId;
      focusHierarchy = focusChange.focusHierarchy;
      otherNodes[nodeId] = {
        ...newNode,
        ...otherNodes[nodeId],
      };

      updatedParentNode = {
        parentId: 'root',
        ...currentState.nodes[parentId],
        ...updatedParentNode,
        ...otherNodes[parentId],
      };
    } else {
      otherNodes = {
        [nodeId]: newNode,
      };
    }

    otherNodes.root = {
      ...mergeTwoNodes(currentState.nodes.root, updatedRoot),
      ...otherNodes.root,
    };

    const nodeChanges = mergeTwoNodeLists(childrenNodes, otherNodes);

    if (updatedParentNode) {
      nodeChanges[parentId] = updatedParentNode;
    }

    updateNodes(nodeChanges, {
      clearFocus: true,
      focusedNodeId,
      focusHierarchy,
    });
  }

  function destroyNode() {}

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
