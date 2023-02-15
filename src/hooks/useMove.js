import React from 'react';
import core from 'core';
import { useDispatch } from 'react-redux';
import actions from 'actions/index';

function useMove() {
  const [moveResults, setMoveResults] = React.useState([]);
  const [activeMoveResult, setActiveMoveResult] = React.useState();
  const [activeMoveResultIndex, setActiveMoveResultIndex] = React.useState(0);
  const [moveStatus, setMoveStatus] = React.useState('MOVE_NOT_INITIATED');
  const dispatch = useDispatch();

  React.useEffect(() => {
    // First time useMove is mounted we check if core has results
    // and if it has, we make sure those are set. This will make sure if external move is done
    // that the result will reflect on the UI those set in core
    // const coreMoveResults = core.getPageMoveResults() || [];
    // if (coreMoveResults.length > 0) {
    //   const activeMoveResult = core.getActiveMoveResult();
    //   if (activeMoveResult) {
    //     const newActiveMoveResultIndex = coreMoveResults.findIndex((moveResult) => {
    //       return core.isMoveResultEqual(moveResult, activeMoveResult);
    //     });
    //     setMoveResults(coreMoveResults);
    //     if (newActiveMoveResultIndex >= 0) {
    //       setActiveMoveResult(coreMoveResults[newActiveMoveResultIndex]);
    //       setActiveMoveResultIndex(newActiveMoveResultIndex);
    //     }
    //   } else {
    //     setMoveResults(coreMoveResults);
    //     setActiveMoveResult(coreMoveResults[0]);
    //     setActiveMoveResultIndex(0);
    //   }
    // }
  }, []);

  // React.useEffect(() => {
  //   function activeMoveResultChanged(newActiveMoveResult) {
  //     const coreMoveResults = core.getPageMoveResults() || [];
  //     const newActiveMoveResultIndex = coreMoveResults.findIndex((moveResult) => {
  //       return core.isMoveResultEqual(moveResult, newActiveMoveResult);
  //     });
  //     if (newActiveMoveResultIndex >= 0) {
  //       setActiveMoveResult(newActiveMoveResult);
  //       setActiveMoveResultIndex(newActiveMoveResultIndex);
  //     }
  //   }

  //   function moveResultsChanged(newMoveResults = []) {
  //     setMoveResults(newMoveResults);
  //     if (newMoveResults && newMoveResults.length === 0) {
  //       setActiveMoveResult(undefined);
  //       setActiveMoveResultIndex(-1);
  //     }
  //   }

  //   function moveInProgressEventHandler(isMoveing) {
  //     if (isMoveing === undefined || isMoveing === null) {
  //       // if isMoveing is not passed at all, we consider that to mean that move was reset to original state
  //       setMoveStatus('MOVE_NOT_INITIATED');
  //     } else if (isMoveing) {
  //       setMoveStatus('MOVE_IN_PROGRESS');
  //     } else {
  //       const defualtActiveMoveResult = core.getActiveMoveResult();

  //       if (defualtActiveMoveResult) {
  //         setActiveMoveResult(defualtActiveMoveResult);
  //         // In core default active move result is the first result
  //         const coreMoveResults = core.getPageMoveResults() || [];
  //         const newActiveMoveResultIndex = coreMoveResults.findIndex((moveResult) => {
  //           return core.isMoveResultEqual(moveResult, defualtActiveMoveResult);
  //         });
  //         setActiveMoveResultIndex(newActiveMoveResultIndex);
  //         dispatch(actions.setNextResultValue(defualtActiveMoveResult));
  //       }

  //       setMoveStatus('MOVE_DONE');
  //     }
  //   }
  //   core.addEventListener('activeMoveResultChanged', activeMoveResultChanged);
  //   core.addEventListener('moveResultsChanged', moveResultsChanged);
  //   core.addEventListener('moveInProgress', moveInProgressEventHandler);
  //   return function useMoveEffectCleanup() {
  //     core.removeEventListener('activeMoveResultChanged', activeMoveResultChanged);
  //     core.removeEventListener('moveResultsChanged', moveResultsChanged);
  //     core.removeEventListener('moveInProgress', moveInProgressEventHandler);
  //   };
  // }, [setActiveMoveResult, setActiveMoveResultIndex, setMoveStatus, dispatch]);

  return {
    moveStatus,
    moveResults,
    activeMoveResult,
    activeMoveResultIndex,
    setMoveStatus,
  };
}

export default useMove;
