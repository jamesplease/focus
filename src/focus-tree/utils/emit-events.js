import getFocusDiff from './get-focus-diff';
import bubbleEvent from './bubble-event';

export default function emitEvents({ currentState, nextState }) {
  const { focus, blur } = getFocusDiff({
    focusHierarchy: nextState.focusHierarchy,
    prevFocusHierarchy: currentState.focusHierarchy,
  });

  const blurNodeId = blur.slice(-1)[0];
  const focusNodeId = focus.slice(-1)[0];

  const blurNode =
    typeof blurNodeId !== 'undefined' ? nextState.nodes[blurNodeId] : undefined;
  const focusNode =
    typeof focusNodeId !== 'undefined'
      ? nextState.nodes[focusNodeId]
      : undefined;

  bubbleEvent({
    nodeIds: blur,
    nodes: nextState.nodes,
    callbackName: 'onBlur',
    hasDefault: false,
    arg: {
      blurNode,
      focusNode,
    },
  });

  bubbleEvent({
    nodeIds: focus,
    nodes: nextState.nodes,
    callbackName: 'onFocus',
    hasDefault: false,
    arg: {
      blurNode,
      focusNode,
    },
  });
}
