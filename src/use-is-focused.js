import { useState, useContext, useEffect } from 'react';
import FocusContext from './focus-context';

export default function useIsFocused(focusId, { exact = false } = {}) {
  const [isFocused, setIsFocused] = useState(false);
  const { nodes } = useContext(FocusContext);

  useEffect(() => {
    const node = nodes[focusId] || {};
    const focusState = exact ? node.isFocusedExact : node.isFocused;
    setIsFocused(Boolean(focusState));
  }, [setIsFocused, nodes, exact, focusId]);

  return isFocused;
}
