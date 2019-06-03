import {
  createElement,
  forwardRef,
  useRef,
  useContext,
  useState,
  useEffect,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import FocusContext from './focus-context';

let uniqueValue = 0;

export function Focusable(
  {
    className = '',
    focusedClass = 'isFocused',
    focusedExactClass = 'isFocusedExact',

    nodeType = 'div',
    children,

    focusId,
    focusOnMount,
    wrapping,
    orientation,
    defaultChildFocusIndex,
    restoreActiveChildIndex,
    disabled,

    onKey,
    onArrow,
    onLeft,
    onRight,
    onUp,
    onDown,
    onSelect,
    onBack,
    onMove,

    ...rest
  },
  ref
) {
  const nodeRef = useRef();
  const idRef = useRef(null);

  if (idRef.current === null) {
    if (
      typeof focusId === 'string' &&
      focusId !== 'root' &&
      focusId.length > 0
    ) {
      idRef.current = focusId;
    } else {
      uniqueValue = uniqueValue + 1;
      idRef.current = `node_${uniqueValue}`;
    }
  }

  const parentProviderValue = useContext(FocusContext);
  const [providerValue, setProviderValue] = useState(() => {
    return {
      ...parentProviderValue,
      currentNodeId: idRef.current,
    };
  });

  const { nodes, createNode, destroyNode } = parentProviderValue;

  const possibleNode = nodes[idRef.current];
  const hasNode = Boolean(possibleNode);

  const hasNodeRef = useRef(hasNode);

  useEffect(() => {
    hasNodeRef.current = hasNode;
  }, [hasNode]);

  // TODO: verify that renders are as expected. Is it rendering too much?
  useEffect(() => {
    setProviderValue({
      ...parentProviderValue,
      currentNodeId: idRef.current,
    });
  }, [parentProviderValue]);

  const parentId = parentProviderValue.currentNodeId;

  useImperativeHandle(ref, () => nodeRef.current);

  const createdRef = useRef(false);

  if (!createdRef.current) {
    createdRef.current = true;

    setTimeout(() => {
      createNode(idRef.current, {
        parentId,
        focusOnMount,
        wrapping,
        orientation,
        defaultChildFocusIndex,
        restoreActiveChildIndex,
        children,
        disabled,

        onKey,
        onArrow,
        onLeft,
        onRight,
        onUp,
        onDown,
        onSelect,
        onBack,

        onMove,
      });
    });
  }

  const node = nodes[idRef.current] || {
    id: idRef.current,
    isFocused: false,
    isFocusedExact: false,
    children: null,
    activeChildIndex: null,
  };

  const { isFocused, isFocusedExact } = node;

  useEffect(() => {
    return () => {
      if (hasNodeRef.current) {
        destroyNode(idRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classString = `${className} ${isFocused ? focusedClass : ''} ${
    isFocusedExact ? focusedExactClass : ''
  }`;

  return createElement(
    FocusContext.Provider,
    {
      value: providerValue,
    },
    createElement(
      nodeType,
      {
        ...rest,
        disabled,
        ref: nodeRef,
        className: classString,
      },
      children
    )
  );
}

const ForwardedFocusable = forwardRef(Focusable);

ForwardedFocusable.propTypes = {
  className: PropTypes.string,
  focusedClass: PropTypes.string,
  focusedExactClass: PropTypes.string,

  nodeType: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  focusId: PropTypes.string,
  focusOnMount: PropTypes.bool,
  wrapping: PropTypes.bool,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  defaultChildFocusIndex: PropTypes.number,
  restoreActiveChildIndex: PropTypes.bool,
  disabled: PropTypes.bool,

  onKey: PropTypes.func,
  onArrow: PropTypes.func,
  onLeft: PropTypes.func,
  onRight: PropTypes.func,
  onUp: PropTypes.func,
  onDown: PropTypes.func,
  onSelect: PropTypes.func,
  onBack: PropTypes.func,
  onMove: PropTypes.func,
};

export default ForwardedFocusable;
