import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FocusContext from './focus-context';
import createFocusTree from './focus-tree/create-focus-tree';
import focusLrud from './focus-lrud/focus-lrud';

export default function FocusRoot({ children, orientation, wrapping }) {
  const [providerValue] = useState(() => {
    return {
      focusTree: createFocusTree({
        orientation,
        wrapping,
      }),
      currentNodeId: 'root',
    };
  });

  useEffect(() => {
    const lrud = focusLrud(providerValue.focusTree);
    lrud.subscribe();

    return () => {
      lrud.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement(
    FocusContext.Provider,
    { value: providerValue },
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
