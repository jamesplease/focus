import React from 'react';
import { renderHook, act } from 'react-hooks-testing-library';
import { useSetFocus, FocusRoot, Focusable } from '../src';

describe('useSetFocus()', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useSetFocus(), {
      wrapper: FocusRoot,
    });

    expect(typeof result.current).toEqual('function');
  });

  describe('when calling it', () => {
    it('can trigger focus and blur events on Focusable components', () => {
      const onFocusA = jest.fn();
      const onFocusB = jest.fn();
      const onBlurA = jest.fn();
      const onBlurB = jest.fn();

      const wrapper = ({ children }) => {
        return (
          <FocusRoot>
            <Focusable focusId="a" onFocus={onFocusA} onBlur={onBlurA}>
              hi
            </Focusable>
            <Focusable focusId="b" onFocus={onFocusB} onBlur={onBlurB}>
              {children}
            </Focusable>
          </FocusRoot>
        );
      };

      const { result } = renderHook(() => useSetFocus(), {
        wrapper,
      });

      expect(onFocusA.mock.calls.length).toBe(1);
      expect(onFocusB.mock.calls.length).toBe(0);
      expect(onBlurA.mock.calls.length).toBe(0);
      expect(onBlurB.mock.calls.length).toBe(0);

      act(() => {
        result.current('b');
      });

      expect(onFocusA.mock.calls.length).toBe(1);
      expect(onFocusB.mock.calls.length).toBe(1);
      expect(onBlurA.mock.calls.length).toBe(1);
      expect(onBlurB.mock.calls.length).toBe(0);
    });
  });
});
