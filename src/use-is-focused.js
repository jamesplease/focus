import { useState, useContext, useEffect } from 'react';
import FocusContext from './focus-context';

export default function useIsFocused(focusId, { exact = false } = {}) {
  // The tree never changes, so a ref is unnecessary
  const { focusTree } = useContext(FocusContext);

  const [isFocused, setIsFocused] = useState(() => {
    const currentState = focusTree.getState();
    const node = currentState.nodes[focusId] || {};
    const focusState = exact ? node.isFocusedExact : node.isFocused;

    return Boolean(focusState);
  });

  useEffect(() => {
    const currentState = focusTree.getState();
    let currentNode = currentState.nodes[focusId] || {};
    let currentFocusState = exact
      ? currentNode.isFocusedExact
      : currentNode.isFocused;

    // Just in case the mounting of the component changes the focus state.
    if (isFocused !== currentFocusState) {
      setIsFocused(Boolean(currentFocusState));
    }

    const unsubscribe = focusTree.subscribe(() => {
      const state = focusTree.getState();
      const node = state.nodes[focusId] || {};
      const focusState = exact ? node.isFocusedExact : node.isFocused;

      if (Boolean(focusState) !== Boolean(currentFocusState)) {
        currentNode = node;
        currentFocusState = focusState;
        setIsFocused(Boolean(focusState));
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isFocused;
}
