// This returns a cloned version of the `nodes` list,
// where none of them are focused. This is useful to ensure that when
// focus changes, no lingering focused nodes remain.
export default function resetFocusedNodes(nodes) {
  const result = {};
  for (let nodeId in nodes) {
    const node = nodes[nodeId];

    result[nodeId] = {
      ...node,
      isFocused: false,
      isFocusedExact: false,
    };
  }

  return result;
}
