import React from "react";
import InputMask from "react-input-mask";
import { TextField } from "@material-ui/core";

export function PhoneElement(props) {
  const beforeMaskedValueChange = (newState) => {
    let { value } = newState;

    const newValue = value.replace(/\D/g, "");
    if (newValue.length === 11) {
      value = newValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }

    return {
      ...newState,
      value
    };
  };

  return (
    <InputMask {...props} mask="(99) 99999-9999" maskChar={null} beforeMaskedValueChange={beforeMaskedValueChange}>
      {(props) => <TextField {...props} />}
    </InputMask>
  );
};