import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import MovePanel from './MovePanel';

function MovePanelContainer(props) {
  const isMobile = useMedia(['(max-width: 640px)'], [true], false);

  const [isOpen, currentWidth, pageLabels, shouldClearMovePanelOnClose, isInDesktopOnlyMode, isProcessingMoveResults] = useSelector((state) => [
    selectors.isElementOpen(state, 'movePanel'),
    selectors.getMovePanelWidth(state),
    selectors.getPageLabels(state),
    selectors.shouldClearMovePanelOnClose(state),
    selectors.isInDesktopOnlyMode(state),
    selectors.isProcessingMoveResults(state),
  ], shallowEqual);

  const dispatch = useDispatch();
  const closeMovePanel = React.useCallback(function closeMovePanel() {
    dispatch(actions.closeElements(['movePanel']));
  }, [dispatch]);

  const clearMoveInputValue = React.useCallback(function clearMoveInputValue() {
    dispatch(actions.setMoveValue(''));
  }, [dispatch]);

  const setNextResultValue = React.useCallback(function setNextResultValue(moveResults) {
    dispatch(actions.setNextResultValue(moveResults));
  }, [dispatch]);

  const setActiveResult = React.useCallback(function setActiveResult(result) {
    core.setActiveSearchResult(result);
  }, []);

  /*
  React.useEffect(function MovePanelVisibilityChangedEffect() {
    function clearMoveResultsOnPanelClose(event) {
      if (!event && !event.detail) {
        return;
      }
      const { detail } = event;
      if (detail.element === 'movePanel' && detail.isVisible === false) {
        // clear move results when move panel is closed
        core.clearMoveResults();
        clearMoveInputValue();
      }
    }
    if (isMobile) {
      // for mobile we want to keep results in panel as move panel is on top of the content
      // and user will need to close the panel to view the content.
      return;
    }
    if (!shouldClearMovePanelOnClose) {
      return;
    }
    window.addEventListener('visibilityChanged',  clearMoveResultsOnPanelClose);
    return function MovePanelVisibilityChangedEffectCleanUp() {
      window.removeEventListener('visibilityChanged',  clearMoveResultsOnPanelClose);
    };
  }, [isMobile, clearMoveInputValue, shouldClearMovePanelOnClose]);
   */

  React.useEffect(function clearMoveResult() {
    if (!isInDesktopOnlyMode && isMobile) {
      // for mobile we want to keep results in panel as move panel is on top of the content
      // and user will need to close the panel to view the content.
      return;
    }

    if (!isOpen && shouldClearMovePanelOnClose) {
      core.clearMoveResults();
      clearMoveInputValue();
    }
  }, [isMobile, isOpen, shouldClearMovePanelOnClose, isInDesktopOnlyMode]);

  const combinedProps = {
    ...props,
    isOpen,
    currentWidth,
    pageLabels,
    closeMovePanel,
    setActiveResult,
    setNextResultValue,
    isMobile,
    isInDesktopOnlyMode,
    isProcessingMoveResults
  };

  return (
    <MovePanel {...combinedProps} />
  );
}

export default MovePanelContainer;
