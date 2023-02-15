import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MoveOverlay from './MoveOverlay';
import { Basic } from './MoveOverlay.stories';
import { executeMove, selectNextResult, selectPreviousResult } from './MoveOverlayContainer';
import core from 'core';

// To create mocks of something that executeMove uses we need to first import them
// and then call jest.mock them.
import { getOverrideMoveExecution } from 'helpers/move';
import moveTextFullFactory from '../../apis/moveTextFull';

// wrap story component with i18n provider, so component can use useTranslation()
const BasicMoveOverlayStory = withI18n(Basic);
// wrap base component with i81n provider and mock redux
const TestMoveOverlay = withProviders(MoveOverlay);

// This file is meant to be example how to implement unit testing for our components
// thus having excessive comments

function noop() {}
jest.mock('../../apis/moveTextFull');
// To override something else that default export, we need to use factory function
jest.mock('helpers/move', () => {
  return {
    getOverrideMoveExecution: jest.fn(),
    addMoveListener: jest.fn(),
    removeMoveListener: jest.fn(),
  };
});

jest.mock('core');


describe('MoveOverlay', () => {
  beforeEach(() => {
    moveTextFullFactory.mockReset();
    getOverrideMoveExecution.mockReset();
  });

  describe('Component', () => {
    // It's good practice to test that all stories of current component work without throwing errors.
    // In some cases when changing code (or configuration), we forget to make necessary changes to
    // storybook stories or its configuration. Rendering test case in unit tests makes sure we don't
    // break storybook by accident.
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicMoveOverlayStory />);
      }).not.toThrow();
    });

    it('Should not render component if disabled', () => {
      // render component with isMoveOverlayDisabled which should cause component to not render anything
      const { container } = render(
        <TestMoveOverlay
          setMoveValue={noop}
          setCaseSensitive={noop}
          setMoveStatus={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeMove={noop}
          setReplaceValue={noop}
          isMoveOverlayDisabled
        />
      );
      // Verify that MovePanel div is not in the document
      expect(container.querySelector('.MovePanel')).not.toBeInTheDocument();
    });

    it('Should execute move on input text enter', () => {
      // Create jest mock function, so we can verify that this function was called after click.
      const executeMove = jest.fn();
      const { container } = render(
        <TestMoveOverlay
          setMoveValue={noop}
          setMoveStatus={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeMove={executeMove}
        />
      );
      const moveInput = container.querySelector('#MovePanel__input');
      expect(moveInput).toBeInTheDocument();
      fireEvent.keyDown(moveInput, { key: 'Enter', code: 'Enter' });
      setTimeout(() => {
        expect(executeMove).toHaveBeenCalled();
      }, 1000);
    });


    it('Should execute move when case sensitive checkbox changed', () => {
      const executeMove = jest.fn();
      const moveValue = 'more';
      const { container } = render(
        <TestMoveOverlay
          moveValue={moveValue}
          setMoveValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeMove={executeMove}
        />
      );

      const checkbox = container.querySelector('#case-sensitive-option');
      expect(checkbox).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(executeMove).toBeCalled();
    });

    it('Should execute move when whole word checkbox changed', () => {
      const executeMove = jest.fn();
      const moveValue = 'more';
      const { container } = render(
        <TestMoveOverlay
          moveValue={moveValue}
          setMoveValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeMove={executeMove}
        />
      );

      const checkbox = container.querySelector('#whole-word-option');
      expect(checkbox).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(executeMove).toBeCalled();
    });

    it('Should render wild card checkbox and execute move when checkbox changed', () => {
      const executeMove = jest.fn();
      const moveValue = 'more';
      const { container } = render(
        <TestMoveOverlay
          moveValue={moveValue}
          setMoveValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeMove={executeMove}
        />
      );

      const checkbox = container.querySelector('#wild-card-option');
      expect(checkbox).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(executeMove).toBeCalled();
    });

    it('Should not be focused on mount', () => {
      const { container } = render(
        <TestMoveOverlay
          setMoveValue={noop}
          setCaseSensitive={noop}
          setMoveStatus={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeMove={noop}
        />
      );

      const moveInput = container.querySelector('#MovePanel__input');
      expect(moveInput === document.activeElement).toBe(false);
    });
  });

  describe('Functionality', () => {
    it('Should execute text move with correct arguments', () => {
      const moveValue = 'abc';
      const moveOptions = {
        caseSensitive: true,
      };
      // as implementation uses moveOptions and add regex: false to move options
      // we create here object that we are expecting to be called.
      const expectedMoveOptions = {
        ...moveOptions,
        regex: false,
      };
      const moveTextFullMock = jest.fn();
      // factory to return mock value of our moveTextFull function
      moveTextFullFactory.mockReturnValue(moveTextFullMock);
      executeMove(moveValue, moveOptions);
      // verify that moveTextFull function got called with 'abc' and object that is similar to expectedMoveOptions
      expect(moveTextFullMock).toHaveBeenCalledWith(moveValue, expectedMoveOptions);
    });

    it('Should call overrideMoveExecution if given', () => {
      const moveValue = 'abc';
      const moveOptions = {
        caseSensitive: true,
      };
      const expectedMoveOptions = {
        ...moveOptions,
        regex: false,
      };
      // Make sure that when getOverrideMoveExecution is called it returns a function that represents function
      // that user would set when they want to override default move execution function.
      const overrideMoveExecutionFnMock = jest.fn();
      getOverrideMoveExecution.mockReturnValue(overrideMoveExecutionFnMock);
      const moveTextFullMock = jest.fn();
      moveTextFullFactory.mockReturnValue(moveTextFullMock);
      // execute code that is tested
      executeMove(moveValue, moveOptions);
      // make sure default move implementation is not called
      expect(moveTextFullMock).not.toHaveBeenCalled();
      // verify that the custom move function is called with correct arguments
      expect(overrideMoveExecutionFnMock).toHaveBeenCalledWith(moveValue, expectedMoveOptions);
    });

    it('Should call move when move value is empty', () => {
      const moveTextFullMock = jest.fn();
      moveTextFullFactory.mockReturnValue(moveTextFullMock);
      // When we call executeMove with empty string, move should be initiated.
      executeMove('', {});
      expect(moveTextFullMock).toHaveBeenCalled();
    });

    it('Should not call move when move value null or undefined', () => {
      const overrideMoveExecutionFnMock = jest.fn();
      getOverrideMoveExecution.mockReturnValue(overrideMoveExecutionFnMock);
      const moveTextFullMock = jest.fn();
      moveTextFullFactory.mockReturnValue(moveTextFullMock);
      // When we call executeMove without moveValue, move should not be initiated.
      executeMove(null, {});
      executeMove(undefined, {});
      expect(moveTextFullMock).not.toHaveBeenCalled();
      expect(overrideMoveExecutionFnMock).not.toHaveBeenCalled();
    });

    it('Should select next result', () => {
      // create move results. As we mock the core, we can just pass any objects here and we can test
      // that the selection logic works correctly. In real code these object are MoveResult objects
      const moveResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = 0;
      const setActiveMoveResultMock = jest.fn();
      // set mock for setActiveMoveResult so we can verify that it gets called correctly
      core.setActiveMoveResult = setActiveMoveResultMock;
      selectNextResult(moveResults, activeResultIndex);
      expect(setActiveMoveResultMock).toHaveBeenCalledWith(moveResults[1]);
    });

    it('Should go back to first result when last is selected and next button is clicked', () => {
      const moveResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = moveResults.length - 1;
      const setActiveMoveResultMock = jest.fn();
      // set mock for setActiveMoveResult so we can verify that it gets called correctly
      core.setActiveMoveResult = setActiveMoveResultMock;
      selectNextResult(moveResults, activeResultIndex);
      expect(setActiveMoveResultMock).toHaveBeenCalledWith(moveResults[0]);
    });

    it('selectNextResult should not call core if move results not available', () => {
      const setActiveMoveResultMock = jest.fn();
      core.setActiveMoveResult = setActiveMoveResultMock;
      selectNextResult();
      // make sure setActiveMoveResult was not called
      expect(setActiveMoveResultMock).not.toHaveBeenCalled();
    });

    it('Should select previous result', () => {
      const moveResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = 3;
      const setActiveMoveResultMock = jest.fn();
      core.setActiveMoveResult = setActiveMoveResultMock;
      selectPreviousResult(moveResults, activeResultIndex);
      expect(setActiveMoveResultMock).toHaveBeenCalledWith(moveResults[2]);
    });

    it('Should go back to last result when first is selected and previous is clicked', () => {
      const moveResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = 0;
      const setActiveMoveResultMock = jest.fn();
      core.setActiveMoveResult = setActiveMoveResultMock;
      selectPreviousResult(moveResults, activeResultIndex);
      expect(setActiveMoveResultMock).toHaveBeenCalledWith(moveResults[moveResults.length - 1]);
    });

    it('selectPreviousResult should not call core if move results not available', () => {
      const setActiveMoveResultMock = jest.fn();
      core.setActiveMoveResult = setActiveMoveResultMock;
      selectPreviousResult();
      expect(setActiveMoveResultMock).not.toHaveBeenCalledWith();
    });
  });
});
