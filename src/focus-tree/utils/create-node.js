import mergeTwoNodes from './merge-two-nodes';
import mergeTwoNodeLists from './merge-two-node-lists';
import getNodesFromFocusChange from './get-nodes-from-focus-change';

const defaultNode = {
  parentId: 'root',

  isFocused: false,
  isFocusedExact: false,

  children: null,
  focusedChildIndex: null,
  restoreFocusedChildIndex: false,

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

const fnOpts = [
  'onBlur',
  'onFocus',
  'onKey',
  'onArrow',
  'onLeft',
  'onRight',
  'onUp',
  'onDown',
  'onSelect',
  'onBack',
  'onMove',
];

// Create a new node.
// Returns the new state.
export default function createNode(currentState, nodeId, opts = {}) {
  const {
    focusOnMount = false,
    parentId = 'root',
    elRef,
    wrapping,
    orientation,
    defaultChildFocusIndex,
    restoreFocusedChildIndex,

    disabled,
  } = opts;

  const existingNode = currentState.nodes[nodeId];
  const mergedNode = {
    ...defaultNode,
    ...existingNode,
    elRef,
    id: nodeId,
    parentId,
  };

  for (let fnIndex = 0; fnIndex < fnOpts.length; fnIndex++) {
    const fnName = fnOpts[fnIndex];
    if (typeof opts[fnName] === 'function') {
      mergedNode[fnName] = opts[fnName];
    }
  }

  if (typeof wrapping !== 'undefined') {
    mergedNode.wrapping = Boolean(wrapping);
  }

  if (typeof orientation !== 'undefined') {
    mergedNode.orientation = orientation;
  }

  if (typeof defaultChildFocusIndex === 'number') {
    mergedNode.defaultChildFocusIndex = defaultChildFocusIndex;
  }

  if (typeof restoreFocusedChildIndex !== 'undefined') {
    mergedNode.restoreFocusedChildIndex = Boolean(restoreFocusedChildIndex);
  }

  if (typeof disabled !== 'undefined') {
    mergedNode.disabled = Boolean(disabled);
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
