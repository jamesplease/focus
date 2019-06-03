import { useContext, useEffect, useRef } from 'react';
import FocusContext from './focus-context';

export default function useFocus() {
  const { setFocus, nodes } = useContext(FocusContext);

  const nodesRef = useRef(nodes);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  function isFocused(nodeId) {
    const node = nodesRef.current[nodeId] || {};
    return Boolean(node.isFocused);
  }

  function isFocusedExact(nodeId) {
    const node = nodesRef.current[nodeId] || {};
    return Boolean(node.isFocusedExact);
  }

  return {
    setFocus,
    isFocused,
    isFocusedExact,
  };
}
