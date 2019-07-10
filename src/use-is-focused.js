import { useState, useContext, useEffect } from 'react';
import FocusContext from './focus-context';
import useCurrentRef from './hooks/use-current-ref';

function calculateFocus({ focusId, exact, focusTree }) {
  const currentState = focusTree.getState();
  const node = currentState.nodes[focusId] || {};
  const focused = exact ? node.isFocusedExact : node.isFocused;

  return Boolean(focused);
}

export default function useIsFocused(focusId, { exact = false } = {}) {
  const { focusTree } = useContext(FocusContext);

  const exactRef = useCurrentRef(exact);

  const [isFocused, setIsFocused] = useState(() => {
    return calculateFocus({
      focusId,
      exact: exactRef.current,
      focusTree,
    });
  });

  useEffect(() => {
    const focus = calculateFocus({
      focusId,
      focusTree,
      exact: exactRef.current,
    });

    let currentFocus = focus;

    // This check is here in the event that the mounting of the component affects the focus state
    // (a useEffect called before this hook could have changed focus before the subscribe below is called)
    if (isFocused !== currentFocus) {
      setIsFocused(currentFocus);
    }

    const unsubscribe = focusTree.subscribe(() => {
      const focus = calculateFocus({
        focusId,
        exact: exactRef.current,
        focusTree,
      });

      if (focus !== currentFocus) {
        currentFocus = focus;
        setIsFocused(focus);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isFocused;
}
