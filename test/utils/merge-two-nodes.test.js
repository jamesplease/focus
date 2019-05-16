import mergeTwoNodes from '../../src/utils/merge-two-nodes';

describe('mergeTwoNodes()', () => {
  describe('passing nothing', () => {
    it('returns null', () => {
      const result = mergeTwoNodes();

      expect(result).toBeNull();
    });
  });

  describe('passing a node and nothing', () => {
    it('returns null', () => {
      const result = mergeTwoNodes({
        id: 'wot',
      });

      expect(result).toBeNull();
    });
  });

  describe('passing two nodes', () => {
    it('returns the merged nodes, replacing an array of children with a new array', () => {
      const nodeOne = {
        id: 'one',
        orientation: 'horizontal',
        children: ['test'],
      };

      const nodeTwo = {
        id: 'one',
        orientation: 'vertical',
        children: ['test', 'two'],
      };

      const result = mergeTwoNodes(nodeOne, nodeTwo);

      expect(result).toEqual({
        id: 'one',
        orientation: 'vertical',
        children: ['test', 'two'],
      });
    });

    it('returns the merged nodes, replacing an array of children with null', () => {
      const nodeOne = {
        id: 'one',
        orientation: 'horizontal',
        children: ['test'],
      };

      const nodeTwo = {
        id: 'one',
        orientation: 'vertical',
        children: null,
      };

      const result = mergeTwoNodes(nodeOne, nodeTwo);

      expect(result).toEqual({
        id: 'one',
        orientation: 'vertical',
        children: null,
      });
    });
  });
});
