import React from 'react';
import RedactiondMoveResult from './RedactionMoveResult';
import { redactionTypeMap } from 'constants/redactionTypes';

export default {
  title: 'Components/RedactiondMovePanel/RedactiondMoveResult',
  component: RedactiondMoveResult,
};


export function Text() {
  const props = {
    type: redactionTypeMap['TEXT'],
    resultStr: 'spice',
    ambientStr: 'The spice must flow.',
    resultStrStart: 4,
    resultStrEnd: 9,
    icon: 'icon-form-field-text',
  };
  return (
    <RedactiondMoveResult {...props} />
  );
}

export function CreditCard() {
  const props = {
    type: redactionTypeMap['CREDIT_CARD'],
    resultStr: '4242 4242 4242 4242',
    icon: 'redact-icons-credit-card',
  };
  return (
    <RedactiondMoveResult {...props} />
  );
}

export function Image() {
  const props = {
    type: redactionTypeMap['IMAGE'],
    resultStr: 'Image',
    icon: 'redact-icons-image',
  };
  return (
    <RedactiondMoveResult {...props} />
  );
}


export function PhoneNumber() {
  const props = {
    type: redactionTypeMap['PHONE'],
    resultStr: '867-5309',
    icon: 'redact-icons-phone-number',
  };
  return (
    <RedactiondMoveResult {...props} />
  );
}


export function Email() {
  const props = {
    type: redactionTypeMap['EMAIL'],
    resultStr: 'paul.atreides@dune.com',
    icon: 'redact-icons-email',
  };
  return (
    <RedactiondMoveResult {...props} />
  );
}
