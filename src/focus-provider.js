import React, { useState, useEffect, useRef } from 'react';
import FocusContext from './focus-context';
import createFocusTree from './create-focus-tree';
import focusLrud from './focus-lrud';

function getFocusState(focusTreeRef) {
  return {
    ...focusTreeRef.current.getState(),
    createNode: focusTreeRef.current.createNode,
    destroyNode: focusTreeRef.current.destroyNode,
    setFocus: focusTreeRef.current.setFocus,
    moveFocusForward: focusTreeRef.current.moveFocusForward,
    moveFocusBackward: focusTreeRef.current.moveFocusBackward,
  };
}

export default function FocusProvider({ children }) {
  const focusTreeRef = useRef();

  if (!focusTreeRef.current) {
    focusTreeRef.current = createFocusTree();
    window.focusTree = focusTreeRef.current;
  }

  const [focusState, setFocusState] = useState(() =>
    getFocusState(focusTreeRef)
  );

  useEffect(() => {
    // At this point in time, the focusOnMount component will have updated the focus tree. But –
    // we haven't subscribed, so our mirrored state is stale. We manually sync it.
    setFocusState(getFocusState(focusTreeRef));

    // Now that we're manually synced, we can set up an automatic subscription to keep the state in order
    // going forward.
    const unsubscibe = focusTreeRef.current.subscribe(() =>
      setFocusState(getFocusState(focusTreeRef))
    );

    const lrud = focusLrud(focusTreeRef.current);
    lrud.subscribe();

    return () => {
      unsubscibe();
      lrud.unsubscribe();
    };
  }, []);

  return React.createElement(
    FocusContext.Provider,
    { value: focusState },
    children
  );
}
