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

function getChildren(nodes, node = {}, orientation, preferEnd) {
  const unfilteredChildren = node.children || [];

  const children = unfilteredChildren.filter(nodeId => {
    const node = nodes[nodeId];

    if (node && node.disabled) {
      return false;
    }

    return true;
  });

  let results = [];
  if (Array.isArray(children) && children.length) {
    const lastIndex = Math.max(0, children.length - 1);

    let indexToUse = 0;

    if (
      node.restoreActiveChildIndex &&
      typeof node.previousActiveChildIndex === 'number'
    ) {
      indexToUse = node.previousActiveChildIndex;
    } else if (typeof node.defaultChildFocusIndex === 'number') {
      indexToUse = clamp(node.defaultChildFocusIndex, 0, lastIndex);
    } else if (orientation === node.orientation) {
      indexToUse = preferEnd ? lastIndex : 0;
    }

    const activeChildId = children[indexToUse];
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
