import getFocusedHierarchy from '../../src/utils/get-focused-hierarchy';

describe('getFocusedHierarchy()', () => {
  it('returns an empty array when no nodes are passed', () => {
    const hierarchy = getFocusedHierarchy({}, undefined, 'horizontal', false);

    expect(hierarchy).toEqual([]);
  });

  it('returns a single node when appropriate', () => {
    const nodes = {
      a: {
        id: 'a',
      },
      b: {
        id: 'b',
      },
    };

    const hierarchy = getFocusedHierarchy(nodes, 'a');

    expect(hierarchy).toEqual(['a']);
  });

  it('returns a list of focused nodes when the leaf node is chosen', () => {
    const nodes = {
      a: {
        id: 'a',
        children: ['b'],
      },
      b: {
        id: 'b',
        parentId: 'a',
        children: ['c'],
      },
      c: {
        id: 'c',
        parentId: 'b',
      },
      d: {
        id: 'd',
      },
      e: {
        id: 'e',
      },
    };

    const hierarchy = getFocusedHierarchy(nodes, 'c');

    expect(hierarchy).toEqual(['a', 'b', 'c']);
  });

  it('returns a list of focused nodes when the root node is chosen', () => {
    const nodes = {
      a: {
        id: 'a',
        children: ['b'],
      },
      b: {
        id: 'b',
        parentId: 'a',
        children: ['c'],
      },
      c: {
        id: 'c',
        parentId: 'b',
      },
      d: {
        id: 'd',
      },
      e: {
        id: 'e',
      },
    };

    const hierarchy = getFocusedHierarchy(nodes, 'a');

    expect(hierarchy).toEqual(['a', 'b', 'c']);
  });

  it('returns a list of focused nodes when a middle node is chosen', () => {
    const nodes = {
      a: {
        id: 'a',
        children: ['b'],
      },
      b: {
        id: 'b',
        parentId: 'a',
        children: ['c'],
      },
      c: {
        id: 'c',
        parentId: 'b',
      },
      d: {
        id: 'd',
      },
      e: {
        id: 'e',
      },
    };

    const hierarchy = getFocusedHierarchy(nodes, 'b');

    expect(hierarchy).toEqual(['a', 'b', 'c']);
  });
});
