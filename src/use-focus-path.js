import { useContext, useEffect, useMemo, useRef } from 'react';
import FocusContext from './focus-context';

export default function useFocusPath(
  nodeId = '',
  {
    focusOnMount,
    parentId,
    orientation = 'horizontal',
    wrapping = false,
    inputThrottle,
    children,
    onSelect,
  } = {}
) {
  const {
    focusPath,
    setFocusPath,
    createNode,
    destroyNode,
    nodes,
  } = useContext(FocusContext);
  const possibleNode = nodes[nodeId];
  const hasNode = Boolean(possibleNode);

  const hasNodeRef = useRef(hasNode);

  useEffect(() => {
    hasNodeRef.current = hasNode;
  }, [hasNode]);

  const node = nodes[nodeId] || {
    id: nodeId,
    isFocused: false,
    isFocusedExact: false,
    children: null,
    activeChildIndex: null,
  };

  const createdRef = useRef(false);

  if (!createdRef.current) {
    createdRef.current = true;

    createNode(nodeId, {
      parentId,
      focusOnMount,
      wrapping,
      orientation,
      inputThrottle,
      children,
      onSelect,
    });
  }

  useEffect(() => {
    return () => {
      if (hasNodeRef.current) {
        destroyNode(nodeId);
      }
    };
  }, []);

  return {
    ...node,
    nodes,

    focusPath,
    setFocusPath,
    setFocusedChild() {},
    setFocusedSibling() {},
  };
}
