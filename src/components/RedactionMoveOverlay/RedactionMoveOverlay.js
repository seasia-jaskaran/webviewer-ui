import React from 'react';
import DataElementWrapper from '../DataElementWrapper';
import RedactionMoveMultiSelect from './RedactionMoveMultiSelect';
import { redactionTypeMap } from 'constants/redactionTypes';
import './RedactionMoveOverlay.scss';

const buildMoveOptions = (moveTerms) => {
  const options = {
    textMove: [],
  };

  if (!moveTerms) {
    return options;
  }

  moveTerms.forEach((moveTerm) => {
    const { type } = moveTerm;
    if (type === redactionTypeMap['TEXT']) {
      options.textMove.push(moveTerm.label);
    } else {
      options[type] = true;
    }
  });

  return options;
};

const RedactionMoveOverlay = (props) => {
  const {
    setIsRedactionMoveActive,
    moveTerms,
    setMoveTerms,
    executeRedactionMove,
    activeTheme,
    redactionMoveOptions,
  } = props;

  const handleChange = (updatedMoveTerms) => {
    setMoveTerms(updatedMoveTerms);
    const options = buildMoveOptions(updatedMoveTerms);
    executeRedactionMove(options);
  };

  const handleCreate = (newValue) => {
    const textTerm = {
      label: newValue,
      value: newValue,
      type: redactionTypeMap['TEXT']
    };
    // Initially move terms are null so we safeguard against this
    const nonNullMoveTerms = moveTerms || [];
    const updatedMoveTerms = [...nonNullMoveTerms, textTerm];
    setMoveTerms(updatedMoveTerms);
    const options = buildMoveOptions(updatedMoveTerms);
    executeRedactionMove(options);
  };

  const textInputOnKeyUp = (event) => {
    if (event.key === 'Enter') {
      const options = buildMoveOptions(moveTerms);
      executeRedactionMove(options);
    }
  };
  return (
    <DataElementWrapper
      className="RedactionMoveOverlay"
      dataElement="redactionMoveOverlay"
      onKeyUp={textInputOnKeyUp}
    >
      <RedactionMoveMultiSelect
        onFocus={() => setIsRedactionMoveActive(true)}
        value={moveTerms}
        onCreateOption={handleCreate}
        onChange={handleChange}
        activeTheme={activeTheme}
        redactionMoveOptions={redactionMoveOptions}
      />

    </DataElementWrapper>

  );
};

export default RedactionMoveOverlay;