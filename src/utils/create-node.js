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
    parentId = defaultNode.parentId,
    wrapping = defaultNode.wrapping,
    orientation = defaultNode.orientation,
    children = defaultNode.children,
    onSelect = defaultNode.onSelect,
  } = {}
) {
  if (nodeId === 'root' || typeof nodeId !== 'string') {
    return currentState;
  }

  // We start off the new nodes by adding our new ID.
  // NOTE: if the node already exists, it is squashed.
  const newNodes = {
    ...currentState.nodes,
    [nodeId]: {
      ...defaultNode,
      id: nodeId,
      parentId: parentId,
      wrapping,
      orientation,
      children,
      onSelect,
    },
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
    newNodes[parentId] = {
      ...defaultNode,
      id: parentId,
      parentId: 'root',
      children: [nodeId],
    };

    const rootNode = currentState.nodes.root;
    const rootChildren = rootNode.children;

    const newRootChildren = Array.isArray(rootChildren)
      ? rootChildren.concat(parentId)
      : [parentId];

    newNodes.root = mergeTwoNodes(rootNode, {
      children: newRootChildren,
    });
  } else {
    const parentNode = currentState.nodes[parentId];
    const parentChildren = parentNode.children;

    const newParentChildren = Array.isArray(parentChildren)
      ? parentChildren.concat(nodeId)
      : [nodeId];

    newNodes[parentId] = mergeTwoNodes(parentNode, {
      children: newParentChildren,
    });
  }

  // The attached node is the first node in the hierarchy that
  // existed before this operation where we are attaching the new node.
  // It is either the root or an already-existing parent node.
  const attachedNodeId = parentExists ? parentId : 'root';
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
    newNodes,
    newFocusId
  );

  return {
    ...currentState,
    focusedNodeId,
    focusHierarchy,
    nodes: mergeTwoNodeLists(newNodes, nodes),
  };
}
