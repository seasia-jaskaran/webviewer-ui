import React from 'react';
import { withContentRect } from 'react-measure';
import PropTypes from 'prop-types';
import './MoveResult.scss';
import VirtualizedList from 'react-virtualized/dist/commonjs/List';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import ListSeparator from 'components/ListSeparator';

const MoveResultListSeparatorPropTypes = {
  currentResultIndex: PropTypes.number.isRequired,
  moveResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
  pageLabels: PropTypes.arrayOf(PropTypes.any).isRequired,
  isProcessingMoveResults: PropTypes.bool
};

function MoveResultListSeparator(props) {
  const { currentResultIndex, moveResults, t, pageLabels } = props;

  const previousIndex = currentResultIndex === 0 ? currentResultIndex : currentResultIndex - 1;
  const currentListItem = moveResults[currentResultIndex];
  const previousListItem = moveResults[previousIndex];

  const isFirstListItem = previousListItem === currentListItem;
  const isInDifferentPage = previousListItem.pageNum !== currentListItem.pageNum;

  if (isFirstListItem || isInDifferentPage) {
    const listSeparatorText = `${t('option.shared.page')} ${pageLabels[currentListItem.pageNum - 1]}`;
    return (
      <div role="cell">
        <ListSeparator>{listSeparatorText}</ListSeparator>
      </div>
    );
  }
  return null;
}

MoveResultListSeparator.propTypes = MoveResultListSeparatorPropTypes;

const MoveResultListItemPropTypes = {
  result: PropTypes.object.isRequired,
  currentResultIndex: PropTypes.number.isRequired,
  activeResultIndex: PropTypes.number.isRequired,
  onMoveResultClick: PropTypes.func,
};

function MoveResultListItem(props) {
  const { result, currentResultIndex, activeResultIndex, onMoveResultClick } = props;
  const { ambientStr, resultStrStart, resultStrEnd, resultStr } = result;
  const textBeforeMoveValue = ambientStr.slice(0, resultStrStart);
  const moveValue = ambientStr === '' ? resultStr : ambientStr.slice(resultStrStart, resultStrEnd);
  const textAfterMoveValue = ambientStr.slice(resultStrEnd);
  return (
    <button
      role="cell"
      className={`MoveResult ${currentResultIndex === activeResultIndex ? 'selected' : ''}`}
      onClick={() => {
        if (onMoveResultClick) {
          onMoveResultClick(currentResultIndex, result);
        }
      }}
    >
      {textBeforeMoveValue}
      <span className="move-value">{moveValue}</span>
      {textAfterMoveValue}
    </button>
  );
}

MoveResultListItem.propTypes = MoveResultListItemPropTypes;

const MoveResultPropTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  activeResultIndex: PropTypes.number,
  moveStatus: PropTypes.oneOf(['MOVE_NOT_INITIATED', 'MOVE_IN_PROGRESS', 'MOVE_DONE']),
  moveResults: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired,
  onClickResult: PropTypes.func,
  pageLabels: PropTypes.arrayOf(PropTypes.any),
};

function MoveResult(props) 
{
console.log("props2 move",props);

  const { height, moveStatus, moveResults, activeResultIndex, t, onClickResult, pageLabels, isProcessingMoveResults, isMoveInProgress } = props;
  const cellMeasureCache = React.useMemo(() => {
    return new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true });
  }, []);
  const listRef = React.useRef(null);
  const [listSize, setListSize] = React.useState(0);

  if (moveResults.length === 0) {
    // clear measure cache, when doing a new move
    cellMeasureCache.clearAll();
  }

  if (moveResults.length && moveResults.length !== listSize) {
    // If the move list is mutated in the backend, we
    // need to clear cache and recalculate heights
    setListSize(moveResults.length);
    cellMeasureCache.clearAll();
  }

  const rowRenderer = React.useCallback(function rowRendererCallback(rendererOptions) {
    console.log(rendererOptions,'rendererOptions move',searchResults[index]);
    const { index, key, parent, style } = rendererOptions;
    const result = moveResults[index];
    return (
      <CellMeasurer
        cache={cellMeasureCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <div role="row" ref={registerChild} style={style}>
            <MoveResultListSeparator
              currentResultIndex={index}
              moveResults={moveResults}
              pageLabels={pageLabels}
              t={t}
            />
            <MoveResultListItem
              result={result}
              currentResultIndex={index}
              activeResultIndex={activeResultIndex}
              onMoveResultClick={onClickResult}
            />
          </div>
        )}
      </CellMeasurer>
    );
  }, [cellMeasureCache, moveResults, activeResultIndex, t, pageLabels]);
  console.log(cellMeasureCache,"cellMeasureCache move")
// console.log(moveResults,"cellMeasureCache 1")
// console.log(activeResultIndex,"cellMeasureCache 1")
// console.log(t,"cellMeasureCache 1")
// console.log(pageLabels,"cellMeasureCache 1")
  React.useEffect(() => {
    if (listRef) {
      listRef.current?.scrollToRow(activeResultIndex);
    }
  }, [activeResultIndex]);

  if (height == null) { // eslint-disable-line eqeqeq
    // VirtualizedList requires width and height of the component which is calculated by withContentRect HOC.
    // On first render when HOC haven't yet set these values, both are undefined, thus having this check here
    // and skip rendering if values are missing
    return null;
  }

  if (moveStatus === 'move_DONE'
    && moveResults.length === 0
    && !isProcessingMoveResults) {
    if (isMoveInProgress) {
      return null;
    }
    return (
      <div className="info">{t('message.noResults')}</div>
    );
  }

  return (<>
  {/* {console.log("data moveeeee -----",VirtualizedList)}
    <VirtualizedList
      width={200}
      height={height}
      tabIndex={-1}
      overscanRowCount={10}
      rowCount={moveResults.length}
      deferredMeasurementCache={cellMeasureCache}
      rowHeight={cellMeasureCache.rowHeight}
      rowRenderer={rowRenderer}
      ref={listRef}
      scrollToIndex={activeResultIndex - 1}
    /> */}
    </>
  );
}
MoveResult.propTypes = MoveResultPropTypes;

function MoveResultWithContentRectHOC(props) {
  const { measureRef, contentRect, ...rest } = props;
  const { height } = contentRect.bounds;
  console.log(props,"propssss1 move");

  return (
    <div className="results" ref={measureRef}>
      <MoveResult height={height} {...rest} />
    </div>
  );
}
MoveResultWithContentRectHOC.propTypes = {
  contentRect: PropTypes.object,
  measureRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

export default withContentRect('bounds')(MoveResultWithContentRectHOC);
