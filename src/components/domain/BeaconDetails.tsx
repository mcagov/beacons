import Image from "next/image";
import React, { FunctionComponent } from "react";
import { Details } from "../Details";
import { FormGroup } from "../Form";
import { FormInputProps, Input } from "../Input";
import { GovUKBody } from "../Typography";

interface ExistingBeaconHexIdProps {
  hexId: string;
}

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

export const BeaconModelInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="model" label="Enter your beacon model" defaultValue={value} />
  </FormGroup>
);

export const HexIdHelp: FunctionComponent = (): JSX.Element => (
  <Details
    summaryText="What does the 15 character beacon HEX ID or UIN look like?"
    className="govuk-!-padding-top-2"
  >
    <Image
      src="/assets/mca_images/beacon_hex_id.png"
      alt="This image illustrates what a beacon's HEX ID or UIN number looks like on an actual
        beacon. The example HEX ID or UIN here is 1D0EA08C52FFBFF."
      height={640}
      width={960}
    />
  </Details>
);

export const BeaconHexIdInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="hexId"
      label="Enter the 15 character beacon HEX ID or UIN number"
      hintText="This will be on your beacon. It must be 15 characters long and use
      characters 0 to 9 and letters A to F"
      htmlAttributes={{ spellCheck: false }}
      defaultValue={value}
    />
    <HexIdHelp />
  </FormGroup>
);

export const ExistingBeaconHexId: FunctionComponent<ExistingBeaconHexIdProps> =
  ({ hexId }: ExistingBeaconHexIdProps): JSX.Element => (
    <>
      <br />
      <GovUKBody>The 15 character beacon HEX ID or UIN number</GovUKBody>
      <GovUKBody>Hex ID/UIN: {hexId}</GovUKBody>
      <HexIdHelp />
    </>
  );
