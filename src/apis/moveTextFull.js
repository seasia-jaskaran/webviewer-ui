/**
 * Movees the full document for the texts matching moveValue.
 * @method UI.moveTextFull
 * @param {string} moveValue The text value to look for.
 * @param {object} [options] Move options.
 * @param {boolean} [options.caseSensitive=false] Move with matching cases.
 * @param {boolean} [options.wholeWord=false] Move whole words only.
 * @param {boolean} [options.wildcard=false] Move a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Move for a regex string. For example, www(.*)com.
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.moveTextFull('test', {
        wholeWord: true
      });
    });
  });
 */

  import actions from 'actions';
  import core from 'core';
  import { getMoveListeners } from 'helpers/move';
  
  const onResultThrottleTimeout = 100;
  let isStillProcessingResults = false;
  
  function buildMoveModeFlag(options = {}) {
    const MoveMode = core.getMoveMode();
    let moveMode = MoveMode.PAGE_STOP | MoveMode.HIGHLIGHT;
  
    if (options.caseSensitive) {
      moveMode |= MoveMode.CASE_SENSITIVE;
    }
    if (options.wholeWord) {
      moveMode |= MoveMode.WHOLE_WORD;
    }
    if (options.wildcard) {
      moveMode |= MoveMode.WILD_CARD;
    }
    if (options.regex) {
      moveMode |= MoveMode.REGEX;
    }
  
    moveMode |= MoveMode.AMBIENT_STRING;
  
    return moveMode;
  }
  
  export default function moveTextFull(store) {
    return function moveTextFull(moveValue, options) {
      const dispatch = store?.dispatch;
      if (dispatch) {
        // dispatch is only set when doing move through API (instance.moveText())
        // When triggering move through UI, then redux updates are already handled inside component
        dispatch(actions.openElement('movePanel'));
        dispatch(actions.moveTextFull(moveValue, options));
      }
  
      const moveMode = buildMoveModeFlag(options);
      let doneCallback = () => { };
  
      let hasActiveResultBeenSet = false;
      let throttleResults = [];
      let resultTimeout;
      function onResult(result) {
        throttleResults.push(result);
  
        if (!resultTimeout) {
          if (!isStillProcessingResults) {
            isStillProcessingResults = true;
          }
  
          resultTimeout = setTimeout(() => {
            core.displayAdditionalMoveResults(throttleResults);
            throttleResults = [];
            resultTimeout = null;
            doneCallback();
          }, onResultThrottleTimeout);
        }
  
        if (!hasActiveResultBeenSet) {
          // when full move is done, we make first found result to be the active result
  
          hasActiveResultBeenSet = true;
        }
      }
  
      function moveInProgressCallback(isMoveing) {
        // execute move listeners when move is complete, thus hooking functionality move in progress event.
        if (isMoveing === false) {
          doneCallback = () => {
            const results = core.getPageMoveResults();
            const moveOptions = {
              // default values
              caseSensitive: false,
              wholeWord: false,
              wildcard: false,
              regex: false,
              moveUp: false,
              ambientString: true,
              // override values with those user gave
              ...options,
            };
            const nextResultIndex = store?.getState().move?.nextResultIndex;
  
            const result = results[nextResultIndex];
            if (result) {
              core.setActiveMoveResult(result);
            }
            const moveListeners = getMoveListeners() || [];
            moveListeners.forEach((listener) => {
              try {
                listener(moveValue, moveOptions, results);
              } catch (e) {
                console.error(e);
              }
            });
          };
          isStillProcessingResults = false;
  
          if (!resultTimeout) {
            doneCallback();
          }
          core.removeEventListener('moveInProgress', moveInProgressCallback);
        }
      }
  
      function onDocumentEnd() { }
  
      function handleMoveError(error) {
        dispatch(actions.setProcessingMoveResults(false));
        console.error(error);
      }
      const textMoveInitOptions = {
        'fullMove': true,
        onResult,
        onDocumentEnd,
        'onError': handleMoveError,
      };
  
      core.clearMoveResults();
      core.textMoveInit(moveValue, moveMode, textMoveInitOptions);
      core.addEventListener('moveInProgress', moveInProgressCallback);
    };
  }
  