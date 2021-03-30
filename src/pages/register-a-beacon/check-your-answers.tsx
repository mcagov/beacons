import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent, ReactNode } from "react";
import { BackButton, StartButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import {
  GovUKBody,
  GovUKList,
  PageHeading,
  SectionHeading,
} from "../../components/Typography";
import { FormSubmission } from "../../lib/formCache";
import {
  decorateGetServerSidePropsContext,
  withCookieRedirect,
} from "../../lib/middleware";
import {
  Activity,
  BeaconUse,
  Communication,
  IRegistration,
} from "../../lib/registration/types";

interface CheckYourAnswersProps {
  registration: IRegistration;
}

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersProps> = ({
  registration,
}: CheckYourAnswersProps): JSX.Element => {
  const pageHeading = "Check your answers before sending in your registration";
  // TODO: Update to iterate over all beacon uses - upcoming in Sprint 7 please remove afterwards.
  const use: BeaconUse = registration.uses[0];

  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/emergency-contact" />}
        title={pageHeading}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <BeaconDetailsSection {...registration} />
              <BeaconInformationSection {...registration} />
              <BeaconUseSection {...use} />
              <AboutTheVesselSection {...use} />
              <VesselCommunicationsSection {...use} />
              <MoreDetailsSection {...use} />
              <BeaconOwnerSection {...registration} />
              <BeaconOwnerAddressSection {...registration} />
              <BeaconOwnerEmergencyContact1Section {...registration} />
              <BeaconOwnerEmergencyContact2Section {...registration} />
              <BeaconOwnerEmergencyContact3Section {...registration} />
              <SendYourApplication />
              <StartButton
                buttonText="Accept and send"
                href="/register-a-beacon/application-complete"
              />
            </>
          }
        />
      </Layout>
    </>
  );
};

const BeaconDetailsSection: FunctionComponent<IRegistration> = ({
  manufacturer,
  model,
  hexId,
}: IRegistration): JSX.Element => (
  <>
    <SectionHeading>Beacon details</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Beacon manufacturer"
        href="/register-a-beacon/check-beacon-details"
        actionText="Change"
      >
        {manufacturer}
      </SummaryListItem>
      <SummaryListItem
        labelText="Beacon model"
        href="/register-a-beacon/check-beacon-details"
        actionText="Change"
      >
        {model}
      </SummaryListItem>
      <SummaryListItem
        labelText="Beacon HEX ID"
        href="/register-a-beacon/check-beacon-details"
        actionText="Change"
      >
        {hexId}
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconInformationSection: FunctionComponent<IRegistration> = ({
  manufacturerSerialNumber,
  chkCode,
  batteryExpiryDateMonth,
  batteryExpiryDateYear,
  lastServicedDateMonth,
  lastServicedDateYear,
}: IRegistration): JSX.Element => (
  <>
    <SectionHeading>Beacon information</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Manufacturer serial number"
        href="/register-a-beacon/beacon-information"
        actionText="Change"
      >
        {manufacturerSerialNumber}
      </SummaryListItem>
      <SummaryListItem
        labelText="Beacon CHK code"
        href="/register-a-beacon/beacon-information"
        actionText="Change"
      >
        {chkCode}
      </SummaryListItem>
      <SummaryListItem
        labelText="Battery expiry date"
        href="/register-a-beacon/beacon-information"
        actionText="Change"
      >
        {batteryExpiryDateMonth}
        {batteryExpiryDateMonth ? "," : ""} {batteryExpiryDateYear}
      </SummaryListItem>
      <SummaryListItem
        labelText="Beacon service date"
        href="/register-a-beacon/beacon-information"
        actionText="Change"
      >
        {lastServicedDateMonth}
        {lastServicedDateMonth ? "," : ""} {lastServicedDateYear}
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconUseSection: FunctionComponent<BeaconUse> = ({
  activity,
  otherActivityText,
}: BeaconUse): JSX.Element => {
  let level3UseText = "";
  switch (activity) {
    case Activity.MOTOR:
      level3UseText = "Motor vessel";
      break;
    case Activity.ROWING:
      level3UseText = "Rowing vessel";
      break;
    case Activity.SAILING:
      level3UseText = "Sailing vessel";
      break;
    case Activity.SMALL_UNPOWERED:
      level3UseText = "Small unpowered vessel";
      break;
    case Activity.OTHER:
      level3UseText = otherActivityText;
      break;
  }

  return (
    <>
      <SectionHeading>Beacon use</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Primary beacon activity"
          href="/register-a-beacon/activity"
          actionText="Change"
        >
          {"Maritime"}
          <br />
          {"Pleasure"}
          <br />
          {level3UseText}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const AboutTheVesselSection: FunctionComponent<BeaconUse> = ({
  maxCapacity,
  vesselName,
  homeport,
  areaOfOperation,
  beaconLocation,
}: BeaconUse): JSX.Element => (
  <>
    <SectionHeading>About the vessel</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Max number of persons onboard"
        href="/register-a-beacon/about-the-vessel"
        actionText="Change"
      >
        {maxCapacity}
      </SummaryListItem>
      <SummaryListItem
        labelText="Vessel name"
        href="/register-a-beacon/about-the-vessel"
        actionText="Change"
      >
        {vesselName}
      </SummaryListItem>
      <SummaryListItem
        labelText="Homeport"
        href="/register-a-beacon/about-the-vessel"
        actionText="Change"
      >
        {homeport}
      </SummaryListItem>
      <SummaryListItem
        labelText="Area of operation"
        href="/register-a-beacon/about-the-vessel"
        actionText="Change"
      >
        {areaOfOperation}
      </SummaryListItem>
      <SummaryListItem
        labelText="How beacon will be used"
        href="/register-a-beacon/about-the-vessel"
        actionText="Change"
      >
        {beaconLocation}
      </SummaryListItem>
    </SummaryList>
  </>
);

const VesselCommunicationsSection: FunctionComponent<BeaconUse> = ({
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
}: BeaconUse): JSX.Element => {
  let vhfRadioText = "";
  if (vhfRadio == Communication.VHF_RADIO) vhfRadioText += "YES";

  let vesselMMSINumberText: ReactNode = "";
  if (fixedVhfRadio == Communication.FIXED_VHF_RADIO) {
    vesselMMSINumberText = (
      <GovUKList>
        <li>YES</li>
      </GovUKList>
    );
  }

  let portableMMSIText: ReactNode = "";
  if (portableVhfRadio == Communication.PORTABLE_VHF_RADIO) {
    portableMMSIText = (
      <GovUKList>
        <li>YES</li>
      </GovUKList>
    );
  }

  let satelliteTelephoneText: ReactNode = "";
  if (satelliteTelephone == Communication.SATELLITE_TELEPHONE) {
    satelliteTelephoneText = (
      <GovUKList>
        <li>{satelliteTelephoneInput}</li>
      </GovUKList>
    );
  }

  let mobileTelephoneText: ReactNode = "";
  if (mobileTelephone) {
    mobileTelephoneText = (
      <GovUKList>
        <li>{mobileTelephoneInput1}</li>
        <li>{mobileTelephoneInput2}</li>
      </GovUKList>
    );
  }

  return (
    <>
      <SectionHeading>Vessel communications</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Call sign"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {callSign}
        </SummaryListItem>
        <SummaryListItem
          labelText="VHF Radio"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {vhfRadioText}
        </SummaryListItem>
        <SummaryListItem
          labelText="Fixed VHF/DSC Radio"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {vesselMMSINumberText}
        </SummaryListItem>
        <SummaryListItem
          labelText="Fixed MMSI number"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {fixedVhfRadioInput}
        </SummaryListItem>
        <SummaryListItem
          labelText="Portable VHF/DSC Radio"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {portableMMSIText}
        </SummaryListItem>
        <SummaryListItem
          labelText="Portable MMSI number"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {portableVhfRadioInput}
        </SummaryListItem>
        <SummaryListItem
          labelText="Satellite Telephone"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {satelliteTelephoneText}
        </SummaryListItem>
        <SummaryListItem
          labelText="Mobile Telephone(s)"
          href="/register-a-beacon/vessel-communications"
          actionText="Change"
        >
          {mobileTelephoneText}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const MoreDetailsSection: FunctionComponent<BeaconUse> = ({
  moreDetails,
}: BeaconUse): JSX.Element => (
  <>
    <SectionHeading>More about the use</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Use description"
        href="/register-a-beacon/more-details"
        actionText="Change"
      >
        {moreDetails}
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconOwnerSection: FunctionComponent<IRegistration> = ({
  ownerFullName,
  ownerTelephoneNumber,
  ownerAlternativeTelephoneNumber,
  ownerEmail,
}: IRegistration): JSX.Element => (
  <>
    <SectionHeading>About the beacon owner</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Name"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {ownerFullName}
      </SummaryListItem>
      <SummaryListItem
        labelText="Telephone number"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {ownerTelephoneNumber}
      </SummaryListItem>
      <SummaryListItem
        labelText="Additional telephone number"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {ownerAlternativeTelephoneNumber}
      </SummaryListItem>
      <SummaryListItem
        labelText="Email address"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {ownerEmail}
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconOwnerAddressSection: FunctionComponent<IRegistration> = ({
  ownerAddressLine1,
  ownerAddressLine2,
  ownerTownOrCity,
  ownerCounty,
  ownerPostcode,
}: IRegistration): JSX.Element => {
  const addressText: ReactNode = (
    <GovUKList>
      <li>{ownerAddressLine1}</li>
      <li>{ownerAddressLine2}</li>
      <li>{ownerTownOrCity}</li>
      {ownerCounty ? <li>{ownerCounty}</li> : ""}
      <li>{ownerPostcode}</li>
    </GovUKList>
  );

  return (
    <>
      <SectionHeading>Beacon owner address</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Address"
          href="/register-a-beacon/beacon-owner-address"
          actionText="Change"
        >
          {addressText}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const BeaconOwnerEmergencyContact1Section: FunctionComponent<FormSubmission> = ({
  emergencyContact1FullName,
  emergencyContact1TelephoneNumber,
  emergencyContact1AlternativeTelephoneNumber,
}: FormSubmission): JSX.Element => {
  const contactDetails: ReactNode = (
    <GovUKList>
      <li>{emergencyContact1TelephoneNumber}</li>
      {emergencyContact1AlternativeTelephoneNumber ? (
        <li>{emergencyContact1AlternativeTelephoneNumber}</li>
      ) : (
        ""
      )}
    </GovUKList>
  );

  return (
    <>
      <SectionHeading>Emergency contact 1</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Name"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          {emergencyContact1FullName}
        </SummaryListItem>
        <SummaryListItem
          labelText="Contact details"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          {contactDetails}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const BeaconOwnerEmergencyContact2Section: FunctionComponent<IRegistration> = ({
  emergencyContact2FullName,
  emergencyContact2TelephoneNumber,
  emergencyContact2AlternativeTelephoneNumber,
}: IRegistration): JSX.Element => {
  const contactDetails: ReactNode = (
    <GovUKList>
      <li>{emergencyContact2TelephoneNumber}</li>
      {emergencyContact2AlternativeTelephoneNumber ? (
        <li>{emergencyContact2AlternativeTelephoneNumber}</li>
      ) : (
        ""
      )}
    </GovUKList>
  );

  return (
    <>
      <SectionHeading>Emergency contact 2</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Name"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          {emergencyContact2FullName}
        </SummaryListItem>
        <SummaryListItem
          labelText="Contact details"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          {contactDetails}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const BeaconOwnerEmergencyContact3Section: FunctionComponent<IRegistration> = ({
  emergencyContact3FullName,
  emergencyContact3TelephoneNumber,
  emergencyContact3AlternativeTelephoneNumber,
}: IRegistration): JSX.Element => {
  const contactDetails: ReactNode = (
    <GovUKList>
      <li>{emergencyContact3TelephoneNumber}</li>
      {emergencyContact3AlternativeTelephoneNumber ? (
        <li>{emergencyContact3AlternativeTelephoneNumber}</li>
      ) : (
        ""
      )}
    </GovUKList>
  );

  return (
    <>
      <SectionHeading>Emergency contact 3</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Name"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          {emergencyContact3FullName}
        </SummaryListItem>
        <SummaryListItem
          labelText="Contact details"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          {contactDetails}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const SendYourApplication: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Now send in your application</SectionHeading>

    <GovUKBody>
      By submitting this registration you are confirming that, to the best of
      your knowledge, the details you are providing are correct.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    const decoratedContext = await decorateGetServerSidePropsContext(context);

    return {
      props: { registration: decoratedContext.registration.registration },
    };
  }
);

export default CheckYourAnswersPage;
