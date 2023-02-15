import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import MoveOverlay from './MoveOverlay';
import { getOverrideMoveExecution } from 'helpers/move';
import moveTextFullFactory from '../../apis/moveTextFull';
import core from 'core';
import actions from 'actions/index';

// exported so that we can test these internal functions
export function executeMove(moveValue, options, store) {
  const moveOptions = {
    regex: false,
    ...options,
  };

  if (moveValue !== null && moveValue !== undefined) {
    // user can override move execution with instance.overrideMoveExecution()
    // Here we check if user has done that and call that rather than default move execution
    const overrideMoveExecution = getOverrideMoveExecution();
    if (overrideMoveExecution) {
      overrideMoveExecution(moveValue, moveOptions);
    } else {
      const moveTextFull = moveTextFullFactory(store);
      moveTextFull(moveValue, moveOptions);
    }
  }
}

export function selectNextResult(moveResults = [], activeResultIndex, dispatch) {
  if (moveResults.length > 0) {
    const nextResultIndex = activeResultIndex === moveResults.length - 1 ? 0 : activeResultIndex + 1;
    core.setActiveMoveResult(moveResults[nextResultIndex]);
    if (dispatch) {
      const nextIndex = (nextResultIndex > 0) ? nextResultIndex - 1 : 0;
      dispatch(actions.setNextResultValue(moveResults[nextResultIndex], nextIndex));
    }
  }
}

export function selectPreviousResult(moveResults = [], activeResultIndex, dispatch) {
  if (moveResults.length > 0) {
    const prevResultIndex = activeResultIndex <= 0 ? moveResults.length - 1 : activeResultIndex - 1;
    core.setActiveMoveResult(moveResults[prevResultIndex]);
    if (dispatch) {
      dispatch(actions.setNextResultValue(moveResults[prevResultIndex]));
    }
  }
}

function MoveOverlayContainer(props) {
  const dispatch = useDispatch();
  const store = useStore();
  return (
    // <>kartik</>
    <MoveOverlay
      executeMove={(moveValue, options = {}) => {
        executeMove(moveValue, options, store);
      }}
      selectNextResult={(moveResults = [], activeResultIndex) => {
        selectNextResult(moveResults, activeResultIndex, dispatch);
      }
      }
      selectPreviousResult={(moveResults = [], activeResultIndex) => {
        selectPreviousResult(moveResults, activeResultIndex, dispatch);
      }
      }
      {...props}
    />
  );
}

export default MoveOverlayContainer;
