import { renderHook } from 'react-hooks-testing-library';
import { useFocus, FocusRoot } from '../src';

describe('useFocus()', () => {
  it('should return an object with the expected shape', () => {
    const { result } = renderHook(() => useFocus(), {
      wrapper: FocusRoot,
    });

    expect(typeof result.current.isFocused).toEqual('function');
    expect(typeof result.current.isFocusedExact).toEqual('function');
    expect(typeof result.current.setFocus).toEqual('function');
  });

  it('isFocused should return the expected values', () => {
    const { result } = renderHook(() => useFocus(), {
      wrapper: FocusRoot,
    });

    expect(result.current.isFocused('root')).toBe(true);
    expect(result.current.isFocused('pizza')).toBe(false);
  });

  it('isFocusedExact should return the expected values', () => {
    const { result } = renderHook(() => useFocus(), {
      wrapper: FocusRoot,
    });

    expect(result.current.isFocused('root')).toBe(true);
    expect(result.current.isFocused('pizza')).toBe(false);
  });
});
