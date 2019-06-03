import getUnfocusedNodes from './reset-focused-nodes';
import getNodesFromFocusChange from './get-nodes-from-focus-change';
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

  const updatedNodes = {};
  const currentNodes = getUnfocusedNodes(currentState.nodes);

  for (let nodeId in nodeUpdates) {
    const update = nodeUpdates[nodeId];
    const currentNode = currentNodes[nodeId];

    updatedNodes[nodeId] = {
      ...defaultNode,
      ...currentNode,
      ...update,
    };
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
