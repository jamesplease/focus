import { useContext } from 'react';
import FocusContext from './focus-context';

export default function useFocusTree() {
  const { focusTree } = useContext(FocusContext);
  return focusTree;
}
