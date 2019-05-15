import _ from 'lodash';

const keyToBindingMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ' ': 'select',
  Enter: 'select',
};

export default function focusLrud(focusTree) {
  const lrudMapping = {
    up() {
      focusTree.handleUpArrow();
    },

    down() {
      focusTree.handleDownArrow();
    },

    left() {
      focusTree.handleLeftArrow();
    },

    right() {
      focusTree.handleRightArrow();
    },

    select() {
      const state = focusTree.getState();
      const { focusHierarchy } = state;

      focusHierarchy.forEach(focusedNodeId => {
        const node = state.nodes[focusedNodeId];

        if (node && typeof node.onSelect === 'function') {
          node.onSelect(node);
        }
      });
    },
  };

  // TODO: support throttling on a per-node basis.
  const keydownHandler = _.throttle(
    function(e) {
      const bindingName = keyToBindingMap[e.key];
      const binding = lrudMapping[bindingName];

      if (typeof binding === 'function') {
        e.preventDefault();
        e.stopPropagation();

        binding();
      }
    },
    // Temporarily not throttling while developing
    0,
    {
      trailing: false,
    }
  );

  function subscribe() {
    window.addEventListener('keydown', keydownHandler);
  }

  function unsubscribe() {
    window.removeEventListener('keydown', keydownHandler);
  }

  return {
    subscribe,
    unsubscribe,
  };
}
