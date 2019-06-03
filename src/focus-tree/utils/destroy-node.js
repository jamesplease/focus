import mergeTwoNodes from './merge-two-nodes';
import mergeTwoNodeLists from './merge-two-node-lists';
import getNodesFromFocusChange from './get-nodes-from-focus-change';
import getNearestNode from './get-nearest-node';

function recursivelyDeleteChildren(nodes, children) {
  children.forEach(childId => {
    const childChildren = nodes[childId] ? nodes[childId].children : null;

    delete nodes[childId];

    if (Array.isArray(childChildren)) {
      recursivelyDeleteChildren(nodes, childChildren);
    }
  });
}

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
  const recomputeFocus = currentNode.isFocused;

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

  recursivelyDeleteChildren(newNodes, ownChildren);

  let newParentChildren;
  if (parentChildren.length === 1) {
    newParentChildren = null;
  } else {
    newParentChildren = parentChildren.filter(id => id !== nodeId);
  }

  if (!recomputeFocus) {
    newNodes[parentId] = mergeTwoNodes(parentNode, {
      children: newParentChildren,
    });

    return {
      ...currentState,
      nodes: newNodes,
    };
  }

  newNodes[parentId] = mergeTwoNodes(parentNode, {
    children: newParentChildren,
  });

  const newFocusId = getNearestNode(currentState.nodes, nodeId);

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
