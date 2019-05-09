import { useContext, useEffect, useMemo, useRef } from 'react';
import FocusContext from './focus-context';
import matchFocusPath from './match-focus-path';

export default function useFocusPath(targetPath = '') {
  const { focusPath, setFocusPath } = useContext(FocusContext);

  const targetPathRef = useRef(targetPath);
  useEffect(() => {
    targetPathRef.current = targetPath;
  }, [targetPath]);

  const result = useMemo(() => {
    const { isFocused, isFocusedExact } = matchFocusPath({
      currentFocusPath: focusPath,
      testFocusPath: targetPath,
    })
  
    let childPath;
    if (!isFocused || targetPath === focusPath) {
      childPath = '';
    } else {
      childPath = focusPath.replace(`${targetPath}.`, '');
    }
  
    const stringChild = childPath.split('.')[0] || '';
    const numericChild = stringChild ? Number(stringChild) : '';
  
    const child = Number.isNaN(numericChild) ? stringChild : numericChild;
  
    function setFocusedChild(newChild) {
      setFocusPath(`${targetPathRef.current}.${newChild}`);
    }
  
    function setFocusedSibling(sibling) {
      const parts = targetPathRef.current.split('.');
  
      let parentPath;
      if (parts.length === 1) {
        parentPath = '';
      } else {
        parentPath = parts.slice(0, -1).join('.') + '.';
      }
  
      setFocusPath(`${parentPath}${sibling}`);
    }

    return {
      isFocused,
      isFocusedExact,
      child,
  
      focusPath,
      setFocusedChild,
      setFocusedSibling,
      setFocusPath,
    }
  }, [targetPath, focusPath, setFocusPath]);

  return result;
}
