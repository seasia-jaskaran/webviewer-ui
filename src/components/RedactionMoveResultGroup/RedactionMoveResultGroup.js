import React, { useCallback, useEffect, useState } from 'react';
import RedactionMoveResult from './RedactionMoveResult';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';
import CollapsiblePanelGroup from 'components/CollapsiblePanelGroup';
import './RedactionMoveResultGroup.scss';

const RedactionMoveResultGroup = (props) => {
  const {
    pageNumber,
    moveResults,
    selectedMoveResultIndexes,
    setSelectedMoveResultIndexes,
  } = props;

  const { t } = useTranslation();
  const groupResultIndexes = moveResults.map((result) => result.index);
  const [allItemsChecked, setAllItemsChecked] = useState(false);

  useEffect(() => {
    const allResultsSelected = groupResultIndexes.reduce((allSelected, currentIndex) => {
      return selectedMoveResultIndexes[currentIndex] && allSelected;
    }, true);

    setAllItemsChecked(allResultsSelected);
  }, [selectedMoveResultIndexes, groupResultIndexes]);

  const checkAllResults = useCallback((event) => {
    const checked = event.target.checked;
    groupResultIndexes.forEach((resultIndex) => {
      selectedMoveResultIndexes[resultIndex] = checked;
    });
    setAllItemsChecked(checked);
    setSelectedMoveResultIndexes({ ...selectedMoveResultIndexes });
  }, [selectedMoveResultIndexes, groupResultIndexes]);

  const checkResult = useCallback((event, index) => {
    const checked = event.target.checked;
    selectedMoveResultIndexes[index] = checked;
    setSelectedMoveResultIndexes({ ...selectedMoveResultIndexes });
  }, [selectedMoveResultIndexes]);

  const header = () => {
    return (
      <Choice
        checked={allItemsChecked}
        onChange={checkAllResults}
        label={`${t('option.shared.page')} ${pageNumber}`}
        className="redaction-move-results-page-number"
      />
    );
  };

  const style = {
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '4px',
  };

  return (
    <CollapsiblePanelGroup header={header} role="row" style={style}>
      <div role="list">
        {moveResults.map((moveResult, index) => (
          <RedactionMoveResult
            checked={selectedMoveResultIndexes[moveResult.index]}
            checkResult={checkResult}
            moveResult={moveResult}
            key={`${index}-${pageNumber}`}
          />)
        )}
      </div>
    </CollapsiblePanelGroup>
  );
};

export default RedactionMoveResultGroup;