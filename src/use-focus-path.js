import { useContext, useEffect } from 'react';
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
  const { focusPath, setFocusPath, createNode, nodes } = useContext(
    FocusContext
  );
  const node = nodes[nodeId] || {};

  useEffect(() => {
    createNode({
      nodeId,
      parentId,
      focusOnMount,
      wrapping,
      orientation,
      inputThrottle,
      children,
      onSelect,
    });
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
