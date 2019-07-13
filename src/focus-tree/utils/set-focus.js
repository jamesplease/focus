import getNodesFromFocusChange from './get-nodes-from-focus-change';
import getFocusDiff from './get-focus-diff';
import defaultNode from './default-node';

export default function setFocus({
  currentState,
  nodeId,
  orientation,
  preferEnd,
}) {
  const {
    nodes: nodeUpdates,
    focusHierarchy,
    focusedNodeId,
  } = getNodesFromFocusChange(currentState, nodeId, orientation, preferEnd);

  const diff = getFocusDiff({
    focusHierarchy,
    prevFocusHierarchy: currentState.focusHierarchy
  });

  const updatedNodes = {};
  const currentNodes = currentState.nodes;

  for (let nodeId in nodeUpdates) {
    const update = nodeUpdates[nodeId];
    const currentNode = currentNodes[nodeId];

    updatedNodes[nodeId] = {
      ...defaultNode,
      ...currentNode,
      ...update,
    };
  }

  const blurredNode = {
    isFocused: false,
    isFocusedExact: false
  };

  for(let nodeId in diff.blur) {
    const currentNode = currentNodes[nodeId];
    updatedNodes[nodeId] = {
      ...defaultNode,
      ...currentNode,
      ...blurredNode
    }
  }

  let newState = {
    ...currentState,
    nodes: {
      ...currentNodes,
      ...updatedNodes,
    },
  };

  if (typeof focusedNodeId === 'string') {
    newState.focusedNodeId = focusedNodeId;
  }

  if (Array.isArray(focusHierarchy)) {
    newState.focusHierarchy = focusHierarchy;
  }

  return newState;
}
