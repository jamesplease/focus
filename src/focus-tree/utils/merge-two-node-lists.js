import mergeTwoNodes from './merge-two-nodes';

// TODO: warn if one has a larger size than two
export default function mergeTwoNodeLists(listOne = {}, listTwo = {}) {
  // We start by merging the two naively. This ensures that all nodes are present in the final
  // result.
  const result = {
    ...listOne,
    ...listTwo,
  };

  // Next, we iterate listTwo so that we can merge the listTwo nodes with listOne
  for (let id in listTwo) {
    result[id] = mergeTwoNodes(listOne[id], listTwo[id]);
  }

  return result;
}
