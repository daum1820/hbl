import React from "react";
import InputMask from "react-input-mask";
import { TextField } from "@material-ui/core";

export function ZipcodeElement(props) {
  return (
    <InputMask {...props} mask="99999-999" maskChar={null}>
      {(props) => <TextField {...props} />}
    </InputMask>
  );
};