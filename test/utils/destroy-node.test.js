import destroyNode from '../../src/focus-tree/utils/destroy-node';

describe('destroyNode()', () => {
  it('returns the same state when calling it with invalid nodeIds', () => {
    const currentState = {
      focusHierarchy: ['root'],
      focusedNodeId: 'root',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: true,
        },
      },
    };

    expect(destroyNode(currentState)).toBe(currentState);
    expect(destroyNode(currentState, null)).toBe(currentState);
    expect(destroyNode(currentState, 'sandwiches')).toBe(currentState);
    expect(destroyNode(currentState, {})).toBe(currentState);
  });

  it('deletes the node from root, when it has no children', () => {
    const currentState = {
      focusHierarchy: ['root', 'one'],
      focusedNodeId: 'one',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['one'],
          focusedChildIndex: 0,
        },

        one: {
          id: 'one',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
      },
    };

    expect(destroyNode(currentState, 'one')).toEqual({
      focusHierarchy: ['root'],
      focusedNodeId: 'root',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
          previousFocusedChildIndex: null,
        },
      },
    });
  });

  // it('deletes the node correctly when it has children that are focused', () => {
  //   const currentState = {
  //     focusHierarchy: ['root', 'one', 'childOne'],
  //     focusedNodeId: 'childOne',
  //     nodes: {
  //       root: {
  //         id: 'root',
  //         parentId: null,

  //         isFocused: true,
  //         isFocusedExact: false,

  //         children: ['one', 'two'],
  //         focusedChildIndex: 0,
  //       },

  //       one: {
  //         id: 'one',
  //         parentId: 'root',

  //         isFocused: true,
  //         isFocusedExact: false,

  //         children: ['childOne', 'childTwo'],
  //         focusedChildIndex: 0,
  //       },

  //       two: {
  //         id: 'two',
  //         parentId: 'root',

  //         isFocused: false,
  //         isFocusedExact: false,

  //         children: null,
  //         focusedChildIndex: null,
  //       },

  //       childOne: {
  //         id: 'childOne',
  //         parentId: 'one',

  //         isFocused: true,
  //         isFocusedExact: true,

  //         children: null,
  //         focusedChildIndex: null,
  //       },

  //       childTwo: {
  //         id: 'childTwo',
  //         parentId: 'one',

  //         isFocused: false,
  //         isFocusedExact: false,

  //         children: null,
  //         focusedChildIndex: null,
  //       },
  //     },
  //   };

  //   expect(destroyNode(currentState, 'one')).toEqual({
  //     focusHierarchy: ['root', 'childOne'],
  //     focusedNodeId: 'childOne',
  //     nodes: {
  //       root: {
  //         id: 'root',
  //         parentId: null,

  //         isFocused: true,
  //         isFocusedExact: false,

  //         children: ['childOne', 'childTwo', 'two'],
  //         focusedChildIndex: 0,
  //       },

  //       two: {
  //         id: 'two',
  //         parentId: 'root',

  //         isFocused: false,
  //         isFocusedExact: false,

  //         children: null,
  //         focusedChildIndex: null,
  //       },

  //       childOne: {
  //         id: 'childOne',
  //         parentId: 'one',

  //         isFocused: true,
  //         isFocusedExact: true,

  //         children: null,
  //         focusedChildIndex: null,
  //       },

  //       childTwo: {
  //         id: 'childTwo',
  //         parentId: 'one',

  //         isFocused: false,
  //         isFocusedExact: false,

  //         children: null,
  //         focusedChildIndex: null,
  //       },
  //     },
  //   });
  // });
});
