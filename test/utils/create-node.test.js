import createNode from '../../src/focus-tree/utils/create-node';

describe('createNode()', () => {
  it('computes correctly when calling it with a valid nodeId, but nothing else', () => {
    const currentState = {
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
        },
      },
    };

    expect(createNode(currentState, 'one')).toEqual({
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
          previousFocusedChildIndex: null,
        },
        one: {
          id: 'one',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          disabled: false,

          elRef: undefined,

          onBlur: null,
          onFocus: null,
          onArrow: null,
          onDown: null,
          onKey: null,
          onLeft: null,
          onMove: null,
          onRight: null,
          onUp: null,

          children: null,
          focusedChildIndex: null,
          previousFocusedChildIndex: null,
          restoreFocusedChildIndex: false,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
      },
    });
  });

  it('computes correctly when calling it with a valid nodeId and an existing parentId', () => {
    const currentState = {
      focusHierarchy: ['root', 'oneParent'],
      focusedNodeId: 'oneParent',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['oneParent'],
          focusedChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
      },
    };

    expect(
      createNode(currentState, 'one', {
        parentId: 'oneParent',
      })
    ).toEqual({
      focusHierarchy: ['root', 'oneParent', 'one'],
      focusedNodeId: 'one',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['oneParent'],
          focusedChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['one'],
          focusedChildIndex: 0,
          previousFocusedChildIndex: null,
        },
        one: {
          id: 'one',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          elRef: undefined,

          children: null,
          focusedChildIndex: null,

          onBlur: null,
          onFocus: null,
          onArrow: null,
          onDown: null,
          onKey: null,
          onLeft: null,
          onMove: null,
          onUp: null,
          onRight: null,
          onSelect: null,

          disabled: false,
          wrapping: false,
          orientation: 'horizontal',
          previousFocusedChildIndex: null,
          restoreFocusedChildIndex: false,
        },
      },
    });
  });

  it('computes correctly when calling it with a valid nodeId and an existing, focused parentId with another child', () => {
    const currentState = {
      focusHierarchy: ['root', 'oneParent', 'two'],
      focusedNodeId: 'two',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['oneParent'],
          focusedChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['two'],
          focusedChildIndex: 0,
        },
        two: {
          id: 'two',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
      },
    };

    expect(
      createNode(currentState, 'one', {
        parentId: 'oneParent',
      })
    ).toEqual({
      focusHierarchy: ['root', 'oneParent', 'two'],
      focusedNodeId: 'two',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['oneParent'],
          focusedChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['two', 'one'],
          focusedChildIndex: 0,
        },
        two: {
          id: 'two',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
        one: {
          id: 'one',
          parentId: 'oneParent',

          isFocused: false,
          isFocusedExact: false,

          elRef: undefined,

          children: null,
          focusedChildIndex: null,

          onBlur: null,
          onFocus: null,
          onArrow: null,
          onDown: null,
          onKey: null,
          onLeft: null,
          onMove: null,
          onRight: null,
          onUp: null,
          onSelect: null,

          disabled: false,
          wrapping: false,
          orientation: 'horizontal',
          restoreFocusedChildIndex: false,
        },
      },
    });
  });

  it('computes correctly when a parent exists, and is unfocused', () => {
    const currentState = {
      focusHierarchy: ['root', 'nodeTwo'],
      focusedNodeId: 'nodeTwo',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['nodeOne', 'nodeTwo'],
          focusedChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          focusedChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
      },
    };

    expect(
      createNode(currentState, 'test', {
        parentId: 'nodeOne',
      })
    ).toEqual({
      focusHierarchy: ['root', 'nodeTwo'],
      focusedNodeId: 'nodeTwo',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['nodeOne', 'nodeTwo'],
          focusedChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: ['test'],
          focusedChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
        test: {
          id: 'test',
          parentId: 'nodeOne',
          disabled: false,

          isFocused: false,
          isFocusedExact: false,

          elRef: undefined,

          children: null,
          focusedChildIndex: null,

          onBlur: null,
          onFocus: null,
          onArrow: null,
          onDown: null,
          onKey: null,
          onLeft: null,
          onMove: null,
          onRight: null,
          onUp: null,
          onSelect: null,

          wrapping: false,
          orientation: 'horizontal',
          restoreFocusedChildIndex: false,
        },
      },
    });
  });

  it('computes correctly when adding to the root unfocused', () => {
    const currentState = {
      focusHierarchy: ['root', 'nodeTwo'],
      focusedNodeId: 'nodeTwo',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['nodeOne', 'nodeTwo'],
          focusedChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          focusedChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
      },
    };

    expect(createNode(currentState, 'test')).toEqual({
      focusHierarchy: ['root', 'nodeTwo'],
      focusedNodeId: 'nodeTwo',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['nodeOne', 'nodeTwo', 'test'],
          focusedChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          focusedChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          focusedChildIndex: null,
        },
        test: {
          disabled: false,

          id: 'test',
          parentId: 'root',

          elRef: undefined,

          isFocused: false,
          isFocusedExact: false,

          children: null,
          focusedChildIndex: null,

          onBlur: null,
          onFocus: null,
          onArrow: null,
          onDown: null,
          onKey: null,
          onLeft: null,
          onMove: null,
          onRight: null,
          onUp: null,
          onSelect: null,

          wrapping: false,
          orientation: 'horizontal',
          restoreFocusedChildIndex: false,
        },
      },
    });
  });
});
