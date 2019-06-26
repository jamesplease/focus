export default function bubbleEvent({
  nodeIds,
  nodes,
  callbackName,
  arg,
  hasDefault,
}) {
  let defaultPrevented = false;
  let propagationStopped = false;

  function preventDefault() {
    defaultPrevented = true;
  }

  function stopPropagation() {
    propagationStopped = true;
  }

  [...nodeIds].reverse().forEach(focusedNodeId => {
    if (propagationStopped) {
      return;
    }

    const node = nodes[focusedNodeId];

    if (!node) {
      return;
    }

    if (typeof node[callbackName] === 'function') {
      const argToUse = {
        ...arg,
        node,
        stopPropagation,
      };

      if (hasDefault) {
        argToUse.preventDefault = preventDefault;
      }

      node[callbackName](argToUse);
    }
  });

  return {
    defaultPrevented,
    propagationStopped,
  };
}
