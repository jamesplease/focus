import mergeTwoNodes from './merge-two-nodes';
import mergeTwoNodeLists from './merge-two-node-lists';
import getNodesFromFocusChange from './get-nodes-from-focus-change';

const defaultNode = {
  parentId: 'root',

  isFocused: false,
  isFocusedExact: false,

  children: null,
  activeChildIndex: null,

  wrapping: false,
  onSelect: null,
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
    children,
    onSelect,
  } = {}
) {
  if (nodeId === 'root' || typeof nodeId !== 'string') {
    return currentState;
  }

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

  if (typeof children !== 'undefined') {
    mergedNode.children = children;
  }

  if (typeof onSelect !== 'undefined') {
    mergedNode.onSelect = onSelect;
  }

  // We start off the new nodes by adding our new ID.
  // NOTE: if the node already exists, it is squashed.
  const newNodes = {
    ...currentState.nodes,
    [nodeId]: mergedNode,
  };

  if (Array.isArray(children)) {
    children.forEach(childId => {
      newNodes[childId] = {
        ...defaultNode,
        id: childId,
        parentId: nodeId,
      };
    });
  }

  const parentExists = Boolean(currentState.nodes[parentId]);

  if (!parentExists) {
    // TODO: warn here
    console.warn('ERROR!');
    return currentState;
  }

  const parentNode = currentState.nodes[parentId];
  const parentChildren = parentNode.children;

  const newParentChildren = Array.isArray(parentChildren)
    ? parentChildren.concat(nodeId)
    : [nodeId];

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
