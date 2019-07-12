import { useContext, useState, useEffect } from 'react';
import FocusContext from './focus-context';
import useCurrentRef from './hooks/use-current-ref';

function hierarchiesAreEqual(old = [], current = []) {
  // Hierarchies are only equal when the lengths are the same, and...
  if (old.length !== current.length) {
    return false;
  }

  const oldFocusedExact = old[old.length - 1] || {};

  // ...when the last IDs match
  if (oldFocusedExact.id !== current[current.length - 1]) {
    return false;
  }

  return true;
}

export default function useFocusHierarchy() {
  const { focusTree } = useContext(FocusContext);

  const [focusHierarchy, setFocusHierarchy] = useState(() => {
    const state = focusTree.getState();
    return state.focusHierarchy.map(nodeId => state.nodes[nodeId]);
  });

  const focusHierarchyRef = useCurrentRef(focusHierarchy);

  useEffect(() => {
    const state = focusTree.getState();
    const focusHierarchy = state.focusHierarchy;

    if (!hierarchiesAreEqual(focusHierarchyRef.current, focusHierarchy)) {
      setFocusHierarchy(focusHierarchy.map(nodeId => state.nodes[nodeId]));
    }

    const unsubscribe = focusTree.subscribe(() => {
      const state = focusTree.getState();
      const focusHierarchy = state.focusHierarchy;

      if (!hierarchiesAreEqual(focusHierarchyRef.current, focusHierarchy)) {
        setFocusHierarchy(focusHierarchy.map(nodeId => state.nodes[nodeId]));
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return focusHierarchy;
}
