import { renderHook } from 'react-hooks-testing-library';
import { useSetFocus, FocusRoot } from '../src';

describe('useSetFocus()', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useSetFocus(), {
      wrapper: FocusRoot,
    });

    expect(typeof result.current).toEqual('function');
  });
});
