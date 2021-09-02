import React, { FunctionComponent } from "react";
import { FormGroup } from "../../Form";
import { FormInputProps, Input } from "../../Input";

export const BeaconModelInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="model" label="Enter your beacon model" defaultValue={value} />
  </FormGroup>
);
