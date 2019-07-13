import React from 'react';
import { renderHook } from 'react-hooks-testing-library';
import { useIsFocused, FocusRoot, FocusNode } from '../src';

describe('useIsFocused()', () => {
  describe('just the root', () => {
    it('returns true when checking for root focus', () => {
      const { result } = renderHook(() => useIsFocused('root'), {
        wrapper: FocusRoot,
      });

      expect(result.current).toBe(true);
    });

    it('returns false when checking for non-root focus', () => {
      const { result } = renderHook(() => useIsFocused('pizza'), {
        wrapper: FocusRoot,
      });

      expect(result.current).toBe(false);
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

      const { result } = renderHook(() => useIsFocused('root'), {
        wrapper,
      });

      expect(result.current).toBe(true);
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

      const { result } = renderHook(
        () => useIsFocused('root', { exact: true }),
        {
          wrapper,
        }
      );

      expect(result.current).toBe(false);
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

      const { result } = renderHook(() => useIsFocused('a'), {
        wrapper,
      });

      expect(result.current).toBe(true);
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

      const { result } = renderHook(() => useIsFocused('a', { exact: true }), {
        wrapper,
      });

      expect(result.current).toBe(false);
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

      const { result } = renderHook(() => useIsFocused('a.1'), {
        wrapper,
      });

      expect(result.current).toBe(true);
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

      const { result } = renderHook(
        () => useIsFocused('a.1', { exact: true }),
        {
          wrapper,
        }
      );

      expect(result.current).toBe(true);
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

      const { result } = renderHook(() => useIsFocused('b', { exact: true }), {
        wrapper,
      });

      expect(result.current).toBe(true);
    });
  });
});
