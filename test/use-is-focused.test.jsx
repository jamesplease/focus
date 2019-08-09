import React from 'react';
import { renderHook } from 'react-hooks-testing-library';
import { useFocusNode, FocusRoot, FocusNode } from '../src';

describe('useFocusNode()', () => {
  describe('just the root', () => {
    it('returns true when checking for root focus', () => {
      const { result } = renderHook(() => useFocusNode('root'), {
        wrapper: FocusRoot,
      });

      expect(result.current.isFocused).toBe(true);
    });

    it('returns false when checking for non-root focus', () => {
      const { result } = renderHook(() => useFocusNode('pizza'), {
        wrapper: FocusRoot,
      });

      expect(result.current.isFocused).toBeFalsy();
    });
  });

  describe('a larger tree', () => {
    it('returns true when checking for root focus', () => {
      const wrapper = ({ children }) => {
        return (
          <FocusRoot>
            <FocusNode focusId="a">hi</FocusNode>
            <FocusNode focusId="b">{children}</FocusNode>
          </FocusRoot>
        );
      };

      const { result } = renderHook(() => useFocusNode('root'), {
        wrapper,
      });

      expect(result.current.isFocused).toBe(true);
    });

    it('returns false when checking for root exact focus', () => {
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

      const { result } = renderHook(() => useFocusNode('root'), {
        wrapper,
      });

      expect(result.current.isFocusedExact).toBe(false);
    });

    it('returns true when checking for "a" focus', () => {
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

      const { result } = renderHook(() => useFocusNode('a'), {
        wrapper,
      });

      expect(result.current.isFocused).toBe(true);
    });

    it('returns false when checking for "a" exact focus', () => {
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

      const { result } = renderHook(() => useFocusNode('a'), {
        wrapper,
      });

      expect(result.current.isFocusedExact).toBe(false);
    });

    it('returns true when checking for "a.1" focus', () => {
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

      const { result } = renderHook(() => useFocusNode('a.1'), {
        wrapper,
      });

      expect(result.current.isFocused).toBe(true);
    });

    it('returns true when checking for "a.1" exact focus', () => {
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

      const { result } = renderHook(() => useFocusNode('a.1'), {
        wrapper,
      });

      expect(result.current.isFocusedExact).toBe(true);
    });

    it('returns respects focusOnMount', () => {
      const wrapper = ({ children }) => {
        return (
          <FocusRoot>
            <FocusNode focusId="a">
              <FocusNode focusId="a.1" />
            </FocusNode>
            <FocusNode focusId="b" focusOnMount>
              {children}
            </FocusNode>
          </FocusRoot>
        );
      };

      const { result } = renderHook(() => useFocusNode('b'), {
        wrapper,
      });

      expect(result.current.isFocusedExact).toBe(true);
    });
  });
});
