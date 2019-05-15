function getNodeAncestors(nodes, node = {}) {
  let result = [];

  if (node.parentId) {
    const parentNode = nodes[node.parentId];
    result = [node.parentId].concat(getNodeAncestors(nodes, parentNode));
  }

  return result.reverse();
}

function getChildren(nodes, node = {}, orientation, preferEnd) {
  const children = node.children;
  let results = [];
  if (Array.isArray(children)) {
    const lastIndex = Math.max(0, children.length - 1);

    let indexToUse = 0;
    if (orientation === node.orientation) {
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
