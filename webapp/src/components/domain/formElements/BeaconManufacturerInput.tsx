import React, { FunctionComponent } from "react";
import { FormGroup } from "../../Form";
import { FormInputProps, Input } from "../../Input";

export const BeaconManufacturerInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="manufacturer"
      label="Enter your beacon manufacturer"
      defaultValue={value}
    />
  </FormGroup>
);
