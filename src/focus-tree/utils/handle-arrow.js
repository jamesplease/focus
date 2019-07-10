import getIndex from './get-index';
import findTargetNode from './find-target-node';

export default function handleArrow({ currentState, arrow, setFocus }) {
  const orientation =
    arrow === 'right' || arrow === 'left' ? 'horizontal' : 'vertical';
  const direction =
    arrow === 'down' || arrow === 'right' ? 'forward' : 'backward';

  const focusedNode = currentState.nodes[currentState.focusedNodeId];

  // The target node is the node whose parent will handle the event.
  // For instance, if you press the Up key, the first ancestor node
  // that is a child of a vertically oriented list will be the target.
  const targetNode = findTargetNode(
    currentState.nodes,
    focusedNode,
    orientation,
    direction
  );

  if (targetNode) {
    const parentId = targetNode.parentId;
    let parentNode = {};
    if (typeof parentId === 'string') {
      parentNode = currentState.nodes[parentId];
    }

    const distance = direction === 'forward' ? 1 : -1;
    const wrapping = parentNode.wrapping;
    const preferEnd = direction === 'forward' ? false : true;

    const targetNodeId = targetNode.id;

    const allParentsChildren = parentNode.children || [];

    const parentsChildren = allParentsChildren.filter(nodeId => {
      const node = currentState.nodes[nodeId];

      if (node && node.disabled) {
        return false;
      }

      return true;
    });

    const index = parentsChildren.indexOf(targetNodeId);

    const newIndex = getIndex(
      parentsChildren.length,
      index + distance,
      wrapping
    );
    const newFocusedId = parentsChildren[newIndex];
    const newFocusedNode = currentState.nodes[newFocusedId];

    // Disabled nodes cannot receive focus
    if (newFocusedNode.disabled) {
      return;
    }

    const currentActiveIndex = parentNode.activeChildIndex;
    const currentActiveNodeId = parentNode.children[currentActiveIndex];
    const currentActiveNode = currentState.nodes[currentActiveNodeId];

    setFocus(newFocusedId, orientation, preferEnd);

    if (typeof parentNode.onMove === 'function') {
      parentNode.onMove({
        orientation,
        direction,
        arrow,
        node: parentNode,
        prevChildIndex: parentNode.activeChildIndex,
        nextChildIndex: newIndex,
        prevChildNode: currentActiveNode,
        nextChildNode: newFocusedNode,
      });
    }
  }
}
