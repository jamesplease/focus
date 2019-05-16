import { createFocusTree } from '../src';

describe('focusTree.createNode()', () => {
  describe('passing just a nodeId', () => {
    it('creates the expected node', () => {
      const tree = createFocusTree();

      tree.createNode('test');

      const state = tree.getState();

      expect(state).toEqual({
        focusedNodeId: 'test',
        focusHierarchy: ['root', 'test'],
        nodes: {
          root: {
            id: 'root',
            parentId: null,

            isFocused: true,
            isFocusedExact: false,

            children: ['test'],
            activeChildIndex: 0,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
          test: {
            id: 'test',
            parentId: 'root',

            isFocused: true,
            isFocusedExact: true,

            children: null,
            activeChildIndex: null,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
        },
      });
    });
  });

  describe('passing some options', () => {
    it('creates the expected node', () => {
      const tree = createFocusTree();

      function onSelect() {}

      tree.createNode('test', {
        wrapping: true,
        orientation: 'vertical',
        onSelect,
      });

      const state = tree.getState();

      expect(state).toEqual({
        focusedNodeId: 'test',
        focusHierarchy: ['root', 'test'],
        nodes: {
          root: {
            id: 'root',
            parentId: null,

            isFocused: true,
            isFocusedExact: false,

            children: ['test'],
            activeChildIndex: 0,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
          test: {
            id: 'test',
            parentId: 'root',

            isFocused: true,
            isFocusedExact: true,

            children: null,
            activeChildIndex: null,

            orientation: 'vertical',
            wrapping: true,
            onSelect,
          },
        },
      });
    });
  });

  describe('passing an array of children', () => {
    it('creates the expected node, and its children', () => {
      const tree = createFocusTree();

      tree.createNode('test', {
        children: ['childOne'],
      });

      const state = tree.getState();

      expect(state).toEqual({
        focusedNodeId: 'childOne',
        focusHierarchy: ['root', 'test', 'childOne'],
        nodes: {
          root: {
            id: 'root',
            parentId: null,

            isFocused: true,
            isFocusedExact: false,

            children: ['test'],
            activeChildIndex: 0,

            orientation: 'horizontal',
            wrapping: false,

            onSelect: null,
          },
          test: {
            id: 'test',
            parentId: 'root',

            isFocused: true,
            isFocusedExact: false,

            children: ['childOne'],
            activeChildIndex: 0,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
          childOne: {
            id: 'childOne',
            parentId: 'test',

            isFocused: true,
            isFocusedExact: true,

            children: null,
            activeChildIndex: null,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
        },
      });
    });
  });

  describe('passing a parent', () => {
    it('creates the expected node, and its parent', () => {
      const tree = createFocusTree();

      tree.createNode('test', {
        parentId: 'testParent',
      });

      const state = tree.getState();

      expect(state).toEqual({
        focusedNodeId: 'test',
        focusHierarchy: ['root', 'testParent', 'test'],
        nodes: {
          root: {
            id: 'root',
            parentId: null,

            isFocused: true,
            isFocusedExact: false,

            children: ['testParent'],
            activeChildIndex: 0,

            orientation: 'horizontal',
            wrapping: false,

            onSelect: null,
          },
          testParent: {
            id: 'testParent',
            parentId: 'root',

            isFocused: true,
            isFocusedExact: false,

            children: ['test'],
            activeChildIndex: 0,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
          test: {
            id: 'test',
            parentId: 'testParent',

            isFocused: true,
            isFocusedExact: true,

            children: null,
            activeChildIndex: null,

            orientation: 'horizontal',
            wrapping: false,
            onSelect: null,
          },
        },
      });
    });
  });
});
