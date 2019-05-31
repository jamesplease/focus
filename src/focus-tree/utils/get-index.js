import clamp from './clamp';

function getWrappedIndex(index, size) {
  return index - Math.floor(index / size) * size;
}

export default function getIndex(arrayLength, index, wrap) {
  if (wrap) {
    return getWrappedIndex(index, arrayLength);
  } else {
    return clamp(index, 0, arrayLength - 1);
  }
}
