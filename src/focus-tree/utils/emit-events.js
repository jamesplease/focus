import getFocusDiff from './get-focus-diff';
import bubbleEvent from './bubble-event';

export default function emitEvents({ currentState, nextState }) {
  const { focus, blur } = getFocusDiff({
    focusHierarchy: nextState.focusHierarchy,
    prevFocusHierarchy: currentState.focusHierarchy,
  });

  bubbleEvent({
    nodeIds: blur,
    nodes: nextState.nodes,
    callbackName: 'onBlur',
    hasDefault: false,
  });

  bubbleEvent({
    nodeIds: focus,
    nodes: nextState.nodes,
    callbackName: 'onFocus',
    hasDefault: false,
  });
}
