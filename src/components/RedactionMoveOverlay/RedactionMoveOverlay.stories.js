import React, { useState } from 'react';
import RedactionMoveOverlay from './RedactionMoveOverlay';


export default {
  title: 'Components/RedactionMovePanel/RedactionMoveOverlay',
  component: RedactionMoveOverlay,
};

const noop = () => { };


const basicProps = {
  setIsRedactionMoveActive: noop,
  redactionMoveOptions: [
    {
      value: 'phone',
      label: 'redactionPanel.move.phoneNumbers',
      icon: 'redact-icons-phone-number',
      type: 'phone',
      regex: /\d?(\s?|-?|\+?|\.?)((\(\d{1,4}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)\d{3}(-|\.|\s)\d{4,5}/,
    },
    {
      value: 'email',
      label: 'redactionPanel.move.emails',
      icon: 'redact-icons-email',
      type: 'email',
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/,
    },
    {
      value: 'creditCard',
      label: 'redactionPanel.move.creditCards',
      icon: 'redact-icons-credit-card',
      type: 'creditCard',
      regex: /\b(?:\d[ -]*?){13,16}\b/,
    },
  ]
};

export function Basic() {
  const [moveTerms, setMoveTerms] = useState([]);
  return (
    <RedactionMoveOverlay
      moveTerms={moveTerms}
      setMoveTerms={setMoveTerms}
      {...basicProps}
    />
  );
}