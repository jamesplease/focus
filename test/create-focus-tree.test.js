import createFocusTree from '../src/focus-tree/create-focus-tree';

describe('createFocusTree()', () => {
  it('returns an object with the right shape', () => {
    const tree = createFocusTree();

    expect(typeof tree.subscribe).toEqual('function');
    expect(typeof tree.getState).toEqual('function');
    expect(typeof tree.createNode).toEqual('function');
    expect(typeof tree.destroyNode).toEqual('function');
    expect(typeof tree.setFocus).toEqual('function');
  });

  describe('getState()', () => {
    describe('default root options', () => {
      it('returns the right initial state', () => {
        const tree = createFocusTree();
        const state = tree.getState();
        expect(state).toEqual({
          focusedNodeId: 'root',
          focusHierarchy: ['root'],
          nodes: {
            root: {
              id: 'root',
              parentId: null,
              isFocused: true,
              isFocusedExact: true,
              orientation: 'horizontal',
              wrapping: false,
            },
          },
        });
      });
    });

    describe('setting root options', () => {
      it('returns the right initial state', () => {
        const tree = createFocusTree({
          orientation: 'vertical',
          wrapping: true,
        });
        const state = tree.getState();
        expect(state).toEqual({
          focusedNodeId: 'root',
          focusHierarchy: ['root'],
          nodes: {
            root: {
              id: 'root',
              parentId: null,
              isFocused: true,
              isFocusedExact: true,
              orientation: 'vertical',
              wrapping: true,
            },
          },
        });
      });
    });
  });
});
