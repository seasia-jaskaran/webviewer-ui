import React from 'react';
import * as reactRedux from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import MovePanelWithOutI18n from './MovePanel';
import MovePanelContainerWithOutI18n from './MovePanelContainer';
import useMedia from 'hooks/useMedia';
import useMove from 'hooks/useMove';
import actions from 'actions';
import core from 'core';

const MovePanel = withI18n(MovePanelWithOutI18n);
const MovePanelContainer = withI18n(MovePanelContainerWithOutI18n);

jest.mock('core');
jest.mock('hooks/useMedia');
jest.mock('hooks/useMove');
jest.mock('actions');

jest.mock('components/MoveOverlay', () => {
  return function MockComponent() {
    return (<div>MoveOverlayMock</div>);
  };
});
jest.mock('components/MoveResult', () => {
  return function MockComponent(props) {
    const { onClickResult } = props;// eslint-disable-line react/prop-types
    return (
      <div>
        <span>MoveResultMock</span>
        <button className="mock-active-result" onClick={onClickResult}>mock active result</button>
      </div>
    );
  };
});

function createDisabledStateForDataElement(dataElement) {
  const state = { viewer: { disabledElements: {} } };
  state.viewer.disabledElements[dataElement] = { disabled: true };
  return state;
}

describe('MovePanel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // test would break if we don't make default return from useMove as code is trying to destruct undefined value
    useMove.mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw error if now props given', () => {
    expect(() => {
      render(<MovePanel />);
    }).not.toThrow();
  });

  it('Should not render if component disabled', () => {
    const state = createDisabledStateForDataElement('movePanel');
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation(function(selector) {
      return selector(state);
    });
    const { container } = render(<MovePanel />);
    expect(container.querySelector('.MovePanel')).not.toBeInTheDocument();
  });

  it('Should render if component enabled', () => {
    const { container } = render(<MovePanel />);
    expect(container.querySelector('.MovePanel')).toBeInTheDocument();
  });

  it('Should not render close button if not mobile', () => {
    const { container } = render(<MovePanel />);
    expect(container.querySelector('.MovePanel')).toBeInTheDocument();
    expect(container.querySelector('.close-icon-container')).not.toBeInTheDocument();
  });

  it('Should set minWidth and width if not mobile device', () => {
    const { container } = render(<MovePanel currentWidth={100}/>);
    const movePanel = container.querySelector('.MovePanel');
    expect(movePanel).toBeInTheDocument();
    expect(movePanel).toHaveStyle('width: 100px');
    expect(movePanel).toHaveStyle('min-width: 100px');
  });

  it('Should render close button if mobile device', () => {
    const { container } = render(<MovePanel isMobile/>);
    expect(container.querySelector('.MovePanel')).toBeInTheDocument();
    expect(container.querySelector('.close-icon-container')).toBeInTheDocument();
  });

  it('Should not set minWidth and width if mobile device', () => {
    const currentWidth = 100;
    const { container } = render(<MovePanel currentWidth={currentWidth} isMobile/>);
    const movePanel = container.querySelector('.MovePanel');
    expect(movePanel).toBeInTheDocument();
    // getPropertyValue returns empty string if value is not set
    expect(movePanel.style.getPropertyValue('width')).toBe('');
    expect(movePanel.style.getPropertyValue('min-width')).toBe('');
  });

  it('Should have class \'open\' if isOpen=true passed as props', () => {
    const { container } = render(<MovePanel isOpen/>);
    const movePanel = container.querySelector('.MovePanel');
    expect(movePanel).toBeInTheDocument();
    expect(movePanel).toHaveClass('open');
  });

  it('Should have class \'closed\' if isOpen=false passed as props', () => {
    const { container } = render(<MovePanel isOpen={false}/>);
    const movePanel = container.querySelector('.MovePanel');
    expect(movePanel).toBeInTheDocument();
    expect(movePanel).toHaveClass('closed');
  });

  it('Should render MoveOverlay component', () => {
    const { container } = render(<MovePanel />);
    expect(container).toHaveTextContent('MoveOverlayMock');
  });

  it('Should render MoveResult component', () => {
    const { container } = render(<MovePanel />);
    expect(container).toHaveTextContent('MoveResultMock');
  });

  it('Should set active result when result is clicked', () => {
    const closeMovePanelMock = jest.fn();
    const setActiveResultMock = jest.fn();

    const { container } = render(
      <MovePanel
        isOpen
        closeMovePanel={closeMovePanelMock}
        setActiveResult={setActiveResultMock}
      />
    );
    const activeResultButton = container.querySelector('.mock-active-result');
    expect(activeResultButton).toBeInTheDocument();
    fireEvent.click(activeResultButton);
    expect(setActiveResultMock).toBeCalled();
    expect(closeMovePanelMock).not.toBeCalled();
  });

  it('Should close move panel when result is clicked using mobile device', () => {
    const closeMovePanelMock = jest.fn();
    const setActiveResultMock = jest.fn();
    const { container } = render(
      <MovePanel
        isMobile
        isOpen
        closeMovePanel={closeMovePanelMock}
        setActiveResult={setActiveResultMock}
      />
    );
    const activeResultButton = container.querySelector('.mock-active-result');
    expect(activeResultButton).toBeInTheDocument();
    fireEvent.click(activeResultButton);
    expect(setActiveResultMock).toBeCalled();
    expect(closeMovePanelMock).toBeCalled();
  });

  it('Should close panel when mobile and close button clicked', () => {
    const closeMovePanelMock = jest.fn();
    const { container } = render(<MovePanel closeMovePanel={closeMovePanelMock} isOpen isMobile />);
    const movePanel = container.querySelector('.MovePanel');
    const mobileCloseButton = container.querySelector('.close-icon-container');
    expect(movePanel).toBeInTheDocument();
    expect(movePanel).toHaveClass('open');
    expect(mobileCloseButton).toBeInTheDocument();
    fireEvent.click(mobileCloseButton);
    expect(closeMovePanelMock).toHaveBeenCalled();
  });
});

describe('MovePanelContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // test would break if we don't make default return from useMove as code is trying to destruct undefined value
    useMove.mockReturnValue({});
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => {});
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    const isOpen = true;
    const currentWidth = 1280;
    const pageLabels = [];
    const shouldClearMovePanelOnClose = false;
    useSelectorMock.mockReturnValue([isOpen, currentWidth, pageLabels, shouldClearMovePanelOnClose]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw error if now props given', () => {
    expect(() => {
      render(<MovePanelContainer />);
    }).not.toThrow();
  });

  it('Should clear move results if not open and enabled by API', () => {
    const isOpen = false;
    const shouldClear = true;
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([isOpen, null, null, shouldClear]);
    const actionsSetMoveValueActionMock = jest.spyOn(actions, 'setMoveValue');
    const coreClearMoveResultsMock = jest.spyOn(core, 'clearMoveResults');

    render(<MovePanelContainer />);
    expect(actionsSetMoveValueActionMock).toHaveBeenCalledWith('');
    expect(coreClearMoveResultsMock).toHaveBeenCalled();
  });

  it('Should not clear move results if not open but disabled by API', () => {
    const isOpen = false;
    const shouldClear = false;
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([isOpen, null, null, shouldClear]);
    const actionsSetMoveValueActionMock = jest.spyOn(actions, 'setMoveValue');
    const coreClearMoveResultsMock = jest.spyOn(core, 'clearMoveResults');

    render(<MovePanelContainer />);
    expect(actionsSetMoveValueActionMock).not.toHaveBeenCalled();
    expect(coreClearMoveResultsMock).not.toHaveBeenCalled();
  });

  it('Should not clear result if mobile device', () => {
    const isOpen = false;
    const shouldClear = true;
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([isOpen, null, null, shouldClear]);
    const actionsSetMoveValueActionMock = jest.spyOn(actions, 'setMoveValue');
    const coreClearMoveResultsMock = jest.spyOn(core, 'clearMoveResults');
    useMedia.mockReturnValue(true);

    render(<MovePanelContainer />);
    expect(actionsSetMoveValueActionMock).not.toHaveBeenCalled();
    expect(coreClearMoveResultsMock).not.toHaveBeenCalled();
  });
});
