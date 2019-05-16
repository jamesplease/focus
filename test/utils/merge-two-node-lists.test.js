import mergeTwoNodeLists from '../../src/utils/merge-two-node-lists';

describe('mergeTwoNodeLists()', () => {
  describe('passing weird parameters', () => {
    it('returns an empty object', () => {
      expect(mergeTwoNodeLists()).toEqual({});
      expect(mergeTwoNodeLists(undefined, null)).toEqual({});
      expect(mergeTwoNodeLists(null, null)).toEqual({});
      expect(mergeTwoNodeLists({}, {})).toEqual({});
      expect(mergeTwoNodeLists(0, {})).toEqual({});
      expect(mergeTwoNodeLists(1, 1)).toEqual({});
    });
  });

  describe('passing two node lists with overlaps', () => {
    it('merges them', () => {
      const listOne = {
        one: {
          id: 'one',
          orientation: 'horizontal',
        },
        two: {
          id: 'two',
          orientation: 'vertical',
        },
      };

      const listTwo = {
        two: {
          id: 'two',
          children: ['wot'],
        },
      };

      const result = mergeTwoNodeLists(listOne, listTwo);

      expect(result).toEqual({
        one: {
          id: 'one',
          orientation: 'horizontal',
        },
        two: {
          id: 'two',
          orientation: 'vertical',
          children: ['wot'],
        },
      });
    });
  });

  describe('passing two node lists without overlaps', () => {
    it('merges them when one is larger than two', () => {
      const listOne = {
        one: {
          id: 'one',
          orientation: 'horizontal',
        },
        two: {
          id: 'two',
          orientation: 'vertical',
        },
      };

      const listTwo = {
        three: {
          id: 'three',
          children: ['wot'],
        },
      };

      const result = mergeTwoNodeLists(listOne, listTwo);

      expect(result).toEqual({
        one: {
          id: 'one',
          orientation: 'horizontal',
        },
        two: {
          id: 'two',
          orientation: 'vertical',
        },
        three: {
          id: 'three',
          children: ['wot'],
        },
      });
    });

    it('merges them when two is larger than one', () => {
      const listTwo = {
        one: {
          id: 'one',
          orientation: 'horizontal',
        },
        two: {
          id: 'two',
          orientation: 'vertical',
        },
      };

      const listOne = {
        three: {
          id: 'three',
          children: ['wot'],
        },
      };

      const result = mergeTwoNodeLists(listOne, listTwo);

      expect(result).toEqual({
        one: {
          id: 'one',
          orientation: 'horizontal',
        },
        two: {
          id: 'two',
          orientation: 'vertical',
        },
        three: {
          id: 'three',
          children: ['wot'],
        },
      });
    });
  });
});
