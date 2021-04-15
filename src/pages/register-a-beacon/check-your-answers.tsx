import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, StartButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../../components/Typography";
import { FormSubmission } from "../../lib/formCache";
import {
  decorateGetServerSidePropsContext,
  withCookieRedirect,
} from "../../lib/middleware";
import {
  BeaconUse,
  Environment,
  IRegistration,
} from "../../lib/registration/types";
import { useRankString } from "../../lib/utils";

interface CheckYourAnswersProps {
  registration: IRegistration;
}

interface CheckYourAnswersDataRowItemProps {
  label?: string;
  value?: string;
}

interface CheckYourAnswersBeaconUseSectionProps {
  index: number;
  use: BeaconUse;
  href?: string;
}

const noData = "no data";

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersProps> = ({
  registration,
}: CheckYourAnswersProps): JSX.Element => {
  const pageHeading = "Check your answers";
  const useSections = [];
  for (const [index, use] of registration.uses.entries()) {
    // TODO push index when we know how to convert index to first, second, third (helper class?)
    useSections.push(
      <BeaconUseSection index={index} use={use} key={`row${index}`} />
    );
  }

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
              <GovUKBody>
                Please check you answer before sending in your registration
                application
              </GovUKBody>
              <BeaconDetailsSection {...registration} />
              <BeaconInformationSection {...registration} />
              {useSections}
              <BeaconOwnerSection {...registration} />
              <BeaconOwnerAddressSection {...registration} />
              <BeaconOwnerEmergencyContactsSection {...registration} />
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

const CheckYourAnswersDataRowItem: FunctionComponent<CheckYourAnswersDataRowItemProps> = ({
  label,
  value,
}: CheckYourAnswersDataRowItemProps): JSX.Element => (
  <>
    {label ? label + ": " : ""}
    {value ? value : noData}
    <br />
  </>
);

const BeaconDetailsSection: FunctionComponent<IRegistration> = ({
  manufacturer,
  model,
  hexId,
}: IRegistration): JSX.Element => (
  <>
    <SectionHeading>About the beacon being registered</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Beacon information"
        href="/register-a-beacon/check-beacon-details"
        actionText="Change"
      >
        <CheckYourAnswersDataRowItem value={manufacturer} />
        <CheckYourAnswersDataRowItem value={model} />
        <CheckYourAnswersDataRowItem label="Hex ID/UIN" value={hexId} />
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
    <SummaryList>
      <SummaryListItem
        labelText="Additional beacon information"
        href="/register-a-beacon/beacon-information"
        actionText="Change"
      >
        <CheckYourAnswersDataRowItem
          label="Serial number"
          value={manufacturerSerialNumber}
        />
        <CheckYourAnswersDataRowItem label="CHK code" value={chkCode} />
        <CheckYourAnswersDataRowItem
          label="Battery expiry"
          value={
            batteryExpiryDateMonth
              ? batteryExpiryDateMonth + ", " + batteryExpiryDateYear
              : batteryExpiryDateYear
          }
        />
        <CheckYourAnswersDataRowItem
          label="Beacon service date"
          value={
            lastServicedDateMonth
              ? lastServicedDateMonth + ", " + lastServicedDateYear
              : lastServicedDateYear
          }
        />
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconUseSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> = ({
  index,
  use,
}: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
  const href = `/register-a-beacon/beacon-use?useIndex=${index}`;
  let aboutTheSection = <></>;
  let commsSection = <></>;
  switch (use.environment) {
    case Environment.MARITIME:
      aboutTheSection = <AboutTheVesselSubSection index={index} use={use} />;
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={"/register-a-beacon/vessel-communications"}
        />
      );
      break;
    case Environment.AVIATION:
      aboutTheSection = <AboutTheAircraftSubSection index={index} use={use} />;
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={"/register-a-beacon/aircraft-communications"}
        />
      );
      break;
    case Environment.LAND:
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={"/register-a-beacon/land-other-communications"}
        />
      );
      break;
    case Environment.OTHER:
      commsSection = (
        <CommunicationsSubSection
          index={index}
          use={use}
          href={"/register-a-beacon/land-other-communications"}
        />
      );
      break;
  }
  return (
    <>
      <SectionHeading>
        {useRankString(index + 1)} use for the beacon
      </SectionHeading>

      <SummaryList>
        <SummaryListItem labelText="Beacon use" href={href} actionText="Change">
          <CheckYourAnswersDataRowItem value={use.environment} />
          <CheckYourAnswersDataRowItem value={use.purpose} />
          <CheckYourAnswersDataRowItem value={use.activity} />
        </SummaryListItem>
      </SummaryList>
      {aboutTheSection}
      {commsSection}
      <MoreDetailsSubSection index={index} use={use} />
    </>
  );
};

const AboutTheVesselSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> = ({
  index,
  use,
}: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
  const href = `/register-a-beacon/about-the-vessel?useIndex=${index}`;
  return (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="About the vessel, rig or windfarm"
          href={href}
          actionText="Change"
        >
          {use.vesselName && (
            <CheckYourAnswersDataRowItem label="Name" value={use.vesselName} />
          )}
          <CheckYourAnswersDataRowItem
            label="Max persons onboard"
            value={use.maxCapacity}
          />
          {use.beaconLocation && (
            <CheckYourAnswersDataRowItem
              label="Beacon position"
              value={use.beaconLocation}
            />
          )}
          {use.homeport && (
            <CheckYourAnswersDataRowItem
              label="Homeport"
              value={use.homeport}
            />
          )}
          {use.areaOfOperation && (
            <CheckYourAnswersDataRowItem
              label="Area of operation"
              value={use.areaOfOperation}
            />
          )}
          {use.portLetterNumber && (
            <CheckYourAnswersDataRowItem
              label="Port letter number"
              value={use.portLetterNumber}
            />
          )}
          {use.imoNumber && (
            <CheckYourAnswersDataRowItem
              label="IMO number"
              value={use.imoNumber}
            />
          )}
          {use.officialNumber && (
            <CheckYourAnswersDataRowItem
              label="Official number"
              value={use.officialNumber}
            />
          )}
          {use.ssrNumber && (
            <CheckYourAnswersDataRowItem
              label="Small Ships Register number"
              value={use.ssrNumber}
            />
          )}
          {use.rigPlatformLocation && (
            <CheckYourAnswersDataRowItem
              label="Windfarm, rig or platform location"
              value={use.rigPlatformLocation}
            />
          )}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const AboutTheAircraftSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> = ({
  index,
  use,
}: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
  const href = `/register-a-beacon/about-the-aircraft?useIndex=${index}`;

  return (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="About the aircraft"
          href={href}
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem
            label="Max persons onboard"
            value={use.maxCapacity}
          />
          <CheckYourAnswersDataRowItem
            label="Manufacture and model: "
            value={use.aircraftManufacturer}
          />
          <CheckYourAnswersDataRowItem
            label="Principal airport"
            value={use.principalAirport}
          />
          <CheckYourAnswersDataRowItem
            label="Secondary airport"
            value={use.secondaryAirport}
          />
          <CheckYourAnswersDataRowItem
            label="Registration mark"
            value={use.registrationMark}
          />
          <CheckYourAnswersDataRowItem
            label="24-bit HEX"
            value={use.hexAddress}
          />
          <CheckYourAnswersDataRowItem
            label="CORE/Serial number"
            value={use.cnOrMsnNumber}
          />
          {use.dongle && (
            <CheckYourAnswersDataRowItem
              label="Is this a dongle?"
              value="Yes"
            />
          )}
          <CheckYourAnswersDataRowItem
            label="Beacon position"
            value={use.beaconPosition}
          />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const CommunicationsSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> = ({
  index,
  use,
  href,
}: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
  href = `${href}?useIndex=${index}`;

  return (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="Communications"
          href={href}
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem label="Callsign" value={use.callSign} />
          {use.fixedVhfRadio && "Fixed VHF/DSC"}
          {use.fixedVhfRadioInput && (
            <CheckYourAnswersDataRowItem
              label="MMSI"
              value={use.fixedVhfRadioInput}
            />
          )}
          {use.vhfRadio && "VHF Radio"}
          {use.portableVhfRadio && "Portable VHF/DSC"}
          {use.portableVhfRadioInput && (
            <CheckYourAnswersDataRowItem
              label="Portable MMSI"
              value={use.portableVhfRadioInput}
            />
          )}
          {use.mobileTelephone && (
            <CheckYourAnswersDataRowItem
              label="Mobile telephone (1)"
              value={use.mobileTelephoneInput1}
            />
          )}
          {use.mobileTelephone && (
            <CheckYourAnswersDataRowItem
              label="Mobile telephone (2)"
              value={use.mobileTelephoneInput2}
            />
          )}
          {use.satelliteTelephone && (
            <CheckYourAnswersDataRowItem
              label="Satellite telephone"
              value={use.satelliteTelephoneInput}
            />
          )}
          {use.otherCommunication && (
            <CheckYourAnswersDataRowItem
              label="Other communication"
              value={use.otherCommunicationInput}
            />
          )}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const MoreDetailsSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> = ({
  index,
  use,
}: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
  const href = `/register-a-beacon/more-details?useIndex=${index}`;
  return (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="More details"
          href={href}
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem value={use.moreDetails} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

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
        labelText="Owner details"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        <CheckYourAnswersDataRowItem value={ownerFullName} />
        <CheckYourAnswersDataRowItem value={ownerTelephoneNumber} />
        <CheckYourAnswersDataRowItem value={ownerAlternativeTelephoneNumber} />
        <CheckYourAnswersDataRowItem value={ownerEmail} />
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
  return (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="Address"
          href="/register-a-beacon/beacon-owner-address"
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem value={ownerAddressLine1} />
          <CheckYourAnswersDataRowItem value={ownerAddressLine2} />
          <CheckYourAnswersDataRowItem value={ownerTownOrCity} />
          {ownerCounty && <CheckYourAnswersDataRowItem value={ownerCounty} />}
          <CheckYourAnswersDataRowItem value={ownerPostcode} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const BeaconOwnerEmergencyContactsSection: FunctionComponent<FormSubmission> = ({
  emergencyContact1FullName,
  emergencyContact1TelephoneNumber,
  emergencyContact1AlternativeTelephoneNumber,
  emergencyContact2FullName,
  emergencyContact2TelephoneNumber,
  emergencyContact2AlternativeTelephoneNumber,
  emergencyContact3FullName,
  emergencyContact3TelephoneNumber,
  emergencyContact3AlternativeTelephoneNumber,
}: FormSubmission): JSX.Element => {
  return (
    <>
      <SectionHeading>Emergency contacts</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Contact 1"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem value={emergencyContact1FullName} />
          <CheckYourAnswersDataRowItem
            value={emergencyContact1TelephoneNumber}
          />
          <CheckYourAnswersDataRowItem
            value={emergencyContact1AlternativeTelephoneNumber}
          />
        </SummaryListItem>
        <SummaryListItem
          labelText="Contact 2"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem value={emergencyContact2FullName} />
          <CheckYourAnswersDataRowItem
            value={emergencyContact2TelephoneNumber}
          />
          <CheckYourAnswersDataRowItem
            value={emergencyContact2AlternativeTelephoneNumber}
          />
        </SummaryListItem>
        <SummaryListItem
          labelText="Contact 3"
          href="/register-a-beacon/emergency-contact"
          actionText="Change"
        >
          <CheckYourAnswersDataRowItem value={emergencyContact3FullName} />
          <CheckYourAnswersDataRowItem
            value={emergencyContact3TelephoneNumber}
          />
          <CheckYourAnswersDataRowItem
            value={emergencyContact3AlternativeTelephoneNumber}
          />
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
