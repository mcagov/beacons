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
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { VesselCommunication } from "../../lib/types";

interface FormInputProps {
  value: string;
}

export const definePageForm = ({
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
}: CacheEntry): FormManager => {
  return new FormManager({
    callSign: new FieldManager(callSign),
    vhfRadio: new FieldManager(vhfRadio),
    fixedVhfRadio: new FieldManager(fixedVhfRadio),
    fixedVhfRadioInput: new FieldManager(
      fixedVhfRadioInput,
      [
        Validators.required(
          "We need your MMSI number if you have a fixed VHF/DSC radio"
        ),
        Validators.wholeNumber(
          "Your fixed MMSI number must only include numbers 0 to 9, with no letters or other characters"
        ),
        Validators.isLength(
          "Your fixed MMSI number must be exactly nine digits long",
          9
        ),
      ],
      [
        {
          dependsOn: "fixedVhfRadio",
          meetingCondition: (value) =>
            value === VesselCommunication.FIXED_VHF_RADIO,
        },
      ]
    ),
    portableVhfRadio: new FieldManager(portableVhfRadio),
    portableVhfRadioInput: new FieldManager(
      portableVhfRadioInput,
      [
        Validators.required(
          "We need your portable MMSI number if you have a portable VHF/DSC radio"
        ),
        Validators.wholeNumber(
          "Your portable MMSI number must only include numbers 0 to 9, with no letters or other characters"
        ),
        Validators.isLength(
          "Your portable MMSI number must be exactly nine digits long",
          9
        ),
      ],
      [
        {
          dependsOn: "portableVhfRadio",
          meetingCondition: (value) =>
            value === VesselCommunication.PORTABLE_VHF_RADIO,
        },
      ]
    ),
    satelliteTelephone: new FieldManager(satelliteTelephone),
    satelliteTelephoneInput: new FieldManager(
      satelliteTelephoneInput,
      [
        Validators.required(
          "We need your phone number if you have a satellite telephone"
        ),
        Validators.phoneNumber(
          "Enter your satellite telephone number in the correct format"
        ),
      ],
      [
        {
          dependsOn: "satelliteTelephone",
          meetingCondition: (value) =>
            value === VesselCommunication.SATELLITE_TELEPHONE,
        },
      ]
    ),
    mobileTelephone: new FieldManager(mobileTelephone),
    mobileTelephoneInput1: new FieldManager(
      mobileTelephoneInput1,
      [
        Validators.required(
          "We need your telephone number if you have a mobile telephone"
        ),
        Validators.phoneNumber(
          "Enter a mobile telephone number, like 07700 982736 or +447700912738"
        ),
      ],
      [
        {
          dependsOn: "mobileTelephone",
          meetingCondition: (value) =>
            value === VesselCommunication.MOBILE_TELEPHONE,
        },
      ]
    ),
    mobileTelephoneInput2: new FieldManager(mobileTelephoneInput2),
  });
};

const VesselCommunications: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "What types of communications are on board the vessel?";

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/about-the-vessel" />}
      title={pageHeading}
      pageHasErrors={form.hasErrors}
      showCookieBanner={showCookieBanner}
    >
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
            <FormErrorSummary formErrors={form.errorSummary} />
            <GovUKBody>
              Details about the onboard communications will be critical for
              Search and Rescue when trying to contact you in an emergency.
            </GovUKBody>
            <GovUKBody>
              If you have a radio licence and have a Very High Frequency (VHF)
              and/or Very High Frequency (VHF) / Digital Selective Calling (DSC)
              radio, you can{" "}
              <AnchorLink href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/ships-radio">
                find up your Call Sign and Maritime Mobile Service Identity
                (MMSI) number on the OFCOM website.
              </AnchorLink>
            </GovUKBody>
            <Form action="/register-a-beacon/vessel-communications">
              <CallSign value={form.fields.callSign.value} />

              <TypesOfCommunication form={form} />

              <Button buttonText="Continue" />
            </Form>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

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

const TypesOfCommunication: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps) => (
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
            form.fields.vhfRadio.value === VesselCommunication.VHF_RADIO
          }
          label="VHF Radio"
        />

        <CheckboxListItem
          id="fixedVhfRadio"
          label="Fixed VHF/DSC Radio"
          value={VesselCommunication.FIXED_VHF_RADIO}
          defaultChecked={
            form.fields.fixedVhfRadio.value ===
            VesselCommunication.FIXED_VHF_RADIO
          }
          conditional={true}
        >
          <FormGroup
            errorMessages={form.fields.fixedVhfRadioInput.errorMessages}
          >
            <Input
              id="fixedVhfRadioInput"
              label="Fixed MMSI number"
              hintText="This is the unique MMSI number associated to the vessel, it is 9
          digits long"
              defaultValue={form.fields.fixedVhfRadioInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="portableVhfRadio"
          value={VesselCommunication.PORTABLE_VHF_RADIO}
          defaultChecked={
            form.fields.portableVhfRadio.value ===
            VesselCommunication.PORTABLE_VHF_RADIO
          }
          label="Portable VHF/DSC Radio"
          conditional={true}
        >
          <FormGroup
            errorMessages={form.fields.portableVhfRadioInput.errorMessages}
          >
            <Input
              id="portableVhfRadioInput"
              label="Portable MMSI number"
              hintText="This is the unique MMSI number associated to the portable radio and is 9 numbers long. E.g. starts with 2359xxxxx"
              defaultValue={form.fields.portableVhfRadioInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="satelliteTelephone"
          value={VesselCommunication.SATELLITE_TELEPHONE}
          defaultChecked={
            form.fields.satelliteTelephone.value ===
            VesselCommunication.SATELLITE_TELEPHONE
          }
          label="Satellite Telephone"
          conditional={true}
        >
          <FormGroup
            errorMessages={form.fields.satelliteTelephoneInput.errorMessages}
          >
            <Input
              id="satelliteTelephoneInput"
              label="Enter phone number"
              hintText="Iridium usually start: +8707, Thuraya usually start: +8821, Globalstar usually start: +3364)"
              defaultValue={form.fields.satelliteTelephoneInput.value}
            />
          </FormGroup>
        </CheckboxListItem>
        <CheckboxListItem
          id="mobileTelephone"
          value={VesselCommunication.MOBILE_TELEPHONE}
          defaultChecked={
            form.fields.mobileTelephone.value ===
            VesselCommunication.MOBILE_TELEPHONE
          }
          label="Mobile Telephone(s)"
          conditional={true}
        >
          <FormGroup
            errorMessages={form.fields.mobileTelephoneInput1.errorMessages}
          >
            <Input
              id="mobileTelephoneInput1"
              label="Mobile number 1"
              inputClassName="govuk-!-margin-bottom-4"
              defaultValue={form.fields.mobileTelephoneInput1.value}
            />
          </FormGroup>

          <Input
            id="mobileTelephoneInput2"
            label="Mobile number 2 (optional)"
            defaultValue={form.fields.mobileTelephoneInput2.value}
          />
        </CheckboxListItem>
      </CheckboxList>
    </FormGroup>
  </FormFieldset>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/more-vessel-details",
  definePageForm
);

export default VesselCommunications;
