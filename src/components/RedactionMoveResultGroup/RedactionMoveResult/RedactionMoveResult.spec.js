import React from 'react';
import { render, screen } from '@testing-library/react';
import { redactionTypeMap } from 'constants/redactionTypes';
import userEvent from '@testing-library/user-event';
import RedactiondMoveResult from './RedactionMoveResult';

import {
  Text,
  CreditCard,
  Image,
  PhoneNumber,
  Email,
} from './RedactiondMoveResult.stories';


describe('RedactiondMoveResult', () => {
  describe('storybook components', () => {
    it('renders text result story correctly', () => {
      expect(() => {
        render(<Text />);
      }).not.toThrow();
    });

    it('renders credit card result story correctly', () => {
      expect(() => {
        render(<CreditCard />);
      }).not.toThrow();
    });

    it('renders image result story correctly', () => {
      expect(() => {
        render(<Image />);
      }).not.toThrow();
    });

    it('renders phone number result story correctly', () => {
      expect(() => {
        render(<PhoneNumber />);
      }).not.toThrow();
    });

    it('renders email result story correctly', () => {
      expect(() => {
        render(<Email />);
      }).not.toThrow();
    });
  });

  describe('component', () => {
    it('when the result is of type text, it renders the correct item with the correct className', () => {
      const props = {
        type: redactionTypeMap['TEXT'],
        resultStr: 'spice',
        ambientStr: 'The spice must flow.',
        resultStrStart: 4,
        resultStrEnd: 9,
      };

      render(<RedactiondMoveResult {...props} />);
      const moveResult = screen.getByText(props.resultStr);
      expect(moveResult).toHaveClass('move-value');
    });

    it('when the result is of type credit card, it renders the correct item', () => {
      const props = {
        type: redactionTypeMap['CREDIT_CARD'],
        resultStr: '4242 4242 4242 4242'
      };

      render(<RedactiondMoveResult {...props} />);
      const moveResult = screen.getByText(props.resultStr);
      expect(moveResult).toHaveClass('redaction-move-result-info');
    });

    it('when the result is of type phone number, it renders the correct item', () => {
      const props = {
        type: redactionTypeMap['PHONE'],
        resultStr: '867-5309'
      };

      render(<RedactiondMoveResult {...props} />);
      const moveResult = screen.getByText(props.resultStr);
      expect(moveResult).toHaveClass('redaction-move-result-info');
    });

    it('when the result is of type email, it renders the correct item', () => {
      const props = {
        type: redactionTypeMap['EMAIL'],
        resultStr: 'paul.atreides@dune.com'
      };

      render(<RedactiondMoveResult {...props} />);
      const moveResult = screen.getByText(props.resultStr);
      expect(moveResult).toHaveClass('redaction-move-result-info');
    });

    it('when a user clicks on the result item it calls the correct handler', () => {
      const props = {
        type: redactionTypeMap['EMAIL'],
        resultStr: 'paul.atreides@dune.com',
        onClickResult: jest.fn()
      };

      render(<RedactiondMoveResult {...props} />);
      const moveResult = screen.getByText(props.resultStr);
      userEvent.click(moveResult);
      expect(props.onClickResult).toBeCalled();
    });

    it('when a user ticks the box it calls the right handler', () => {
      const props = {
        type: redactionTypeMap['EMAIL'],
        resultStr: 'paul.atreides@dune.com',
        onChange: jest.fn(),
      };

      render(<RedactiondMoveResult {...props} />);
      const checkBox = screen.getByRole('checkbox');
      userEvent.click(checkBox);
      expect(props.onChange).toBeCalledTimes(1);
    });
  });
});