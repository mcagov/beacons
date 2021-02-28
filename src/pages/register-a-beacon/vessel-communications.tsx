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
import { AbstractControl } from "../../lib/form/abstractControl";
import { FormControl } from "../../lib/form/formControl";
import { FormGroupControl } from "../../lib/form/formGroupControl";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { VesselCommunication } from "../../lib/types";

interface VesselCommunicationsProps {
  controls: Record<string, AbstractControl>;
}

interface PageHeadingInfoProps {
  heading: string;
  formGroup: FormGroupControl;
}

interface FormInputProps {
  value: string;
}

const getFormGroup = ({
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
}: CacheEntry): FormGroupControl => {
  return new FormGroupControl({
    callSign: new FormControl(callSign),
    vhfRadio: new FormControl(vhfRadio),
    fixedVhfRadio: new FormControl(fixedVhfRadio),
    fixedVhfRadioInput: new FormControl(fixedVhfRadioInput, [
      Validators.conditionalOnValue(
        "Fixed VHF radio must not be empty",
        "fixedVhfRadio",
        VesselCommunication.FIXED_VHF_RADIO,
        Validators.required("").hasErrorFn
      ),
    ]),
    portableVhfRadio: new FormControl(portableVhfRadio),
    portableVhfRadioInput: new FormControl(portableVhfRadioInput, [
      Validators.conditionalOnValue(
        "Portable VHF radio must not be empty",
        "portableVhfRadio",
        VesselCommunication.PORTABLE_VHF_RADIO,
        Validators.required("").hasErrorFn
      ),
    ]),
    satelliteTelephone: new FormControl(satelliteTelephone),
    satelliteTelephoneInput: new FormControl(satelliteTelephoneInput, [
      Validators.conditionalOnValue(
        "Satellite telephone must not be empty",
        "satelliteTelephone",
        VesselCommunication.SATELLITE_TELEPHONE,
        Validators.required("").hasErrorFn
      ),
    ]),
    mobileTelephone: new FormControl(mobileTelephone),
    mobileTelephoneInput1: new FormControl(mobileTelephoneInput1, [
      Validators.conditionalOnValue(
        "Mobile telephone must not be empty",
        "mobileTelephone",
        VesselCommunication.MOBILE_TELEPHONE,
        Validators.required("").hasErrorFn
      ),
    ]),
    mobileTelephoneInput2: new FormControl(mobileTelephoneInput2),
  });
};

const VesselCommunications: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const pageHeading = "What types of communications are on board the vessel?";

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/about-the-vessel" />}
      title={pageHeading}
      pageHasErrors={formGroup.hasErrors()}
    >
      <Grid
        mainContent={
          <>
            <PageHeadingInfo heading={pageHeading} formGroup={formGroup} />
            <VesselCommunicationsForm controls={formGroup.controls} />
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const PageHeadingInfo: FunctionComponent<PageHeadingInfoProps> = ({
  heading,
  formGroup,
}: PageHeadingInfoProps) => (
  <>
    <PageHeading>{heading}</PageHeading>
    <FormErrorSummary formGroup={formGroup} />
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
  controls,
}: VesselCommunicationsProps) => (
  <Form action="/register-a-beacon/vessel-communications">
    <CallSign value={controls.callSign.value} />

    <TypesOfCommunication controls={controls} />

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
  controls,
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
            controls.vhfRadio.value === VesselCommunication.VHF_RADIO
          }
          label="VHF Radio"
        />

        <CheckboxListItem
          id="fixedVhfRadio"
          label="Fixed VHF/DSC Radio"
          value={VesselCommunication.FIXED_VHF_RADIO}
          defaultChecked={
            controls.fixedVhfRadio.value === VesselCommunication.FIXED_VHF_RADIO
          }
          conditional={true}
        >
          <FormGroup
            errorMessages={controls.fixedVhfRadioInput.errorMessages()}
          >
            <Input
              id="fixedVhfRadioInput"
              label="Fixed MMSI number"
              hintText="This is the unique MMSI number associated to the vessel, it is 9
          digits long"
              defaultValue={controls.fixedVhfRadioInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="portableVhfRadio"
          value={VesselCommunication.PORTABLE_VHF_RADIO}
          defaultChecked={
            controls.portableVhfRadio.value ===
            VesselCommunication.PORTABLE_VHF_RADIO
          }
          label="Portable VHF/DSC Radio"
          conditional={true}
        >
          <FormGroup
            errorMessages={controls.portableVhfRadioInput.errorMessages()}
          >
            <Input
              id="portableVhfRadioInput"
              label="Portable MMSI number"
              hintText="This is the unique MMSI number associated to the portable radio and is 9 numbers long. E.g. starts with 2359xxxxx"
              defaultValue={controls.portableVhfRadioInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="satelliteTelephone"
          value={VesselCommunication.SATELLITE_TELEPHONE}
          defaultChecked={
            controls.satelliteTelephone.value ===
            VesselCommunication.SATELLITE_TELEPHONE
          }
          label="Satellite Telephone"
          conditional={true}
        >
          <FormGroup
            errorMessages={controls.satelliteTelephoneInput.errorMessages()}
          >
            <Input
              id="satelliteTelephoneInput"
              label="Enter phone number"
              hintText="Iridium usually start: +8707, Thuraya usually start: +8821, Globalstar usually start: +3364)"
              defaultValue={controls.satelliteTelephoneInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="mobileTelephone"
          value={VesselCommunication.MOBILE_TELEPHONE}
          defaultChecked={
            controls.mobileTelephone.value ===
            VesselCommunication.MOBILE_TELEPHONE
          }
          label="Mobile Telephone(s)"
          conditional={true}
        >
          <FormGroup
            errorMessages={controls.mobileTelephoneInput1.errorMessages()}
          >
            <Input
              id="mobileTelephoneInput1"
              label="Mobile number 1"
              inputClassName="govuk-!-margin-bottom-4"
              defaultValue={controls.mobileTelephoneInput1.value}
            />
          </FormGroup>

          <Input
            id="mobileTelephoneInput2"
            label="Mobile number 2 (optional)"
            defaultValue={controls.mobileTelephoneInput2.value}
          />
        </CheckboxListItem>
      </CheckboxList>
    </FormGroup>
  </FormFieldset>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/more-vessel-details",
  getFormGroup
);

export default VesselCommunications;
