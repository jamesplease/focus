import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FocusContext from './focus-context';
import createFocusTree from './focus-tree/create-focus-tree';
import focusLrud from './focus-lrud/focus-lrud';

function getFocusState(focusTreeRef) {
  return {
    ...focusTreeRef.current.getState(),
    focusTree: focusTreeRef.current,
    createNode: focusTreeRef.current.createNode,
    updateNode: focusTreeRef.current.updateNode,
    destroyNode: focusTreeRef.current.destroyNode,
    setFocus: focusTreeRef.current.setFocus,
  };
}

export default function FocusRoot({ children, orientation, wrapping }) {
  const focusTreeRef = useRef();

  if (!focusTreeRef.current) {
    focusTreeRef.current = createFocusTree({
      orientation,
      wrapping,
    });
  }

  const [focusState, setFocusState] = useState(() =>
    getFocusState(focusTreeRef)
  );

  useEffect(() => {
    // At this point in time, the focusOnMount component will have updated the focus tree. But –
    // we haven't subscribed, so our mirrored state is stale. We manually sync it.
    setFocusState(getFocusState(focusTreeRef));

    // Now that we've manually synced the state, we can set up an automatic subscription to keep the state in order
    // going forward.
    const unsubscribe = focusTreeRef.current.subscribe(() =>
      setFocusState(getFocusState(focusTreeRef))
    );

    const lrud = focusLrud(focusTreeRef.current);
    lrud.subscribe();

    return () => {
      unsubscribe();
      lrud.unsubscribe();
    };
  }, []);

  return React.createElement(
    FocusContext.Provider,
    { value: focusState },
    children
  );
}

FocusRoot.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  wrapping: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
