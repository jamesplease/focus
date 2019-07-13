import getFocusedHierarchy from './get-focused-hierarchy';
import defaultNode from './default-node';

// TODO: if `newFocusId` is a child, you must go up its tree
// to set focus to the parent
export default function getNodesFromFocusChange(
  currentState,
  newFocusId,
  orientation,
  preferEnd
) {
  const nodes = currentState.nodes;

  const focusHierarchy = getFocusedHierarchy(
    nodes,
    newFocusId,
    orientation,
    preferEnd
  );

  const updatedNodes = currentState.focusHierarchy.reduce((result, nodeId) => {
    // We only reset the focus state if the node still exists.
    // Otherwise, it may have been deleted.
    if (currentState.nodes[nodeId]) {
      result[nodeId] = {
        isFocused: false,
        isFocusedExact: false,
        previousFocusedChildIndex: nodes[nodeId].focusedChildIndex,
        focusedChildIndex: null,
      };
    }

    return result;
  }, {});

  let focusedNodeId;
  focusHierarchy.forEach((nodeId, index) => {
    const isLeaf = index === focusHierarchy.length - 1;

    if (isLeaf) {
      focusedNodeId = nodeId;
    }

    let focusedChildIndex = null;
    const thisNode = nodes[nodeId] || defaultNode;
    if (!isLeaf) {
      const nextNodeId = focusHierarchy[index + 1];
      const children = thisNode.children;

      focusedChildIndex = Array.isArray(children)
        ? children.indexOf(nextNodeId)
        : -1;
    }

    updatedNodes[nodeId] = {
      isFocused: true,
      isFocusedExact: isLeaf,
      previousFocusedChildIndex: thisNode.focusedChildIndex,
      focusedChildIndex,
    };
  });

  return {
    nodes: updatedNodes,
    focusHierarchy,
    focusedNodeId,
  };
}
