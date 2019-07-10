import { useContext } from 'react';
import FocusContext from './focus-context';

export default function useSetFocus() {
  const { setFocus } = useContext(FocusContext);

  return setFocus;
}
