// This is to be used when a node that is focused exactly gets deleted.
// It returns the new node ID to focus.
export default function getNearestNode(nodes, nodeId) {
  const node = nodes[nodeId] || {};

  const parentId = node.parentId;

  if (typeof parentId !== 'string') {
    return null;
  }

  const parentNode = nodes[parentId] || {};
  const children = parentNode.children;

  if (!Array.isArray(children) || children.length === 1) {
    return parentId;
  }

  // Right now, we find the first child that _isn't_ the deleted node.
  // This will tend to "reset" to the 0th child, which we may not want.
  return children.find(v => v !== nodeId);
}
