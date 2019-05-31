function executeFunction(node, fn, { key, preventDefault, stopPropagation }) {
  if (typeof node[fn] === 'function') {
    const arg = { key, node, stopPropagation };

    if (preventDefault) {
      arg.preventDefault = preventDefault;
    }

    node[fn](arg);
  }
}

export default function bubbleKey(focusTree, key) {
  const state = focusTree.getState();
  const { focusHierarchy } = state;

  const isArrow =
    key === 'up' || key === 'down' || key === 'right' || key === 'left';
  const isSelect = key === 'select';
  const isBack = key === 'back';

  let defaultPrevented = false;
  let propagationStopped = false;

  function preventDefault() {
    defaultPrevented = true;
  }

  function stopPropagation() {
    propagationStopped = true;
  }

  focusHierarchy.reverse().forEach((focusedNodeId, index) => {
    if (propagationStopped) {
      return;
    }

    const node = state.nodes[focusedNodeId];

    if (!node) {
      return;
    }

    executeFunction(node, 'onKey', { key, preventDefault, stopPropagation });

    if (isArrow) {
      executeFunction(node, 'onArrow', {
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (key === 'left') {
      executeFunction(node, 'onLeft', { key, preventDefault, stopPropagation });
    }

    if (key === 'right') {
      executeFunction(node, 'onRight', {
        key,
        preventDefault,
        stopPropagation,
      });
    }

    if (key === 'up') {
      executeFunction(node, 'onUp', { key, preventDefault, stopPropagation });
    }

    if (key === 'down') {
      executeFunction(node, 'onDown', { key, preventDefault, stopPropagation });
    }

    if (isSelect) {
      executeFunction(node, 'onSelect', { key, stopPropagation });
    }

    if (isBack) {
      executeFunction(node, 'onBack', { key, stopPropagation });
    }
  });

  if (isArrow && !defaultPrevented) {
    focusTree.handleArrow(key);
  }
}
