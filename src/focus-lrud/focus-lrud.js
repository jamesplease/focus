import throttle from './throttle';
import bubbleKey from './bubble-key';
import keyToBindingMap from './key-to-binding-map';

export default function focusLrud(focusTree) {
  const lrudMapping = {
    up() {
      bubbleKey(focusTree, 'up');
    },

    down() {
      bubbleKey(focusTree, 'down');
    },

    left() {
      bubbleKey(focusTree, 'left');
    },

    right() {
      bubbleKey(focusTree, 'right');
    },

    select() {
      bubbleKey(focusTree, 'select');
    },

    back() {
      bubbleKey(focusTree, 'back');
    },
  };

  const keydownHandler = throttle(
    function(e) {
      const bindingName = keyToBindingMap[e.key];
      const binding = lrudMapping[bindingName];

      if (typeof binding === 'function') {
        e.preventDefault();
        e.stopPropagation();

        binding();
      }
    },
    // TODO: support throttling. Ideally on a per-node basis.
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
