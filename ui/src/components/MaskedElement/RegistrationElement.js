import React from "react";
import InputMask from "react-input-mask";
import { TextField } from "@material-ui/core";

export function RegistrationElement(props) {
  const beforeMaskedValueChange = (newState) => {
    let { value } = newState;

    const newValue = value.replace(/\D/g, "");
    if (newValue.length === 11) {
      value = newValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }

    return {
      ...newState,
      value
    };
  };

  return (
    <InputMask {...props} mask="99.999.999/9999-99" maskChar={null} beforeMaskedValueChange={beforeMaskedValueChange}>
      {(props) => <TextField {...props} />}
    </InputMask>
  );
};