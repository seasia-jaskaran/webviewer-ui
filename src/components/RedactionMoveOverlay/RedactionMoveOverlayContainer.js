import React, { useContext } from 'react';
import { useStore, useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';

import RedactionMoveOverlay from './RedactionMoveOverlay';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';
import multiMoveFactory from '../../helpers/multiMove';


function executeRedactionMove(options, store) {
  const multiMove = multiMoveFactory(store);
  multiMove(options);
}

const RedactionMoveOverlayContainer = (props) => {
  const { setIsRedactionMoveActive } = useContext(RedactionPanelContext);
  const store = useStore();
  const activeTheme = useSelector((state) => selectors.getActiveTheme(state));
  const redactionMovePatterns = useSelector((state) => selectors.getRedactionMovePatterns(state), shallowEqual);
  const redactionMoveOptions = Object.values(redactionMovePatterns).map((pattern) => ({
    ...pattern,
    value: pattern.type,
  }));

  return (
    <RedactionMoveOverlay
      setIsRedactionMoveActive={setIsRedactionMoveActive}
      executeRedactionMove={(options = {}) => executeRedactionMove(options, store)}
      activeTheme={activeTheme}
      redactionMoveOptions={redactionMoveOptions}
      {...props}
    />);
};

export default RedactionMoveOverlayContainer;