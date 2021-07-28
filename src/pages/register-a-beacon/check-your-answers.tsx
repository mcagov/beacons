import { GetServerSideProps } from "next";
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
import { DraftBeaconUse } from "../../entities/DraftBeaconUse";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { Environment } from "../../lib/deprecatedRegistration/types";
import { FormSubmission } from "../../lib/formCache";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs } from "../../lib/urls";
import {
  makeEnumValueUserFriendly,
  ordinal,
  sentenceCase,
} from "../../lib/writingStyle";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserViewedPage } from "../../router/rules/IfUserViewedPage";

interface CheckYourAnswersProps {
  registration: DraftRegistration;
}

interface CheckYourAnswersDataRowItemProps {
  label?: string;
  value?: string;
}

interface CheckYourAnswersBeaconUseSectionProps {
  index: number;
  use: DraftBeaconUse;
  href?: string;
}

const noData = "-";

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersProps> = ({
  registration,
}: CheckYourAnswersProps): JSX.Element => {
  const pageHeading = "Check your answers";
  const useSections = [];
  for (const [index, use] of registration.uses.entries()) {
    useSections.push(
      <BeaconUseSection index={index} use={use} key={`row${index}`} />
    );
  }

  return (
    <>
      <Layout
        navigation={<BackButton href={PageURLs.emergencyContact} />}
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
                href={PageURLs.applicationComplete}
              />
            </>
          }
        />
      </Layout>
    </>
  );
};

const CheckYourAnswersDataRowItem: FunctionComponent<CheckYourAnswersDataRowItemProps> =
  ({ label, value }: CheckYourAnswersDataRowItemProps): JSX.Element => (
    <>
      {label ? label + ": " : ""}
      {value ? value : noData}
      <br />
    </>
  );

const BeaconDetailsSection: FunctionComponent<DraftRegistration> = ({
  manufacturer,
  model,
  hexId,
}: DraftRegistration): JSX.Element => (
  <>
    <SectionHeading>About the beacon being registered</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Beacon information"
        actions={[{ text: "Change", href: PageURLs.checkBeaconDetails }]}
      >
        <CheckYourAnswersDataRowItem
          label="Manufacturer"
          value={manufacturer}
        />
        <CheckYourAnswersDataRowItem label="Model" value={model} />
        <CheckYourAnswersDataRowItem label="Hex ID/UIN" value={hexId} />
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconInformationSection: FunctionComponent<DraftRegistration> = ({
  manufacturerSerialNumber,
  chkCode,
  batteryExpiryDateMonth,
  batteryExpiryDateYear,
  lastServicedDateMonth,
  lastServicedDateYear,
}: DraftRegistration): JSX.Element => (
  <>
    <SummaryList>
      <SummaryListItem
        labelText="Additional beacon information"
        actions={[{ text: "Change", href: PageURLs.beaconInformation }]}
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

const BeaconUseSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
    const href = `${PageURLs.environment}?useIndex=${index}`;
    let aboutTheSection = <></>;
    let commsSection = <></>;
    switch (use.environment) {
      case Environment.MARITIME:
        aboutTheSection = <AboutTheVesselSubSection index={index} use={use} />;
        commsSection = (
          <CommunicationsSubSection
            index={index}
            use={use}
            href={PageURLs.vesselCommunications}
          />
        );
        break;
      case Environment.AVIATION:
        aboutTheSection = (
          <AboutTheAircraftSubSection index={index} use={use} />
        );
        commsSection = (
          <CommunicationsSubSection
            index={index}
            use={use}
            href={PageURLs.aircraftCommunications}
          />
        );
        break;
      case Environment.LAND:
        commsSection = (
          <CommunicationsSubSection
            index={index}
            use={use}
            href={PageURLs.landCommunications}
          />
        );
        break;
    }
    return (
      <>
        <SectionHeading>
          {sentenceCase(ordinal(index + 1))} use for the beacon
        </SectionHeading>

        <SummaryList>
          <SummaryListItem
            labelText="Beacon use"
            actions={[{ text: "Change", href: href }]}
          >
            <CheckYourAnswersDataRowItem
              value={makeEnumValueUserFriendly(use.environment)}
            />
            {use.purpose && (
              <CheckYourAnswersDataRowItem
                value={makeEnumValueUserFriendly(use.purpose)}
              />
            )}
            <CheckYourAnswersDataRowItem
              value={makeEnumValueUserFriendly(use.activity)}
            />
          </SummaryListItem>
        </SummaryList>
        {aboutTheSection}
        {commsSection}
        <MoreDetailsSubSection index={index} use={use} />
      </>
    );
  };

const AboutTheVesselSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
    const href = `${PageURLs.aboutTheVessel}?useIndex=${index}`;
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="About the vessel, rig or windfarm"
            actions={[{ text: "Change", href: href }]}
          >
            {use.vesselName && (
              <CheckYourAnswersDataRowItem
                label="Name"
                value={use.vesselName}
              />
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
            {use.ssrNumber && (
              <CheckYourAnswersDataRowItem
                label="Small Ships Register number"
                value={use.ssrNumber}
              />
            )}
            {use.rssNumber && (
              <CheckYourAnswersDataRowItem
                label=" Registry of Shipping and Seamen (RSS) number"
                value={use.rssNumber}
              />
            )}
            {use.officialNumber && (
              <CheckYourAnswersDataRowItem
                label="Official number"
                value={use.officialNumber}
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

const AboutTheAircraftSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
    const href = `${PageURLs.aboutTheAircraft}?useIndex=${index}`;

    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="About the aircraft"
            actions={[{ text: "Change", href: href }]}
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
              label="DeprecatedRegistration mark"
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

const CommunicationsSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> =
  ({
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
            actions={[{ text: "Change", href: href }]}
          >
            {use.environment === Environment.MARITIME && (
              <CheckYourAnswersDataRowItem
                label="Callsign"
                value={use.callSign}
              />
            )}
            {use.fixedVhfRadio === "true" && (
              <>
                Fixed VHF/DSC
                <br />
              </>
            )}
            {use.fixedVhfRadio === "true" && use.fixedVhfRadioInput && (
              <CheckYourAnswersDataRowItem
                label="MMSI"
                value={use.fixedVhfRadioInput}
              />
            )}
            {use.vhfRadio === "true" && (
              <>
                VHF Radio
                <br />
              </>
            )}
            {use.portableVhfRadio === "true" && (
              <>
                Portable VHF/DSC
                <br />
              </>
            )}
            {use.portableVhfRadio === "true" && use.portableVhfRadioInput && (
              <CheckYourAnswersDataRowItem
                label="Portable MMSI"
                value={use.portableVhfRadioInput}
              />
            )}
            {use.mobileTelephone === "true" && (
              <CheckYourAnswersDataRowItem
                label="Mobile telephone (1)"
                value={use.mobileTelephoneInput1}
              />
            )}
            {use.mobileTelephone === "true" && (
              <CheckYourAnswersDataRowItem
                label="Mobile telephone (2)"
                value={use.mobileTelephoneInput2}
              />
            )}
            {use.satelliteTelephone === "true" && (
              <CheckYourAnswersDataRowItem
                label="Satellite telephone"
                value={use.satelliteTelephoneInput}
              />
            )}
            {use.otherCommunication === "true" && (
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

const MoreDetailsSubSection: FunctionComponent<CheckYourAnswersBeaconUseSectionProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSectionProps): JSX.Element => {
    const href = `${PageURLs.moreDetails}?useIndex=${index}`;
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="More details"
            actions={[{ text: "Change", href: href }]}
          >
            <CheckYourAnswersDataRowItem value={use.moreDetails} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };

const BeaconOwnerSection: FunctionComponent<DraftRegistration> = ({
  ownerFullName,
  ownerTelephoneNumber,
  ownerAlternativeTelephoneNumber,
  ownerEmail,
}: DraftRegistration): JSX.Element => (
  <>
    <SectionHeading>About the beacon owner</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Owner details"
        actions={[{ text: "Change", href: PageURLs.aboutBeaconOwner }]}
      >
        <CheckYourAnswersDataRowItem value={ownerFullName} />
        <CheckYourAnswersDataRowItem value={ownerTelephoneNumber} />
        <CheckYourAnswersDataRowItem value={ownerAlternativeTelephoneNumber} />
        <CheckYourAnswersDataRowItem value={ownerEmail} />
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconOwnerAddressSection: FunctionComponent<DraftRegistration> = ({
  ownerAddressLine1,
  ownerAddressLine2,
  ownerTownOrCity,
  ownerCounty,
  ownerPostcode,
}: DraftRegistration): JSX.Element => {
  return (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="Address"
          actions={[{ text: "Change", href: PageURLs.beaconOwnerAddress }]}
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

const BeaconOwnerEmergencyContactsSection: FunctionComponent<FormSubmission> =
  ({
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
            actions={[{ text: "Change", href: PageURLs.emergencyContact }]}
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
            actions={[{ text: "Change", href: PageURLs.emergencyContact }]}
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
            actions={[{ text: "Change", href: PageURLs.emergencyContact }]}
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

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new IfUserViewedPage(context, props(context)),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<CheckYourAnswersProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );

  return {
    registration: draftRegistration,
  };
};

export default CheckYourAnswersPage;
