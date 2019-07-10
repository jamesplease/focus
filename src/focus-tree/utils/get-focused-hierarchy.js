import clamp from './clamp';

function getRecursiveParent(nodes, node) {
  let result = [];

  if (node.parentId) {
    const parentNode = nodes[node.parentId];

    result = [node.parentId].concat(getRecursiveParent(nodes, parentNode));
  }

  return result;
}

function getNodeAncestors(nodes, node = {}) {
  const result = getRecursiveParent(nodes, node);

  return result.reverse();
}

function isNodeDisabled(nodes, nodeId) {
  const node = nodes[nodeId];

  if (node && node.disabled) {
    return true;
  }

  return false;
}

function getChildren(nodes, node = {}, orientation, preferEnd) {
  const unfilteredChildren = node.children || [];

  const children = unfilteredChildren.filter(
    nodeId => !isNodeDisabled(nodes, nodeId)
  );

  let results = [];
  if (Array.isArray(children) && children.length) {
    const lastIndex = Math.max(0, children.length - 1);

    let activeChildId = children[0];

    if (
      node.restoreActiveChildIndex &&
      typeof node.previousActiveChildIndex === 'number' &&
      !isNodeDisabled(nodes, unfilteredChildren[node.previousActiveChildIndex])
    ) {
      activeChildId = unfilteredChildren[node.previousActiveChildIndex];
    } else if (
      typeof node.defaultChildFocusIndex === 'number' &&
      !isNodeDisabled(nodes, unfilteredChildren[node.defaultChildFocusIndex])
    ) {
      activeChildId = unfilteredChildren[node.defaultChildFocusIndex];
    } else if (orientation === node.orientation) {
      const index = preferEnd ? lastIndex : 0;
      activeChildId = children[index];
    }

    // const activeChildId = children[indexToUse];
    results = [activeChildId];

    if (typeof activeChildId === 'string') {
      const activeChild = nodes[activeChildId];
      results = results.concat(
        getChildren(nodes, activeChild, orientation, preferEnd)
      );
    }
  }

  return results;
}

export default function getFocusedHierarchy(
  nodes,
  nodeId,
  orientation,
  preferEnd
) {
  const node = nodes[nodeId] || {};

  if (typeof node.id !== 'string') {
    return [];
  }

  const ancestors = getNodeAncestors(nodes, node);
  const children = getChildren(nodes, node, orientation, preferEnd);

  return [...ancestors, nodeId, ...children];
}
