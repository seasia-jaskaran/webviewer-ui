import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MoveOverlay from './MoveOverlay';

export default {
  title: 'Components/MoveOverlay',
  component: MoveOverlay,
};

const initialState = {
  viewer: {
    disabledElements: {},
  }
};
function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);
/* eslint-disable no-console */
function executeMove() {
  console.log('Executing move');
}

function selectNextResult() {
  console.log('selectNextResult');
}

function selectPreviousResult() {
  console.log('selectPreviousResult');
}

export function Basic() {
  const [moveValue, setMoveValue] = React.useState('');
  const [isCaseSensitive, setCaseSensitive] = React.useState(false);
  const [isWholeWord, setWholeWord] = React.useState(false);
  const [isWildcard, setWildcard] = React.useState(false);
  const [moveStatus, setMoveStatus] = React.useState('MOVE_NOT_INITIATED');
  const [replaceValue, setReplaceValue] = React.useState('');
  const props = {
    moveValue,
    setMoveValue,
    isCaseSensitive,
    setCaseSensitive,
    isWholeWord,
    setWholeWord,
    isWildcard,
    setWildcard,
    executeMove,
    setMoveStatus,
    setReplaceValue,
    selectNextResult,
    selectPreviousResult
  };
  return (
    <Provider store={store}>
      <div style={{ width: 300 }}>
        <MoveOverlay {...props} />
      </div>
    </Provider>
  );
}
