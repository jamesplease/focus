import React from 'react';
import { renderHook } from 'react-hooks-testing-library';
import { useFocusHierarchy, FocusRoot, FocusNode } from '../src';

describe('useFocusHierarchy()', () => {
  describe('just the root', () => {
    it('returns the correct hierarchy', () => {
      const { result } = renderHook(() => useFocusHierarchy(), {
        wrapper: FocusRoot,
      });

      const mapped = result.current.map(node => node.id);

      expect(mapped).toEqual(['root']);
    });
  });

  describe('a more complex tree', () => {
    it('returns the correct hierarchy', () => {
      const wrapper = ({ children }) => {
        return (
          <FocusRoot>
            <FocusNode focusId="a">
              <FocusNode focusId="a.1" />
            </FocusNode>
            <FocusNode focusId="b">{children}</FocusNode>
          </FocusRoot>
        );
      };

      const { result } = renderHook(() => useFocusHierarchy(), {
        wrapper,
      });

      const mapped = result.current.map(node => node.id);
      expect(mapped).toEqual(['root', 'a', 'a.1']);
    });
  });
});
