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

    let focusedChildId = children[0];

    if (
      node.restoreFocusedChildIndex &&
      typeof node.previousFocusedChildIndex === 'number' &&
      !isNodeDisabled(nodes, unfilteredChildren[node.previousFocusedChildIndex])
    ) {
      focusedChildId = unfilteredChildren[node.previousFocusedChildIndex];
    } else if (
      typeof node.defaultChildFocusIndex === 'number' &&
      !isNodeDisabled(nodes, unfilteredChildren[node.defaultChildFocusIndex])
    ) {
      focusedChildId = unfilteredChildren[node.defaultChildFocusIndex];
    } else if (orientation === node.orientation) {
      const index = preferEnd ? lastIndex : 0;
      focusedChildId = children[index];
    }

    results = [focusedChildId];

    if (typeof focusedChildId === 'string') {
      const focusedChild = nodes[focusedChildId];
      results = results.concat(
        getChildren(nodes, focusedChild, orientation, preferEnd)
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
