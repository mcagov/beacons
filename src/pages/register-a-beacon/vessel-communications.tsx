import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { CheckboxList, CheckboxListItem } from "../../components/Checkbox";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormHint,
  FormLegend,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import {
  AnchorLink,
  GovUKBody,
  PageHeading,
} from "../../components/Typography";
import { FieldInput } from "../../lib/form/fieldInput";
import { FieldManager } from "../../lib/form/fieldManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { VesselCommunication } from "../../lib/types";

interface VesselCommunicationsProps {
  fields: Record<string, FieldInput>;
}

interface PageHeadingInfoProps {
  heading: string;
  fieldManager: FieldManager;
}

interface FormInputProps {
  value: string;
}

const getFieldManager = ({
  callSign,
  vhfRadio,
  fixedVhfRadio,
  fixedVhfRadioInput,
  portableVhfRadio,
  portableVhfRadioInput,
  satelliteTelephone,
  satelliteTelephoneInput,
  mobileTelephone,
  mobileTelephoneInput1,
  mobileTelephoneInput2,
}: CacheEntry): FieldManager => {
  return new FieldManager({
    callSign: new FieldInput(callSign),
    vhfRadio: new FieldInput(vhfRadio),
    fixedVhfRadio: new FieldInput(fixedVhfRadio),
    fixedVhfRadioInput: new FieldInput(fixedVhfRadioInput, [
      Validators.conditionalOnValue(
        "Fixed VHF radio must not be empty",
        "fixedVhfRadio",
        VesselCommunication.FIXED_VHF_RADIO,
        Validators.required("").applies
      ),
    ]),
    portableVhfRadio: new FieldInput(portableVhfRadio),
    portableVhfRadioInput: new FieldInput(portableVhfRadioInput, [
      Validators.conditionalOnValue(
        "Portable VHF radio must not be empty",
        "portableVhfRadio",
        VesselCommunication.PORTABLE_VHF_RADIO,
        Validators.required("").applies
      ),
    ]),
    satelliteTelephone: new FieldInput(satelliteTelephone),
    satelliteTelephoneInput: new FieldInput(satelliteTelephoneInput, [
      Validators.conditionalOnValue(
        "Satellite telephone must not be empty",
        "satelliteTelephone",
        VesselCommunication.SATELLITE_TELEPHONE,
        Validators.required("").applies
      ),
    ]),
    mobileTelephone: new FieldInput(mobileTelephone),
    mobileTelephoneInput1: new FieldInput(mobileTelephoneInput1, [
      Validators.conditionalOnValue(
        "Mobile telephone must not be empty",
        "mobileTelephone",
        VesselCommunication.MOBILE_TELEPHONE,
        Validators.required("").applies
      ),
    ]),
    mobileTelephoneInput2: new FieldInput(mobileTelephoneInput2),
  });
};

const VesselCommunications: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const fieldManager = getFieldManager(formData);
  if (needsValidation) {
    fieldManager.markAsDirty();
  }
  const pageHeading = "What types of communications are on board the vessel?";

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/about-the-vessel" />}
      title={pageHeading}
      pageHasErrors={fieldManager.hasErrors()}
    >
      <Grid
        mainContent={
          <>
            <PageHeadingInfo
              heading={pageHeading}
              fieldManager={fieldManager}
            />
            <VesselCommunicationsForm fields={fieldManager.fields} />
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const PageHeadingInfo: FunctionComponent<PageHeadingInfoProps> = ({
  heading,
  fieldManager: formGroup,
}: PageHeadingInfoProps) => (
  <>
    <PageHeading>{heading}</PageHeading>
    <FormErrorSummary formErrors={formGroup.errorSummary()} />
    <GovUKBody>
      Details about the onboard communications will be critical for Search and
      Rescue when trying to contact you in an emergency.
    </GovUKBody>
    <GovUKBody>
      If you have a radio licence and have a Very High Frequency (VHF) and/or
      Very High Frequency (VHF) / Digital Selective Calling (DSC) radio, you can{" "}
      <AnchorLink href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio">
        find up your Call Sign and Maritime Mobile Service Identity (MMSI)
        number on the OFCOM website.
      </AnchorLink>
    </GovUKBody>
  </>
);

const VesselCommunicationsForm: FunctionComponent<VesselCommunicationsProps> = ({
  fields,
}: VesselCommunicationsProps) => (
  <Form action="/register-a-beacon/vessel-communications">
    <CallSign value={fields.callSign.value} />

    <TypesOfCommunication fields={fields} />

    <Button buttonText="Continue" />
  </Form>
);

const CallSign: FunctionComponent<FormInputProps> = ({
  value,
}: FormInputProps) => (
  <>
    <FormGroup className="govuk-!-margin-top-4">
      <Input
        id="callSign"
        labelClassName="govuk-label--s"
        label="Vessel Call Sign (optional)"
        hintText="This is the unique Call Sign associated to this vessel"
        defaultValue={value}
        numOfChars={20}
      />
    </FormGroup>
  </>
);

const TypesOfCommunication: FunctionComponent<VesselCommunicationsProps> = ({
  fields,
}: VesselCommunicationsProps) => (
  <FormFieldset>
    <FormLegend className="govuk-fieldset__legend--s">
      Types of communication devices onboard
      <FormHint forId="typesOfCommunication">
        Tick all that apply and provide as much detail as you can
      </FormHint>
    </FormLegend>

    <FormGroup>
      <CheckboxList conditional={true}>
        <CheckboxListItem
          id="vhfRadio"
          value={VesselCommunication.VHF_RADIO}
          defaultChecked={
            fields.vhfRadio.value === VesselCommunication.VHF_RADIO
          }
          label="VHF Radio"
        />

        <CheckboxListItem
          id="fixedVhfRadio"
          label="Fixed VHF/DSC Radio"
          value={VesselCommunication.FIXED_VHF_RADIO}
          defaultChecked={
            fields.fixedVhfRadio.value === VesselCommunication.FIXED_VHF_RADIO
          }
          conditional={true}
        >
          <FormGroup errorMessages={fields.fixedVhfRadioInput.errorMessages()}>
            <Input
              id="fixedVhfRadioInput"
              label="Fixed MMSI number"
              hintText="This is the unique MMSI number associated to the vessel, it is 9
          digits long"
              defaultValue={fields.fixedVhfRadioInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="portableVhfRadio"
          value={VesselCommunication.PORTABLE_VHF_RADIO}
          defaultChecked={
            fields.portableVhfRadio.value ===
            VesselCommunication.PORTABLE_VHF_RADIO
          }
          label="Portable VHF/DSC Radio"
          conditional={true}
        >
          <FormGroup
            errorMessages={fields.portableVhfRadioInput.errorMessages()}
          >
            <Input
              id="portableVhfRadioInput"
              label="Portable MMSI number"
              hintText="This is the unique MMSI number associated to the portable radio and is 9 numbers long. E.g. starts with 2359xxxxx"
              defaultValue={fields.portableVhfRadioInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="satelliteTelephone"
          value={VesselCommunication.SATELLITE_TELEPHONE}
          defaultChecked={
            fields.satelliteTelephone.value ===
            VesselCommunication.SATELLITE_TELEPHONE
          }
          label="Satellite Telephone"
          conditional={true}
        >
          <FormGroup
            errorMessages={fields.satelliteTelephoneInput.errorMessages()}
          >
            <Input
              id="satelliteTelephoneInput"
              label="Enter phone number"
              hintText="Iridium usually start: +8707, Thuraya usually start: +8821, Globalstar usually start: +3364)"
              defaultValue={fields.satelliteTelephoneInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="mobileTelephone"
          value={VesselCommunication.MOBILE_TELEPHONE}
          defaultChecked={
            fields.mobileTelephone.value ===
            VesselCommunication.MOBILE_TELEPHONE
          }
          label="Mobile Telephone(s)"
          conditional={true}
        >
          <FormGroup
            errorMessages={fields.mobileTelephoneInput1.errorMessages()}
          >
            <Input
              id="mobileTelephoneInput1"
              label="Mobile number 1"
              inputClassName="govuk-!-margin-bottom-4"
              defaultValue={fields.mobileTelephoneInput1.value}
            />
          </FormGroup>

          <Input
            id="mobileTelephoneInput2"
            label="Mobile number 2 (optional)"
            defaultValue={fields.mobileTelephoneInput2.value}
          />
        </CheckboxListItem>
      </CheckboxList>
    </FormGroup>
  </FormFieldset>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/more-vessel-details",
  getFieldManager
);

export default VesselCommunications;
