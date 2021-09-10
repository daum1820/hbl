import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

export default function NumberComponent(props)  {
  const { prefix, decimalScale = 0, fixedDecimalScale = false, inputRef, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      thousandSeparator='.'
      decimalSeparator=','
      fixedDecimalScale={fixedDecimalScale}
      decimalScale={decimalScale}
      prefix={prefix}
    />
  );
}

NumberComponent.propTypes = {
  inputRef: PropTypes.func.isRequired,
};