import createNode from '../../src/utils/create-node';

describe('createNode()', () => {
  it('returns the same state when calling it with no nodeId', () => {
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

    expect(createNode(currentState)).toBe(currentState);
  });

  it('returns the same state when calling it with the nodeId of `root`', () => {
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

    expect(createNode(currentState, 'root')).toBe(currentState);
  });

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
          activeChildIndex: null,
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
          activeChildIndex: 0,
        },
        one: {
          id: 'one',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
      },
    });
  });

  it('computes correctly when passing children', () => {
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
          activeChildIndex: null,
        },
      },
    };

    expect(
      createNode(currentState, 'one', { children: ['childOne', 'childTwo'] })
    ).toEqual({
      focusHierarchy: ['root', 'one', 'childOne'],
      focusedNodeId: 'childOne',
      nodes: {
        root: {
          id: 'root',
          parentId: null,

          isFocused: true,
          isFocusedExact: false,

          children: ['one'],
          activeChildIndex: 0,
        },
        one: {
          id: 'one',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['childOne', 'childTwo'],
          activeChildIndex: 0,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
        childOne: {
          id: 'childOne',
          parentId: 'one',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },

        childTwo: {
          id: 'childTwo',
          parentId: 'one',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
      },
    });
  });

  it('computes correctly when calling it with a valid nodeId and a non-existing parentId', () => {
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
          activeChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['one'],
          activeChildIndex: 0,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
        one: {
          id: 'one',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,

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
          activeChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
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
          activeChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['one'],
          activeChildIndex: 0,
        },
        one: {
          id: 'one',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
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
          activeChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['two'],
          activeChildIndex: 0,
        },
        two: {
          id: 'two',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
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
          activeChildIndex: 0,
        },
        oneParent: {
          id: 'oneParent',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: false,

          children: ['two', 'one'],
          activeChildIndex: 0,
        },
        two: {
          id: 'two',
          parentId: 'oneParent',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
        },
        one: {
          id: 'one',
          parentId: 'oneParent',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
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
          activeChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
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
          activeChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: ['test'],
          activeChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
        },
        test: {
          id: 'test',
          parentId: 'nodeOne',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
      },
    });
  });

  it('computes correctly when a parent does not exist, and it will not receive focused', () => {
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
          activeChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
        },
      },
    };

    expect(
      createNode(currentState, 'test', {
        parentId: 'newParent',
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

          children: ['nodeOne', 'nodeTwo', 'newParent'],
          activeChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
        },
        newParent: {
          id: 'newParent',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: ['test'],
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
        test: {
          id: 'test',
          parentId: 'newParent',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
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
          activeChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
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
          activeChildIndex: 1,
        },
        nodeOne: {
          id: 'nodeOne',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,
        },
        nodeTwo: {
          id: 'nodeTwo',
          parentId: 'root',

          isFocused: true,
          isFocusedExact: true,

          children: null,
          activeChildIndex: null,
        },
        test: {
          id: 'test',
          parentId: 'root',

          isFocused: false,
          isFocusedExact: false,

          children: null,
          activeChildIndex: null,

          wrapping: false,
          onSelect: null,
          orientation: 'horizontal',
        },
      },
    });
  });
});
