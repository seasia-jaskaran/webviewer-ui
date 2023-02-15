import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockMoveResults } from '../RedactionMovePanel/RedactionMovePanel.stories';
import RedactionMoveResults from './RedactionMoveResults';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';

const RedactionMoveResultsWithRedux = withProviders(RedactionMoveResults);

function noop() { }

const customRenderWithContext = (component, providerProps = {}) => {
  return render(
    <RedactionPanelContext.Provider value={providerProps}>
      {component}
    </RedactionPanelContext.Provider>,
  );
};

describe('RedactionMoveResults component', () => {
  it('calls the correct handlers for markSelectedResultsForRedaction and redactAllResults', () => {
    const props = {
      redactionMoveResults: mockMoveResults,
      isProcessingRedactionResults: false,
      onCancelMove: noop,
      moveStatus: 'MOVE_DONE',
      markSelectedResultsForRedaction: jest.fn(),
      redactSelectedResults: jest.fn(),
      isTestMode: true,
    };

    const providerProps = {
      isRedactionMoveActive: true,
      setIsRedactionMoveActive: jest.fn(),
      isTestMode: true,
    };

    customRenderWithContext(<RedactionMoveResultsWithRedux {...props} />, providerProps);

    const markForRedactionButton = screen.getByText(/Add Mark/);
    const redactButton = screen.getByText(/Redact/);

    // Both buttons should be disabled if no results are selected
    expect(markForRedactionButton).toBeDisabled();
    expect(redactButton).toBeDisabled();

    // Select all the results from the first page
    // In total there should be 8 checkboxes, one for each result (5) and
    // one for each page number
    const redactionMoveResults = screen.getAllByRole('checkbox');
    expect(redactionMoveResults.length).toEqual(mockMoveResults.length + 3);
    userEvent.click(redactionMoveResults[0]);

    // Now try to add a mark or redact
    userEvent.click(markForRedactionButton);
    // Should be called with results from page 1
    expect(props.markSelectedResultsForRedaction).toHaveBeenCalledWith([mockMoveResults[0], mockMoveResults[1]]);

    userEvent.click(redactButton);
    expect(props.redactSelectedResults).toHaveBeenCalledWith([mockMoveResults[0], mockMoveResults[1]]);
  });
});