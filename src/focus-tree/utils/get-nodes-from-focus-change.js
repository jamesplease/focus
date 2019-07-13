import getFocusedHierarchy from './get-focused-hierarchy';
import defaultNode from './default-node';
import getFocusDiff from './get-focus-diff';

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

  const diff = getFocusDiff({
    focusHierarchy,
    prevFocusHierarchy: currentState.focusHierarchy
  })

  const updatedNodes = diff.blur.reduce((result, nodeId) => {
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
  }, {})

  const focusedNodeId = focusHierarchy[focusHierarchy.length - 1];

  diff.focus.forEach((nodeId, index) => {
    if (index === 0 && nodeId !== 'root') {
      const node = nodes[nodeId] || defaultNode;
      const parentId = node.parentId;
      const parentNode = nodes[parentId] || defaultNode;

      const children = parentNode.children;
      const focusedChildIndex = Array.isArray(children) ? children.indexOf(nodeId) : -1;

      updatedNodes[parentId] = {
        isFocused: true,
        isFocusedExact: false,
        previousFocusedChildIndex: parentNode.focusedChildIndex,
        focusedChildIndex
      };
    }

    const isLeaf = index === diff.focus.length - 1;
    const thisNode = nodes[nodeId] || defaultNode;

    let focusedChildIndex = null;
    if (!isLeaf) {
      const nextNodeId = diff.focus[index + 1];
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
  })

  return {
    nodes: updatedNodes,
    focusHierarchy,
    focusedNodeId,
  };
}
