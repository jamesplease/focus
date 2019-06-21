import { useContext } from 'react';
import FocusContext from './focus-context';

export default function useFocus() {
  const { setFocus } = useContext(FocusContext);

  return setFocus;
}
