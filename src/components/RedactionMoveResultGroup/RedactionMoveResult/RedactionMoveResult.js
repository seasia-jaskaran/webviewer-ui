import React from 'react';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon';
import './RedactionMoveResult.scss';
import classNames from 'classnames';
import { redactionTypeMap } from 'constants/redactionTypes';

// Alternatively wrap this in useCallback and declare inside component
const displayRedactionMoveResult = (props) => {
  const { ambientStr, resultStrStart, resultStrEnd, resultStr, type } = props;
  if (type === redactionTypeMap['TEXT']) {
    const moveValue = ambientStr === '' ? resultStr : ambientStr.slice(resultStrStart, resultStrEnd);
    const textBeforeMoveValue = ambientStr.slice(0, resultStrStart);
    const textAfterMoveValue = ambientStr.slice(resultStrEnd);
    return (
      <>
        {textBeforeMoveValue}
        <span className="move-value">{moveValue}</span>
        {textAfterMoveValue}
      </>
    );
  }
  return resultStr;
};

const RedactionMoveResult = (props) => {
  const {
    isChecked,
    onChange,
    onClickResult,
    isActive,
    icon,
  } = props;

  const displayResult = displayRedactionMoveResult(props);
  const moveResultClassname = classNames('redaction-move-result', { active: isActive });

  return (
    <div className={moveResultClassname} role="listitem" onClick={onClickResult}>
      <div style={{ paddingRight: '14px' }}>
        <Choice
          checked={isChecked}
          onChange={onChange}
        />
      </div>
      <div style={{ paddingRight: '14px' }}>
        <Icon glyph={icon} />
      </div>
      <div className="redaction-move-result-info">
        {displayResult}
      </div>
    </div >
  );
};

export default React.memo(RedactionMoveResult);