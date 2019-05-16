import mergeTwoNodes from './merge-two-nodes';
import mergeTwoNodeLists from './merge-two-node-lists';
import getNodesFromFocusChange from './get-nodes-from-focus-change';
import getNearestNode from './get-nearest-node';

export default function destroyNode(currentState, nodeId) {
  // If this is an invalid request, then we do nothing
  if (nodeId === 'root' || typeof nodeId !== 'string') {
    return currentState;
  }

  // If the node does not exist, then we do nothing
  const currentNode = currentState.nodes[nodeId];
  if (!currentNode) {
    return currentState;
  }

  // We only need to completely refocus when this is exactly focused.
  // When it is merely `isFocused`, we can just update the focusHierarchy.
  const recomputeFocus = currentNode.isFocusedExact;

  // Clone our nodes, then delete this one right off the bat.
  const newNodes = {
    ...currentState.nodes,
  };
  delete newNodes[nodeId];

  // Next, we need to adjust the parent's children.
  const parentId = currentNode.parentId;
  const parentNode = currentState.nodes[parentId];
  const parentChildren = parentNode.children;

  const ownChildren = Array.isArray(currentNode.children)
    ? currentNode.children
    : [];

  let newParentChildren;
  if (parentChildren.length === 1) {
    newParentChildren = null;
  } else {
    const nodeIndexInChildren = parentChildren.indexOf(nodeId);
    newParentChildren = [...parentChildren];
    newParentChildren.splice(nodeIndexInChildren, 1, ...ownChildren);
  }

  newNodes[parentId] = mergeTwoNodes(parentNode, {
    children: newParentChildren,
  });

  if (!recomputeFocus) {
    const focusHierarchy = currentNode.isFocused
      ? currentState.focusHierarchy.filter(id => id !== nodeId)
      : currentState.focusHierarchy;

    return {
      ...currentState,
      focusHierarchy,
      nodes: newNodes,
    };
  }

  const newFocusId = getNearestNode(currentState.nodes, nodeId);
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
