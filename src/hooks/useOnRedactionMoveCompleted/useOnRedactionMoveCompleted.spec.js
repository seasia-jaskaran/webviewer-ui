import React from 'react';
import * as reactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import useOnRedactionMoveCompleted from './useOnRedactionMoveCompleted';
import core from 'core';
import { act } from 'react-dom/test-utils';
import { redactionTypeMap } from 'constants/redactionTypes';

jest.mock('core');

// These patterns will be used for the tests
const redactionMovePatterns = {
  creditCards: {
    label: 'redactionPanel.move.creditCards',
    icon: 'redact-icons-credit-card',
    type: redactionTypeMap['CREDIT_CARD'],
    regex: /\b(?:\d[ -]*?){13,16}\b/,
  },
  phoneNumbers: {
    label: 'redactionPanel.move.phoneNumbers',
    icon: 'redact-icons-phone-number',
    type: redactionTypeMap['PHONE'],
    regex: /\d?(\s?|-?|\+?|\.?)((\(\d{1,4}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)\d{3}(-|\.|\s)\d{4,5}/,
  },
  emails: {
    label: 'redactionPanel.move.emails',
    icon: 'redact-icons-email',
    type: redactionTypeMap['EMAIL'],
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/,
  },
};

const mockMoveResults = [
  {
    resultStr: 'spice',
    ambientStr: 'The spice must flow.',
    resultStrStart: 4,
    resultStrEnd: 9,
    index: 0,
    pageNum: 1
  },
  {
    resultStr: '4242 4242 4242 4242',
    index: 1,
    pageNum: 1
  },
  {
    resultStr: '867-5309',
    index: 3,
    pageNum: 2
  },
  {
    resultStr: 'paul.atreides@dune.com',
    index: 4,
    pageNum: 3
  }
];

// To test a hook with a redux dependency we need to provide a wrapper for it to run.
// The wrapper must also have a redux provider
// eslint-disable-next-line react/prop-types
const MockComponent = ({ children }) => (<div>{children}</div>);
// eslint-disable-next-line no-undef
const wrapper = withProviders(MockComponent);

describe('useOnRedactionMoveCompleted hook', () => {
  it('adds event listeners to moveResultsChanged and moveInProgress', () => {
    core.addEventListener = jest.fn();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(redactionMovePatterns);

    const { result } = renderHook(() => useOnRedactionMoveCompleted(), { wrapper });

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('moveResultsChanged', expect.any(Function));
    expect(core.addEventListener).toBeCalledWith('moveInProgress', expect.any(Function));
  });


  it('removes event listeners to moveResultsChanged and moveInProgress when unmounted', () => {
    core.removeEventListener = jest.fn();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(redactionMovePatterns);

    const { result, unmount } = renderHook(() => useOnRedactionMoveCompleted(), { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('moveResultsChanged', expect.any(Function));
    expect(core.removeEventListener).toBeCalledWith('moveInProgress', expect.any(Function));
  });

  it('results from the move are correctly mapped to the right type of redactionType', () => {
    // This is a workaround to get the handler for moveResultsChanged so we can test it, as it is not possible (or easy) to mock an event
    let onMoveResultsChangedHandler;
    core.addEventListener = (event, handler) => {
      if (event === 'moveResultsChanged') {
        onMoveResultsChangedHandler = handler;
      }
    };

    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(redactionMovePatterns);


    const { result } = renderHook(() => useOnRedactionMoveCompleted(), { wrapper });
    expect(result.error).toBeUndefined();
    // The handler updates the internal state of the hook so it needs to be wrapped in act
    act(() => onMoveResultsChangedHandler(mockMoveResults));

    const { redactionMoveResults } = result.current;
    expect(redactionMoveResults.length).toEqual(mockMoveResults.length);
    expect(redactionMoveResults[0].type).toEqual(redactionTypeMap['TEXT']);
    expect(redactionMoveResults[1].type).toEqual(redactionTypeMap['CREDIT_CARD']);
    expect(redactionMoveResults[2].type).toEqual(redactionTypeMap['PHONE']);
    expect(redactionMoveResults[3].type).toEqual(redactionTypeMap['EMAIL']);
  });

  it('calling clearRedactionMoveResults results clears any results stored in the hook', () => {
    // This is a workaround to get the handler for moveResultsChanged so we can test it, as it is not possible (or easy) to mock an event
    let onMoveResultsChangedHandler;
    core.addEventListener = (event, handler) => {
      if (event === 'moveResultsChanged') {
        onMoveResultsChangedHandler = handler;
      }
    };

    const { result } = renderHook(() => useOnRedactionMoveCompleted(), { wrapper });
    expect(result.error).toBeUndefined();
    // The handler updates the internal state of the hook so it needs to be wrapped in act
    act(() => onMoveResultsChangedHandler(mockMoveResults));

    expect(result.current.redactionMoveResults.length).toEqual(mockMoveResults.length);

    act(() => result.current.clearRedactionMoveResults());

    expect(result.current.redactionMoveResults.length).toBe(0);
  });

  it('sets the correct moveStatus in the moveInProgress callback', async () => {
    // This is a workaround to get the handler for moveInProgress so we can test it, as it is not possible (or easy) to mock an event
    let onMoveInProgress;
    core.addEventListener = (event, handler) => {
      if (event === 'moveInProgress') {
        onMoveInProgress = handler;
      }
    };

    const { result } = renderHook(() => useOnRedactionMoveCompleted(), { wrapper });
    expect(result.error).toBeUndefined();

    // If called with null or undefined, the move status should be Move_NOT_INITIATED
    act(() => onMoveInProgress(null));
    expect(result.current.moveStatus).toEqual('Move_NOT_INITIATED');

    // If called with true it means that a move is in progress
    act(() => onMoveInProgress(true));
    expect(result.current.moveStatus).toEqual('Move_IN_PROGRESS');

    // If called with false our move is done
    act(() => onMoveInProgress(false));
    expect(result.current.moveStatus).toEqual('Move_DONE');
  });
});
