/**
 * Movees the document one by one for the text matching moveValue. To go to the next result this
 * function must be called again. Once document end is reach it will jump back to the first found result.
 *
 * @method UI.moveText
 * @param {string} searchValue The text value to look for.
 * @param {object} [options] Search options.
 * @param {boolean} [options.caseSensitive=false] Search with matching cases.
 * @param {boolean} [options.wholeWord=false] Search whole words only.
 * @param {boolean} [options.wildcard=false] Search a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Search for a regex string. For example, www(.*)com.
 * @param {boolean} [options.searchUp=false] Search up the document (backwards).
 * @param {boolean} [options.ambientString=false] Get the ambient string in the result.
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.searchText('test', {
        caseSensitive: true,
        wholeWord: true
      });
    });
  });
 */

  import core from 'core';
  import actions from 'actions';
  import { getMoveListeners } from 'helpers/move';
  
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
    if (options.moveUp) {
      moveMode |= MoveMode.SEARCH_UP;
    }
    if (options.ambientString) {
      moveMode |= MoveMode.AMBIENT_STRING;
    }
    return moveMode;
  }
  
  export default function moveText(dispatch) {
    return function moveText(moveValue, options) {
      let moveOptions = {};
      if (typeof options === 'string') {
        const modes = options.split(',');
        modes.forEach((mode) => {
          moveOptions[lowerCaseFirstLetter(mode)] = true;
        });
      } else {
        moveOptions = { ...options };
      }
  
      const moveMode = buildMoveModeFlag(moveOptions);
  
      if (dispatch) {
        // dispatch is only set when doing move through API (instance.moveText())
        // When triggering move through UI, then redux updates are already handled inside component
        dispatch(actions.openElement('movePanel'));
        dispatch(actions.moveText(moveValue, moveOptions));
      }
  
      function onResult(result) {
        core.displayMoveResult(result);
        core.setActiveMoveResult(result);
        const optionsForMoveListener = {
          // default values
          caseSensitive: false,
          wholeWord: false,
          wildcard: false,
          regex: false,
          moveUp: false,
          ambientString: false,
          // override values with those user gave
          ...moveOptions,
        };
        const moveListeners = getMoveListeners() || [];
        moveListeners.forEach((listener) => {
          try {
            listener(moveValue, optionsForMoveListener, [result]);
          } catch (e) {
            console.error(e);
          }
        });
      }
  
      function onDocumentEnd() {
        core.getDocumentViewer().trigger('endOfDocumentResult', true);
      }
      function handleMoveError(error) {
        console.error(error);
      }
      const textMoveInitOptions = {
        'fullMove': false,
        onResult,
        onDocumentEnd,
        'onError': handleMoveError,
      };
  
      core.textMoveInit(moveValue, moveMode, textMoveInitOptions);
    };
  }
  
  
  const lowerCaseFirstLetter = (mode) => `${mode.charAt(0).toLowerCase()}${mode.slice(1)}`;
  