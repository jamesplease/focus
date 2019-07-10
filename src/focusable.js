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

function checkIfUpdateIsNecessary(one = {}, two = {}) {
  const focusChanged = Boolean(one.isFocused) !== Boolean(two.isFocused);
  const focusExactChanged =
    Boolean(one.isFocusedExact) !== Boolean(two.isFocusedExact);
  const disabledChanged = Boolean(one.disabled) !== Boolean(two.disabled);

  return focusChanged || focusExactChanged || disabledChanged;
}

export function Focusable(
  {
    className = '',
    focusedClass = 'isFocused',
    focusedExactClass = 'isFocusedExact',
    disabledClass = 'focusDisabled',

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
    onFocus,
    onBlur,

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
  const [providerValue] = useState(() => {
    return {
      focusTree: parentProviderValue.focusTree,
      currentNodeId: idRef.current,
    };
  });

  const focusTree = parentProviderValue.focusTree;
  const { nodes } = focusTree.getState();
  const { destroyNode, createNode, updateNode } = focusTree;

  const possibleNode = nodes[idRef.current];
  const hasNode = Boolean(possibleNode);

  const hasNodeRef = useRef(hasNode);

  useEffect(() => {
    hasNodeRef.current = hasNode;
  }, [hasNode]);

  const parentId = parentProviderValue.currentNodeId;

  useImperativeHandle(ref, () => nodeRef.current);

  // This node needs to be updated
  const [node, setNode] = useState(() => {
    return (
      nodes[idRef.current] || {
        id: idRef.current,
        isFocused: false,
        isFocusedExact: false,
        children: null,
        disabled: false,
        activeChildIndex: null,
      }
    );
  });

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
        onFocus,
        onBlur,

        onMove,
      });
    });
  }

  const focusNodeRef = useRef(node);
  useEffect(() => {
    focusNodeRef.current = node;
  }, [node]);

  useEffect(() => {
    const unsubscribe = focusTree.subscribe(() => {
      const state = focusTree.getState();
      const newNode = state.nodes[idRef.current] || focusNodeRef.current;

      if (checkIfUpdateIsNecessary(newNode, focusNodeRef.current)) {
        // This ref is updated whenever `setNode` resolves, but there can be a delay
        // between when that occurs. For that reason, we manually update it here to
        // ensure that subsequent calls are using the _actual_ up-to-date node.
        focusNodeRef.current = newNode;
        setNode(newNode);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isFocused, isFocusedExact } = node;

  useEffect(() => {
    return () => {
      if (hasNodeRef.current) {
        destroyNode(idRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasNodeRef.current) {
      updateNode(idRef.current, {
        disabled,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const classString = `${className} ${isFocused ? focusedClass : ''} ${
    isFocusedExact ? focusedExactClass : ''
  } ${disabled ? disabledClass : ''}`;

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
  disabledClass: PropTypes.string,

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
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default ForwardedFocusable;
