import selectors from 'selectors/index';
import actions from 'actions/index';
import { connect } from 'react-redux';
import React from 'react';
import MoveOverlayContainer from './MoveOverlayContainer';

const mapStateToProps = (state) => ({
  isMoveOverlayDisabled: selectors.isElementDisabled(state, 'moveOverlay'),
  moveValue: selectors.getMoveValue(state),
  replaceValue: selectors.getReplaceValue(state),
  nextResultValue: selectors.getNextResultValue(state),
  isCaseSensitive: selectors.isCaseSensitive(state),
  isWholeWord: selectors.isWholeWord(state),
  isWildcard: selectors.isWildcard(state),
  isProcessingMoveResults: selectors.isProcessingMoveResults(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setMoveValue: actions.setMoveValue,
  setReplaceValue: actions.setReplaceValue,
  setCaseSensitive: actions.setCaseSensitive,
  setWholeWord: actions.setWholeWord,
  setWildcard: actions.setWildcard,
};

function MoveOverlayRedux(props) {
  // return (<>Kartik Singla</>);
  return (<MoveOverlayContainer {...props} />);

}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoveOverlayRedux);
