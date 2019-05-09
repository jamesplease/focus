export default function matchFocusPath({
  currentFocusPath = '',
  testFocusPath = '',
}) {
  const isExact = currentFocusPath === testFocusPath;
  if (isExact) {
    return {
      isFocusedExact: true,
      isFocused: true
    };
  }

  const isFocused = currentFocusPath.indexOf(testFocusPath) === 0;

  if (isFocused) {
    return {
      isFocusedExact: false,
      isFocused: true
    };
  }

  else {
    return {
      isFocusedExact: false,
      isFocused: false
    }
  }
}
