export default function mergeTwoNodes(nodeOne, nodeTwo) {
  if (!nodeTwo) {
    return null;
  }

  return {
    ...nodeOne,
    ...nodeTwo,
  };
}
