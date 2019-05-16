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
  const {
    focusPath,
    setFocusPath,
    createNode,
    destroyNode,
    nodes,
  } = useContext(FocusContext);
  const node = nodes[nodeId] || {};

  useEffect(() => {
    createNode(nodeId, {
      parentId,
      focusOnMount,
      wrapping,
      orientation,
      inputThrottle,
      children,
      onSelect,
    });

    return () => {
      destroyNode();
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
