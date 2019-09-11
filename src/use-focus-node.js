import { useState, useContext, useEffect } from 'react';
import FocusContext from './focus-context';

function getFocusNode({ focusId, focusTree }) {
  const currentState = focusTree.getState();
  return currentState.nodes[focusId] || {};
}

export default function useFocusNode(focusId) {
  const { focusTree } = useContext(FocusContext);

  const [focusNode, setFocusNode] = useState(() => {
    return getFocusNode({ focusTree, focusId });
  });

  useEffect(() => {
    let currentNode = focusNode;

    const node = getFocusNode({
      focusId,
      focusTree,
    });

    // This check is here in the event that the mounting of the component affects the focus state
    // (a useEffect called before this hook could have changed focus before the subscribe below is called)
    if (node !== currentNode) {
      currentNode = node;
      setFocusNode(currentNode);
    }

    const unsubscribe = focusTree.subscribe(() => {
      const node = getFocusNode({
        focusId,
        focusTree,
      });

      if (node !== currentNode) {
        currentNode = node;
        setFocusNode(node);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return focusNode;
}
