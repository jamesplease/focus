import getFocusedHierarchy from './get-focused-hierarchy';
import defaultNode from './default-node';

// TODO: if `newFocusId` is a child, you must go up its tree
// to set focus to the parent
export default function getNodesFromFocusChange(
  nodes,
  newFocusId,
  orientation,
  preferEnd
) {
  const focusHierarchy = getFocusedHierarchy(
    nodes,
    newFocusId,
    orientation,
    preferEnd
  );

  let focusedNodeId;
  const updatedNodes = focusHierarchy.reduce((result, nodeId, index) => {
    const isLeaf = index === focusHierarchy.length - 1;

    if (isLeaf) {
      focusedNodeId = nodeId;
    }

    let activeChildIndex = null;
    if (!isLeaf) {
      const nextNodeId = focusHierarchy[index + 1];
      const thisNode = nodes[nodeId] || defaultNode;
      const children = thisNode.children;

      activeChildIndex = children.indexOf(nextNodeId);
    }

    result[nodeId] = {
      isFocused: true,
      isFocusedExact: isLeaf,
      activeChildIndex,
    };

    return result;
  }, {});

  return {
    nodes: updatedNodes,
    focusHierarchy,
    focusedNodeId,
  };
}
