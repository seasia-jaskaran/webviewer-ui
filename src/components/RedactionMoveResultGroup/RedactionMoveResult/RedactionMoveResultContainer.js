import React, { useCallback, useContext } from 'react';
import RedactionMoveResult from './RedactionMoveResult';
import { RedactionPanelContext } from 'components/RedactionPanel/RedactionPanelContext';
import core from 'core';

const RedactionMoveResultContainer = (props) => {
  const {
    moveResult,
    checked,
    checkResult,
  } = props;

  const { activeMoveResultIndex } = useContext(RedactionPanelContext);

  const { ambientStr, resultStrStart, resultStrEnd, resultStr, icon, index, type } = moveResult;

  const onChange = useCallback((event) => {
    checkResult(event, index);
  }, [index, checkResult]);

  const onClickResult = useCallback(() => {
    core.setActiveMoveResult(moveResult);
  }, [moveResult]);

  return (
    <RedactionMoveResult
      ambientStr={ambientStr}
      resultStrStart={resultStrStart}
      resultStrEnd={resultStrEnd}
      resultStr={resultStr}
      icon={icon}
      type={type}
      isChecked={checked}
      onChange={onChange}
      onClickResult={onClickResult}
      isActive={activeMoveResultIndex === index}
    />
  );
};

export default RedactionMoveResultContainer;
