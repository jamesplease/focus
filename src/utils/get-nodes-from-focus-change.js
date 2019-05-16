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
        activeChildIndex: null,
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

    let activeChildIndex = null;
    if (!isLeaf) {
      const nextNodeId = focusHierarchy[index + 1];
      const thisNode = nodes[nodeId] || defaultNode;
      const children = thisNode.children;

      activeChildIndex = Array.isArray(children)
        ? children.indexOf(nextNodeId)
        : -1;
    }

    updatedNodes[nodeId] = {
      isFocused: true,
      isFocusedExact: isLeaf,
      activeChildIndex,
    };
  });

  return {
    nodes: updatedNodes,
    focusHierarchy,
    focusedNodeId,
  };
}
