export default function getFocusDiff({
  focusHierarchy = [],
  prevFocusHierarchy = [],
}) {
  const largerIndex = Math.max(
    focusHierarchy.length,
    prevFocusHierarchy.length
  );

  let splitIndex = NaN;
  for (let index = 0; index < largerIndex; index++) {
    const prevId = prevFocusHierarchy[index];
    const currentId = focusHierarchy[index];

    if (prevId !== currentId) {
      splitIndex = index;
      break;
    }
  }

  if (Number.isNaN(splitIndex)) {
    return {
      blur: [],
      focus: [],
    };
  }

  const blur = prevFocusHierarchy.slice(splitIndex);
  const focus = focusHierarchy.slice(splitIndex);

  return {
    blur,
    focus,
  };
}
