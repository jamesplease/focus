export default function mergeTwoNodes(nodeOne, nodeTwo) {
  if (!nodeTwo) {
    return null;
  }

  // const childrenTwo = nodeTwo.children;

  // let newChildren = nodeOne.children;

  // if (Array.isArray(childrenTwo)) {
  //   newChildren = childrenTwo;
  // } else if (childrenTwo === null) {
  //   newChildren = undefined;
  // }

  return {
    ...nodeOne,
    ...nodeTwo,
    // children: newChildren,
  };
}
