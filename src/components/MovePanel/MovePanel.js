import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import MoveResult from 'components/MoveResult';
import MoveOverlay from 'components/MoveOverlay';
import Icon from 'components/Icon';
import getClassName from 'helpers/getClassName';
import DataElementWrapper from 'components/DataElementWrapper';
import { addMoveListener, removeMoveListener } from 'helpers/move';
import { connect } from 'react-redux';
import './MovePanel.scss';
import useMove from 'hooks/useMove';
import { useSelector } from "react-redux";

const propTypes = {
  isOpen: PropTypes.bool,
  isMobile: PropTypes.bool,
  pageLabels: PropTypes.array,
  currentWidth: PropTypes.number,
  closeMovePanel: PropTypes.func,
  setActiveResult: PropTypes.func,
  isInDesktopOnlyMode: PropTypes.bool,
  isProcessingMoveResults: PropTypes.bool
};

function noop() { }

function MovePanel(props) {
  const {
    isOpen,
    currentWidth,
    pageLabels,
    closeMovePanel = noop,
    setActiveResult = noop,
    setNextResultValue = noop,
    isMobile = false,
    isInDesktopOnlyMode,
    isProcessingMoveResults
  } = props;

  const { t } = useTranslation();
  const { moveStatus, moveResults, activeMoveResultIndex, setMoveStatus } = useMove();
  const {  dataArrayPdftron } = useSelector((state) => state?.dataReducer?.dataArrayPdftron)
  const onCloseButtonClick = React.useCallback(function onCloseButtonClick() {
    if (closeMovePanel) {
      closeMovePanel();
    }
  }, [closeMovePanel]);

  // const onClickResult = React.useCallback(function onClickResult(resultIndex, result) {
  //   setActiveResult(result);
  //   if (!isInDesktopOnlyMode && isMobile) {
  //     closeMovePanel();
  //   }

  //   setNextResultValue(result);
  // }, [closeMovePanel, isMobile]);
  function onClickResult(resultIndex, result) {
    setActiveResult(result);
    if (!isInDesktopOnlyMode && isMobile) {
      closeMovePanel();
    }

    // setNextResultValue(result);
  }
  const [isMoveInProgress, setIsMoveInProgress] = React.useState(false);

  const moveEventListener = () => {
    setIsMoveInProgress(false);
  };

  React.useEffect(() => {
    // componentDidMount
    addMoveListener(moveEventListener);
  }, []);

  React.useEffect(() => {
    // componentWillUnmount
    return () => {
      removeMoveListener(moveEventListener);
    };
  }, []);

  // const mapStateToProps = (state) => ({
  //   dataArrayPdftron: state.dataArrayPdftron,
  // });

  // const mapDispatchToProps = (dispatch) => ({
  //   setSideData: () => dispatch(setSideData())
  // });
  const className = getClassName('Panel MovePanel', { isOpen });
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
console.log(dataArrayPdftron,"dataArrayPdftron");
  return (
    <DataElementWrapper
      className={className}
      dataElement="movePanel"
      style={style}
    >
      {!isInDesktopOnlyMode && isMobile &&
        <div
          className="close-container"
        >
          <button
            className="close-icon-container"
            onClick={onCloseButtonClick}
          >
            <Icon
              glyph="ic_close_black_24px"
              className="close-icon"
            />
          </button>
        </div>}
        
      {/* <MoveOverlay
        moveStatus={moveStatus}
        setMoveStatus={setMoveStatus}
        moveResults={moveResults}
        activeResultIndex={activeMoveResultIndex}
        isPanelOpen={isOpen}
        isMoveInProgress={isMoveInProgress}
        setIsMoveInProgress={setIsMoveInProgress}
      /> */}
      {/* <MoveResult
        t={t}
        moveStatus={moveStatus}
        moveResults={
          [
          {
              "ambientStr": "form data, annotations, and more. According to market",
              "resultStr": "data",
              "resultStrStart": 5,
              "resultStrEnd": 9,
              "pageNum": 2,
              "resultCode": 2,
              "quads": [
                  {
                      "x1": 126.732,
                      "y1": 274.94165,
                      "x2": 150.08399999999997,
                      "y2": 274.94165,
                      "Oz": 150.08399999999997,
                      "Rz": 263.441894140625,
                      "Pz": 126.732,
                      "Sz": 263.441894140625
                  }
              ],
              "ambient_str": "form data, annotations, and more. According to market",
              "result_str": "data",
              "result_str_start": 5,
              "result_str_end": 9,
              "page_num": 2
          },
          {
              "ambientStr": "information, data, and objects, and containing different languages,",
              "resultStr": "data",
              "resultStrStart": 13,
              "resultStrEnd": 17,
              "pageNum": 4,
              "resultCode": 2,
              "quads": [
                  {
                      "x1": 237.67019999999997,
                      "y1": 625.528,
                      "x2": 272.98439999999994,
                      "y2": 625.528,
                      "Oz": 272.98439999999994,
                      "Rz": 602.524,
                      "Pz": 237.67019999999997,
                      "Sz": 602.524
                  }
              ],
              "ambient_str": "information, data, and objects, and containing different languages,",
              "result_str": "data",
              "result_str_start": 13,
              "result_str_end": 17,
              "page_num": 4
          },
          {
              "ambientStr": "network data usage explodes. To maintain your desired UX,",
              "resultStr": "data",
              "resultStrStart": 8,
              "resultStrEnd": 12,
              "pageNum": 6,
              "resultCode": 2,
              "quads": [
                  {
                      "x1": 82.74000000000001,
                      "y1": 378.68165000000005,
                      "x2": 106.09200000000001,
                      "y2": 378.68165000000005,
                      "Oz": 106.09200000000001,
                      "Rz": 367.18189414062505,
                      "Pz": 82.74000000000001,
                      "Sz": 367.18189414062505
                  }
              ],
              "ambient_str": "network data usage explodes. To maintain your desired UX,",
              "result_str": "data",
              "result_str_start": 8,
              "result_str_end": 12,
              "page_num": 6
          },
          {
              "ambientStr": "parsing data out of forms — which opens up the",
              "resultStr": "data",
              "resultStrStart": 8,
              "resultStrEnd": 12,
              "pageNum": 9,
              "resultCode": 2,
              "quads": [
                  {
                      "x1": 98.724,
                      "y1": 262.90565000000004,
                      "x2": 122.076,
                      "y2": 262.90565000000004,
                      "Oz": 122.076,
                      "Rz": 251.40589414062504,
                      "Pz": 98.724,
                      "Sz": 251.40589414062504
                  }
              ],
              "ambient_str": "parsing data out of forms — which opens up the",
              "result_str": "data",
              "result_str_start": 8,
              "result_str_end": 12,
              "page_num": 9
          },
          {
              "ambientStr": "your data and documents will be stored. For example,",
              "resultStr": "data",
              "resultStrStart": 5,
              "resultStrEnd": 9,
              "pageNum": 9,
              "resultCode": 2,
              "quads": [
                  {
                      "x1": 169.93080000000003,
                      "y1": 479.85365,
                      "x2": 193.2828,
                      "y2": 479.85365,
                      "Oz": 193.2828,
                      "Rz": 468.353894140625,
                      "Pz": 169.93080000000003,
                      "Sz": 468.353894140625
                  }
              ],
              "ambient_str": "your data and documents will be stored. For example,",
              "result_str": "data",
              "result_str_start": 5,
              "result_str_end": 9,
              "page_num": 9
          }
      ]}
        activeResultIndex={activeMoveResultIndex}
        onClickResult={onClickResult}
        pageLabels={pageLabels}
        isProcessingMoveResults={isProcessingMoveResults}
        isMoveInProgress={isMoveInProgress}
      /> */}
      <div>
        <div>
          <label onClick={() => {
            onClickResult(3, {
              "pageNum": 3,
              "page_num": 3
            })
          }}>page 3</label>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime totam nobis ipsum modi a, dignissimos</p>
        </div>
        <div>
          <label onClick={() => {
            onClickResult(3, {
              "pageNum": 5,
              "page_num": 5
            })
          }}>page 5</label>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime totam nobis ipsum modi a, dignissimos</p>
        </div>
        <div>
          <label onClick={() => {
            onClickResult(9, {
              "pageNum": 9,
              "page_num": 9
            })
          }}>page 9</label>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime totam nobis ipsum modi a, dignissimos</p>
        </div>
      </div>
    </DataElementWrapper>
  );
}

MovePanel.propTypes = propTypes;

export default MovePanel;
