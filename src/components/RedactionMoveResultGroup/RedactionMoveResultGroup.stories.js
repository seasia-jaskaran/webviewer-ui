
import React, { useState } from 'react';
import RedactionMoveResultGroup from './RedactionMoveResultGroup';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { redactionTypeMap } from 'constants/redactionTypes';
import { RedactionContextMock } from '../RedactionPanel/RedactionPanel.stories';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const RedactionMoveResultGroupWithRedux = (props) => {
  const mockContext = {
    ...props.mockContext,
  };

  return (
    <Provider store={store}>
      <RedactionContextMock mockContext={mockContext}>
        <RedactionMoveResultGroup {...props} />
      </RedactionContextMock>
    </Provider>
  );
};

export default {
  title: 'Components/RedactionMovePanel/RedactionMoveResultGroup',
  component: RedactionMoveResultGroup,
  includeStories: ['Basic']
};


export const mockMoveResults = [
  {
    type: redactionTypeMap['TEXT'],
    resultStr: 'spice',
    ambientStr: 'The spice must flow.',
    resultStrStart: 4,
    resultStrEnd: 9,
    index: 0,
    icon: 'icon-form-field-text',
  },
  {
    type: redactionTypeMap['CREDIT_CARD'],
    resultStr: '4242 4242 4242 4242',
    index: 1,
    icon: 'redact-icons-credit-card',
  },
  {
    type: redactionTypeMap['IMAGE'],
    resultStr: 'Image',
    index: 2,
    icon: 'redact-icons-image',
  },
  {
    type: redactionTypeMap['PHONE'],
    resultStr: '867-5309',
    index: 3,
    icon: 'redact-icons-phone-number',
  },
  {
    type: redactionTypeMap['EMAIL'],
    resultStr: 'paul.atreides@dune.com',
    index: 4,
    icon: 'redact-icons-email',
  }
];

const basicProps = {
  pageNumber: 1,
  moveResults: mockMoveResults,
};


export function Basic() {
  const [selectedMoveResultIndexes, setSelectedMoveResultIndexes] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  return (
    <div style={{ width: '330px' }}>
      <RedactionMoveResultGroupWithRedux
        selectedMoveResultIndexes={selectedMoveResultIndexes}
        setSelectedMoveResultIndexes={setSelectedMoveResultIndexes}
        {...basicProps}
      />
    </div>
  );
}
