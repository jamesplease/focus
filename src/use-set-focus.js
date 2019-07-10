import { useContext } from 'react';
import FocusContext from './focus-context';

export default function useSetFocus() {
  const { focusTree } = useContext(FocusContext);
  return focusTree.setFocus;
}
