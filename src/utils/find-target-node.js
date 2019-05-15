export default function findTargetNode(nodes, node, orientation, direction) {
  const nodeId = node.id;
  const parentId = node.parentId;

  let parentNode = {};
  if (typeof parentId === 'string') {
    parentNode = nodes[parentId];
  }

  if (parentNode.orientation !== orientation) {
    if (typeof parentNode.id === 'string') {
      return findTargetNode(nodes, parentNode, orientation, direction);
    }
  } else {
    if (parentNode.wrapping) {
      return node;
    } else {
      const parentsChildren = parentNode.children || [];
      const index = parentsChildren.indexOf(nodeId);

      if (direction === 'forward' && index === parentsChildren.length - 1) {
        return findTargetNode(nodes, parentNode, orientation, direction);
      } else if (direction === 'backward' && index === 0) {
        return findTargetNode(nodes, parentNode, orientation, direction);
      } else {
        return node;
      }
    }
  }
}
