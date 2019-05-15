import { useRef, useEffect } from 'react';
import _ from 'lodash';

const keyToBindingMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ' ': 'select',
  Enter: 'select',
};

export default function useLrud(lrudMapping = {}, active, inputThrottle = 330) {
  const eventHandler = useRef();
  const lrudMappingRef = useRef(lrudMapping);
  const activeRef = useRef(active);

  useEffect(() => {
    lrudMappingRef.current = lrudMapping;
  }, [lrudMapping]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  if (!eventHandler.current) {
    eventHandler.current = _.throttle(function(e) {
      // This may not be necessary, but...just in case!
      if (!activeRef.current) {
        return;
      }

      const bindingName = keyToBindingMap[e.key];
      const binding = lrudMappingRef.current[bindingName];

      if (typeof binding === 'function') {
        e.preventDefault();
        e.stopPropagation();

        binding();
      }
    }, inputThrottle);
  }

  useEffect(() => {
    if (active) {
      window.addEventListener('keydown', eventHandler.current);
    } else {
      window.removeEventListener('keydown', eventHandler.current);
    }
  }, [active]);
}
