import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import { redactionTypeMap } from 'constants/redactionTypes';
import MoveStatus from 'constants/moveStatus';

function useOnRedactionMoveCompleted() {
  const [moveStatus, setMoveStatus] = useState(MoveStatus['MOVE_NOT_INITIATED']);
  const [redactionMoveResults, setRedactionMoveResults] = useState([]);
  const [isProcessingRedactionResults, setIsProcessingRedactionResults] = useState(false);
  const redactionMovePatterns = useSelector((state) => selectors.getRedactionMovePatterns(state), shallowEqual);

  const movePatterns = useMemo(() => {
    return Object.keys(redactionMovePatterns).reduce((map, key) => {
      const { regex, type, icon } = redactionMovePatterns[key];
      map[type] = {
        regex,
        icon
      };
      return map;
    }, {});
  }, [redactionMovePatterns]);

  const mapResultToType = useCallback((result) => {
    // Iterate through the patterns and return the first match
    const { resultStr } = result;
    const movePatternKeys = Object.keys(movePatterns);

    const resultType = movePatternKeys.find((key) => {
      const { regex } = movePatterns[key];
      return regex.test(resultStr);
    });

    // If it didn't match any of the patterns, return the default type which is text
    result.type = resultType === undefined ? redactionTypeMap['TEXT'] : resultType;
    // And also set the icon to display in the panel. If no icon provided use the text icon
    const { icon = 'icon-form-field-text' } = movePatterns[result.type] || {};
    result.icon = icon;
    return result;
  }, [movePatterns]);// Dependency is an object but it is memoized so it will not re-create unless the patterns change

  const clearRedactionMoveResults = useCallback(() => {
    setRedactionMoveResults([]);
    core.clearMoveResults();
    setIsProcessingRedactionResults(false);
  });

  useEffect(() => {
    function onMoveResultsChanged(results) {
      const mappedResults = results.map(mapResultToType);
      setIsProcessingRedactionResults(true);
      setRedactionMoveResults(mappedResults);
    }

    core.addEventListener('moveResultsChanged', onMoveResultsChanged);
    return () => {
      core.removeEventListener('moveResultsChanged', onMoveResultsChanged);
    };
  }, [moveStatus]);

  useEffect(() => {
    function moveInProgressEventHandler(isMoveing) {
      if (isMoveing === undefined || isMoveing === null) {
        // if isMoveing is not passed at all, we consider that to mean that move was reset to original state
        setMoveStatus(MoveStatus['MOVE_NOT_INITIATED']);
      } else if (isMoveing) {
        setMoveStatus(MoveStatus['MOVE_IN_PROGRESS']);
      } else {
        setMoveStatus(MoveStatus['MOVE_DONE']);
        // Need a timeout due to timing issue as MOVE_DONE is fired
        // before final call to onMoveResultsChanged, otherwise we briefly show
        // the NO RESULTS message before showing actual results.
        setTimeout(() => {
          setIsProcessingRedactionResults(false);
        }, 100);
      }
    }

    core.addEventListener('moveInProgress', moveInProgressEventHandler);

    return () => {
      core.removeEventListener('moveInProgress', moveInProgressEventHandler);
    };
  }, []);

  return {
    redactionMoveResults,
    isProcessingRedactionResults,
    clearRedactionMoveResults,
    moveStatus,
  };
}

export default useOnRedactionMoveCompleted;