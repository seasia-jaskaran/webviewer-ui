import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import RedactionMoveResultGroup from 'components/RedactionMoveResultGroup';
import Spinner from 'components/Spinner';
import './RedactionMoveResults.scss';
import classNames from 'classnames';
import { Virtuoso } from 'react-virtuoso';
import MoveStatus from 'constants/moveStatus';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';

function RedactionMoveResults(props) {
  const {
    redactionMoveResults,
    moveStatus,
    onCancelMove,
    isProcessingRedactionResults,
    markSelectedResultsForRedaction,
    redactSelectedResults,
  } = props;

  const { t } = useTranslation();
  const [redactionMoveResultPageMap, setRedactionMoveResultPageMap] = useState({});
  const [selectedMoveResultIndexesMap, setSelectedMoveResultIndexesMap] = useState({});
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  // The following prop is needed only for the tests to actually render a list of results
  // it only is ever injected in the tests
  const { isTestMode } = useContext(RedactionPanelContext);


  useEffect(() => {
    const redactionMoveResultPageMap = {};
    redactionMoveResults.forEach((result, index) => {
      const pageNumber = result.pageNum;
      result.index = index;
      if (redactionMoveResultPageMap[pageNumber] === undefined) {
        redactionMoveResultPageMap[pageNumber] = [result];
      } else {
        redactionMoveResultPageMap[pageNumber] = [...redactionMoveResultPageMap[pageNumber], result];
      }
    });

    setRedactionMoveResultPageMap(redactionMoveResultPageMap);

    const selectedIndexesMap = {};
    redactionMoveResults.forEach((value, index) => {
      selectedIndexesMap[index] = false;
    });
    setSelectedMoveResultIndexesMap(selectedIndexesMap);
  }, [redactionMoveResults]);


  useEffect(() => {
    const selectedIndexes = redactionMoveResults.filter((redactionMoveResult, index) => {
      return selectedMoveResultIndexesMap[index];
    });

    setSelectedIndexes(selectedIndexes);
  }, [selectedMoveResultIndexesMap]);


  const renderMoveResults = () => {
    const resultGroupPageNumbers = Object.keys(redactionMoveResultPageMap);
    if (resultGroupPageNumbers.length > 0) {
      // Needed for the tests to actually render a list of results
      const testModeProps = isTestMode ? { initialItemCount: resultGroupPageNumbers.length } : {};
      return (
        <Virtuoso
          data={resultGroupPageNumbers}
          itemContent={(index, pageNumber) => {
            return (
              <RedactionMoveResultGroup
                key={index}
                pageNumber={pageNumber}
                moveResults={redactionMoveResultPageMap[pageNumber]}
                selectedMoveResultIndexes={selectedMoveResultIndexesMap}
                setSelectedMoveResultIndexes={setSelectedMoveResultIndexesMap}
              />);
          }}
          {...testModeProps}
        />);
    }
  };

  const renderStartMove = () => (
    <div aria-label={t('redactionPanel.move.start')}>
      {t('redactionPanel.move.start')}
    </div>
  );

  const noResults = (
    <div aria-label={t('message.noResults')}>
      {t('message.noResults')}
    </div>
  );

  const renderMoveInProgress = () => (
    <div >
      <Spinner height="25px" width="25px" />
    </div>
  );

  const onCancelHandler = () => {
    setRedactionMoveResultPageMap({});
    onCancelMove();
  };

  const selectAllResults = () => {
    const moveResultIndexMap = {};
    redactionMoveResults.forEach((value, index) => {
      moveResultIndexMap[index] = true;
    });
    setSelectedMoveResultIndexesMap(moveResultIndexMap);
  };

  const unselectAllResults = () => {
    const moveResultIndexMap = {};
    redactionMoveResults.forEach((value, index) => {
      moveResultIndexMap[index] = false;
    });
    setSelectedMoveResultIndexesMap(moveResultIndexMap);
  };

  const onMarkAllForRedaction = () => {
    markSelectedResultsForRedaction(selectedIndexes);
    onCancelMove();
  };

  const onRedactSelectedResults = () => {
    redactSelectedResults(selectedIndexes);
  };

  const isEmptyList = redactionMoveResults.length === 0;

  const resultsContainerClass = classNames('redaction-move-results-container', { emptyList: isEmptyList });
  const redactAllButtonClass = classNames('redact-all-selected', { disabled: selectedIndexes.length === 0 });
  const markAllForRedactionButtonClass = classNames('mark-all-selected', { disabled: selectedIndexes.length === 0 });
  const shouldShowResultsCounterOptions = (moveStatus === MoveStatus['MOVE_DONE'] && !isProcessingRedactionResults) || moveStatus === MoveStatus['MOVE_NOT_INITIATED'];

  return (
    <>
      <div className="redaction-move-counter-controls">
        {moveStatus === MoveStatus['MOVE_IN_PROGRESS'] && (
          <div style={{ flexGrow: 1 }}>
            <Spinner height="18px" width="18px" />
          </div>)}
        {shouldShowResultsCounterOptions && (
          <>
            <div className="redaction-move-results-counter">
              <span>{t('redactionPanel.moveResults')}</span> ({redactionMoveResults.length})
            </div>
            <button
              onClick={selectAllResults}
              disabled={isEmptyList}
              aria-label={t('action.selectAll')}
            >
              {t('action.selectAll')}
            </button>
            <button
              disabled={isEmptyList}
              onClick={unselectAllResults}
              aria-label={t('action.unselect')}
            >
              {t('action.unselect')}
            </button>
          </>)}
      </div>
      <div className={resultsContainerClass} role="list">
        {moveStatus === MoveStatus['MOVE_NOT_INITIATED'] && renderStartMove()}
        {(moveStatus === MoveStatus['MOVE_IN_PROGRESS'] && isEmptyList && isProcessingRedactionResults) && renderMoveInProgress()}
        {moveStatus === MoveStatus['MOVE_DONE'] && isEmptyList && !isProcessingRedactionResults && noResults}
        {(moveStatus === MoveStatus['MOVE_IN_PROGRESS'] || moveStatus === MoveStatus['MOVE_DONE']) && renderMoveResults()}
      </div>
      <div className="redaction-move-panel-controls" >
        <button
          onClick={onCancelHandler}
          aria-label={t('action.cancel')}
          className="cancel"
        >
          {t('action.cancel')}
        </button>
        <button
          disabled={selectedIndexes.length === 0}
          aria-label={t('annotation.redact')}
          className={redactAllButtonClass}
          onClick={onRedactSelectedResults}
        >
          {t('annotation.redact')}
        </button>
        <button
          disabled={selectedIndexes.length === 0}
          aria-label={t('action.addMark')}
          className={markAllForRedactionButtonClass}
          onClick={onMarkAllForRedaction}
        >
          {t('action.addMark')}
        </button>
      </div >
    </>
  );
}

export default RedactionMoveResults;
