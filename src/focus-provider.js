import React, { useState, useRef } from 'react';
import FocusContext from './focus-context';

export default function FocusProvider({ initialFocusPath, children }) {
  let updateFocusRef = useRef();

  if (typeof updateFocusRef.current === 'undefined') {
    function updateFocus(focusPath) {
      focusStateRef.current.setFocusState({
        setFocusPath: updateFocusRef.current,
        focusPath,
      });
    }

    updateFocusRef.current = updateFocus;
  }

  const [focusState, setFocusState] = useState({
    focusPath: initialFocusPath,
    setFocusPath: updateFocusRef.current,
  });

  const focusStateRef = useRef({
    focusState,
    setFocusState,
  });

  return React.createElement(
    FocusContext.Provider,
    { value: focusState },
    children
  );
}
