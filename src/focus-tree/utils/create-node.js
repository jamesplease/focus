import mergeTwoNodes from './merge-two-nodes';
import mergeTwoNodeLists from './merge-two-node-lists';
import getNodesFromFocusChange from './get-nodes-from-focus-change';

const defaultNode = {
  parentId: 'root',

  isFocused: false,
  isFocusedExact: false,

  children: null,
  activeChildIndex: null,
  restoreActiveChildIndex: false,

  disabled: false,

  wrapping: false,
  onSelect: null,
  onBlur: null,
  onFocus: null,
  onKey: null,
  onMove: null,
  onLeft: null,
  onUp: null,
  onRight: null,
  onArrow: null,
  onDown: null,
  orientation: 'horizontal',
};

// Create a new node.
// Returns the new state.
export default function createNode(
  currentState,
  nodeId,
  {
    focusOnMount = false,
    parentId = 'root',
    wrapping,
    orientation,
    defaultChildFocusIndex,
    restoreActiveChildIndex,

    disabled,

    onBlur,
    onFocus,
    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelect,
    onBack,

    onMove,
  } = {}
) {
  const existingNode = currentState.nodes[nodeId];
  const mergedNode = {
    ...defaultNode,
    ...existingNode,
    id: nodeId,
    parentId,
  };

  if (typeof wrapping !== 'undefined') {
    mergedNode.wrapping = wrapping;
  }

  if (typeof orientation !== 'undefined') {
    mergedNode.orientation = orientation;
  }

  if (typeof onSelect !== 'undefined') {
    mergedNode.onSelect = onSelect;
  }

  if (typeof onKey !== 'undefined') {
    mergedNode.onKey = onKey;
  }

  if (typeof onArrow !== 'undefined') {
    mergedNode.onArrow = onArrow;
  }

  if (typeof onUp !== 'undefined') {
    mergedNode.onUp = onUp;
  }

  if (typeof onDown !== 'undefined') {
    mergedNode.onDown = onDown;
  }

  if (typeof onRight !== 'undefined') {
    mergedNode.onRight = onRight;
  }

  if (typeof onLeft !== 'undefined') {
    mergedNode.onLeft = onLeft;
  }

  if (typeof onMove !== 'undefined') {
    mergedNode.onMove = onMove;
  }

  if (typeof onBack !== 'undefined') {
    mergedNode.onBack = onBack;
  }

  if (typeof onFocus !== 'undefined') {
    mergedNode.onFocus = onFocus;
  }

  if (typeof onBlur !== 'undefined') {
    mergedNode.onBlur = onBlur;
  }

  if (typeof defaultChildFocusIndex === 'number') {
    mergedNode.defaultChildFocusIndex = defaultChildFocusIndex;
  }

  if (typeof restoreActiveChildIndex === 'boolean') {
    mergedNode.restoreActiveChildIndex = restoreActiveChildIndex;
  }

  if (typeof disabled === 'boolean') {
    mergedNode.disabled = disabled;
  }

  // We start off the new nodes by adding our new ID.
  // NOTE: if the node already exists, it is squashed.
  const newNodes = {
    ...currentState.nodes,
    [nodeId]: mergedNode,
  };

  const parentExists = Boolean(currentState.nodes[parentId]);

  if (!parentExists) {
    // TODO: warn here
    // eslint-disable-next-line no-console
    console.warn('ERROR!');
    return currentState;
  }

  const parentNode = currentState.nodes[parentId];
  const parentChildren = parentNode.children;

  let newParentChildren;

  // if (disabled) {
  //   newParentChildren = parentChildren;
  // } else {
  newParentChildren = Array.isArray(parentChildren)
    ? parentChildren.concat(nodeId)
    : [nodeId];
  // }

  newNodes[parentId] = mergeTwoNodes(parentNode, {
    children: newParentChildren,
  });

  // The attached node is the first node in the hierarchy that
  // existed before this operation where we are attaching the new node.
  // It is either the root or an already-existing parent node.
  const attachedNodeId = parentId;
  // const attachedNodeIsParent = attachedNodeId === parentId;
  const attachedNode = currentState.nodes[attachedNodeId];

  // Whether or not the focus hierarchy will be affected by this operation
  const recomputeFocus = focusOnMount || attachedNode.isFocusedExact;

  // If we don't need to recompute the focus, then there is nothing else to do.
  if (!recomputeFocus) {
    return {
      ...currentState,
      nodes: newNodes,
    };
  }

  const newFocusId = focusOnMount ? nodeId : attachedNodeId;
  const { nodes, focusedNodeId, focusHierarchy } = getNodesFromFocusChange(
    {
      ...currentState,
      nodes: newNodes,
    },
    newFocusId
  );

  return {
    ...currentState,
    focusedNodeId,
    focusHierarchy,
    nodes: mergeTwoNodeLists(newNodes, nodes),
  };
}
