import React from 'react';
import PropTypes from 'prop-types';
import core from 'core';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';

import Icon from 'components/Icon';
import Choice from '../Choice/Choice';
import Spinner from '../Spinner';
import './MoveOverlay.scss';

const propTypes = {
  isPanelOpen: PropTypes.bool,
  isMoveOverlayDisabled: PropTypes.bool,
  moveValue: PropTypes.string,
  moveStatus: PropTypes.oneOf(['MOVE_NOT_INITIATED', 'MOVE_IN_PROGRESS', 'MOVE_DONE']),
  isCaseSensitive: PropTypes.bool,
  isWholeWord: PropTypes.bool,
  isWildcard: PropTypes.bool,
  moveResults: PropTypes.arrayOf(PropTypes.object),
  activeResultIndex: PropTypes.number,
  setMoveValue: PropTypes.func.isRequired,
  setCaseSensitive: PropTypes.func.isRequired,
  setMoveStatus: PropTypes.func.isRequired,
  setWholeWord: PropTypes.func.isRequired,
  setWildcard: PropTypes.func.isRequired,
  executeMove: PropTypes.func.isRequired,
  selectNextResult: PropTypes.func,
  selectPreviousResult: PropTypes.func,
  isProcessingMoveResults: PropTypes.bool
};

function MoveOverlay(props) {
  const { t } = useTranslation();
  const { isMoveOverlayDisabled, moveResults, activeResultIndex, selectNextResult, selectPreviousResult, isProcessingMoveResults } = props;
  const { moveValue, setMoveValue, executeMove, replaceValue, nextResultValue, setReplaceValue } = props;
  const { isCaseSensitive, setCaseSensitive, isWholeWord, setWholeWord, isWildcard, setWildcard, setMoveStatus, isMoveInProgress, setIsMoveInProgress } = props;
  const { moveStatus, isPanelOpen } = props;
  const [isReplaceBtnDisabled, setReplaceBtnDisabled] = React.useState(true);
  const [isReplaceAllBtnDisabled, setReplaceAllBtnDisabled] = React.useState(true);
  const [isMoreOptionsOpen, setMoreOptionOpen] = React.useState(true);
  const [showReplaceSpinner, setShowReplaceSpinner] = React.useState(false);

  const isMoveAndReplaceDisabled = useSelector((state) => selectors.isElementDisabled(state, 'moveAndReplace'));
  const moveTextInputRef = React.useRef();
  const waitTime = 300; // Wait time in milliseconds

  React.useEffect(() => {
    if (moveTextInputRef.current && isPanelOpen) {
      moveTextInputRef.current.focus();
    }
  }, [isPanelOpen]);

  React.useEffect(() => {
    if (moveValue && moveValue.length > 0) {
      executeMove(moveValue, {
        caseSensitive: isCaseSensitive,
        wholeWord: isWholeWord,
        wildcard: isWildcard,
      });
    } else {
      clearMoveResult();
    }
  }, [isCaseSensitive, isWholeWord, isWildcard]);

  const debouncedMove = React.useCallback(
    debounce((moveValue) => {
      if (moveValue && moveValue.length > 0) {
        setIsMoveInProgress(true);
        executeMove(moveValue, {
          caseSensitive: isCaseSensitive,
          wholeWord: isWholeWord,
          wildcard: isWildcard,
        });
      } else {
        clearMoveResult();
      }
    }, waitTime),
    [isCaseSensitive, isWholeWord, isWildcard]
  );

  const textInputOnChange = (event) => {
    setMoveValue(event.target.value);
    debouncedMove(event.target.value);

    if (event.target.value && replaceValue) {
      setReplaceBtnDisabled(false);
      setReplaceAllBtnDisabled(false);
    }
  };

  const replaceTextInputOnChange = (event) => {
    setReplaceValue(event.target.value);
    if (event.target.value && moveValue) {
      setReplaceBtnDisabled(false);
      setReplaceAllBtnDisabled(false);
    }
  };

  function clearMoveResult() {
    // core.clearMoveResults();
    setMoveValue('');
    setMoveStatus('MOVE_NOT_INITIATED');
    setReplaceValue('');
    setReplaceBtnDisabled(true);
    setReplaceAllBtnDisabled(true);
  }

  const caseSensitiveMoveOptionOnChange = React.useCallback(
    function caseSensitiveMoveOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setCaseSensitive(isChecked);
    }, [],
  );

  const wholeWordMoveOptionOnChange = React.useCallback(
    function wholeWordMoveOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setWholeWord(isChecked);
    }, [],
  );

  const wildcardOptionOnChange = React.useCallback(
    function wildcardOptionOnChangeCallback(event) {
      const isChecked = event.target.checked;
      setWildcard(isChecked);
    }, [],
  );

  const nextButtonOnClick = React.useCallback(
    function nextButtonOnClickCallback() {
      if (selectNextResult) {
        selectNextResult(moveResults, activeResultIndex);
      }
    },
    [selectNextResult, moveResults, activeResultIndex],
  );

  const previousButtonOnClick = React.useCallback(
    function previousButtonOnClickCallback() {
      if (selectPreviousResult) {
        selectPreviousResult(moveResults, activeResultIndex);
      }
    },
    [selectPreviousResult, moveResults, activeResultIndex],
  );

  const moveAndReplaceAll = React.useCallback(
    async function moveAndReplaceAllCallback() {
      if (isReplaceAllBtnDisabled && nextResultValue) {
        return;
      }
      setShowReplaceSpinner(true);
      await window.instance.Core.ContentEdit.moveAndReplaceText({
        documentViewer: window.instance.Core.documentViewer,
        moveResults: core.getPageMoveResults(),
        replaceWith: replaceValue,
      });
      setShowReplaceSpinner(false);
    },
    [replaceValue]
  );

  const toggleMoreOptionsBtn = () => {
    window.localStorage.setItem('moveMoreOption', !isMoreOptionsOpen);
    setMoreOptionOpen(!isMoreOptionsOpen);
  };

  const moveAndReplaceOne = React.useCallback(
    async function moveAndReplaceOneCallback() {
      if (isReplaceBtnDisabled && nextResultValue) {
        return;
      }
      setShowReplaceSpinner(true);

      await window.instance.Core.ContentEdit.moveAndReplaceText({
        documentViewer: window.instance.Core.documentViewer,
        replaceWith: replaceValue,
        moveResults: [core.getActiveMoveResult()],
      });

      setShowReplaceSpinner(false);
    },
    [replaceValue, nextResultValue, isReplaceBtnDisabled]
  );

  const dispatch = useDispatch();

  const replaceAllConfirmationWarning = () => {
    const title = t('option.movePanel.replaceText');
    const message = t('option.movePanel.confirmMessageReplaceAll');
    const confirmationWarning = {
      message,
      title,
      confirmBtnText: t('option.movePanel.confirm'),
      onConfirm: () => {
        moveAndReplaceAll();
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  const replaceOneConfirmationWarning = () => {
    const title = t('option.movePanel.replaceText');
    const message = t('option.movePanel.confirmMessageReplaceOne');
    const confirmationWarning = {
      message,
      title,
      confirmBtnText: t('option.movePanel.confirm'),
      onConfirm: () => {
        moveAndReplaceOne();
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  if (isMoveOverlayDisabled) {
    return null;
  }
  const numberOfResultsFound = moveResults ? moveResults.length : 0;

  const showSpinner = (isMoveInProgress)
    ? <Spinner />
    : (moveStatus === 'MOVE_DONE' && !isProcessingMoveResults)
      ? (<div>{numberOfResultsFound} {t('message.numResultsFound')}</div>)
      : <Spinner />;


  const moveOptionsComponents = (<div className="options">
    <Choice
      dataElement="caseSensitiveMoveOption"
      id="case-sensitive-option"
      checked={isCaseSensitive}
      onChange={caseSensitiveMoveOptionOnChange}
      label={t('option.movePanel.caseSensitive')}
      tabIndex={isPanelOpen ? 0 : -1}
    />
    <Choice
      dataElement="wholeWordMoveOption"
      id="whole-word-option"
      checked={isWholeWord}
      onChange={wholeWordMoveOptionOnChange}
      label={t('option.movePanel.wholeWordOnly')}
      tabIndex={isPanelOpen ? 0 : -1}
    />
    <Choice
      dataElement="wildCardMoveOption"
      id="wild-card-option"
      checked={isWildcard}
      onChange={wildcardOptionOnChange}
      label={t('option.movePanel.wildcard')}
      tabIndex={isPanelOpen ? 0 : -1}
    />
  </div>);

  return (
    <div className="MoveOverlay">
      <div className="input-container">
        Kartik Singla
        {/* <input
          ref={moveTextInputRef}
          type="text"
          autoComplete="off"
          onChange={textInputOnChange}
          value={moveValue}
          placeholder={t('message.moveDocumentPlaceholder')}
          aria-label={t('message.moveDocumentPlaceholder')}
          id="MovePanel__input"
          tabIndex={isPanelOpen ? 0 : -1}
        />
        {(moveValue !== undefined) && moveValue.length > 0 && (
          <button
            className="clearMove-button"
            onClick={clearMoveResult}
            aria-label={t('message.moveDocumentPlaceholder')}
          >
            <Icon glyph="icon-header-clear-move" />
          </button>
        )
        }
      </div>
      {
        (isMoveAndReplaceDisabled) ? null :
          (isMoreOptionsOpen)
            ? <div className="extra-options">
              <button className='Button' onClick={toggleMoreOptionsBtn}>{t('option.movePanel.lessOptions')} <Icon glyph="icon-chevron-up"/></button>
            </div>
            : <div className="extra-options">
              <button className='Button' onClick={toggleMoreOptionsBtn}>{t('option.movePanel.moreOptions')} <Icon glyph="icon-chevron-down"/></button>
            </div>
      }
      {
        (!isMoreOptionsOpen) ? moveOptionsComponents :
          <div>
            {moveOptionsComponents}
            {
              (isMoveAndReplaceDisabled) ? null :
                <div data-element="moveAndReplace" className='replace-options'>
                  <p>{t('option.movePanel.replace')}</p>
                  <div className='input-container'>
                    <input type={'text'}
                      onChange={replaceTextInputOnChange}
                      value={replaceValue}
                    />
                  </div>
                  <div className='replace-buttons'>
                    { (showReplaceSpinner) ? <Spinner width={25} height={25} /> : null }
                    <button className='Button btn-replace-all' disabled={isReplaceAllBtnDisabled}
                      onClick={replaceAllConfirmationWarning}>{t('option.movePanel.replaceAll')}</button>
                    <button className='Button btn-replace' disabled={isReplaceBtnDisabled || !nextResultValue || !core.getActiveMoveResult()}
                      onClick={replaceOneConfirmationWarning}>{t('option.movePanel.replace')}</button>
                  </div>
                </div>
            }
          </div>
      }

      <div className="divider" />
      <div className="footer">
        {moveStatus === 'MOVE_NOT_INITIATED' || '' ? null : showSpinner}
        {numberOfResultsFound > 0 && (
          <div className="buttons">
            <button className="button" onClick={previousButtonOnClick} aria-label={t('action.prevResult')}>
              <Icon className="arrow" glyph="icon-chevron-left" />
            </button>
            <button className="button" onClick={nextButtonOnClick} aria-label={t('action.nextResult')}>
              <Icon className="arrow" glyph="icon-chevron-right" />
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}

MoveOverlay.propTypes = propTypes;

export default MoveOverlay;
