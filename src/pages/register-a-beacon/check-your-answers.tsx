import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent, ReactNode } from "react";
import { BackButton, StartButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { GovUKBody, GovUKList, PageHeading } from "../../components/Typography";
import { CacheEntry } from "../../lib/formCache";
import { getCache, withCookieRedirect } from "../../lib/middleware";
import {
  Beacon,
  BeaconInformation,
  EmergencyContacts,
  MaritimePleasureVessel,
  Owner,
  Vessel,
  VesselCommunication,
  VesselCommunications,
} from "../../lib/types";

interface CheckYourAnswersProps {
  formData: CacheEntry;
}

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersProps> = ({
  formData,
}: CheckYourAnswersProps): JSX.Element => {
  const pageHeading = "Check your answers before sending in your registration";

  // TODO: This page is removed in PR check your answers.
  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/emergency-contact" />}
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <BeaconDetailsSection {...formData} />
              <BeaconInformationSection {...formData} />
              <BeaconUseSection {...formData} />
              <AboutTheVesselSection {...formData} />
              <VesselCommunicationsSection {...formData} />
              <MoreDetailsSection {...formData} />
              <BeaconOwnerSection {...formData} />
              <BeaconOwnerAddressSection {...formData} />
              <BeaconOwnerEmergencyContact1Section {...formData} />
              <BeaconOwnerEmergencyContact2Section {...formData} />
              <BeaconOwnerEmergencyContact3Section {...formData} />
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

const BeaconDetailsSection: FunctionComponent<CacheEntry> = ({
  manufacturer,
  model,
  hexId,
}: Beacon): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Beacon details</h2>

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

const BeaconInformationSection: FunctionComponent<CacheEntry> = ({
  manufacturerSerialNumber,
  chkCode,
  batteryExpiryDateMonth,
  batteryExpiryDateYear,
  lastServicedDateMonth,
  lastServicedDateYear,
}: BeaconInformation): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Beacon information</h2>

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

const BeaconUseSection: FunctionComponent<CacheEntry> = ({
  maritimePleasureVesselUse,
  otherPleasureVesselText,
}: any): JSX.Element => {
  let level3UseText = "";
  switch (maritimePleasureVesselUse) {
    case MaritimePleasureVessel.MOTOR:
      level3UseText = "Motor vessel";
      break;
    case MaritimePleasureVessel.ROWING:
      level3UseText = "Rowing vessel";
      break;
    case MaritimePleasureVessel.SAILING:
      level3UseText = "Sailing vessel";
      break;
    case MaritimePleasureVessel.SMALL_UNPOWERED:
      level3UseText = "Small unpowered vessel";
      break;
    case MaritimePleasureVessel.OTHER:
      level3UseText = otherPleasureVesselText;
      break;
  }

  return (
    <>
      <h2 className="govuk-heading-m">Beacon use</h2>

      <SummaryList>
        <SummaryListItem
          labelText="Primary use of beacon"
          href="/register-a-beacon/primary-beacon-use"
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

const AboutTheVesselSection: FunctionComponent<CacheEntry> = ({
  maxCapacity,
  vesselName,
  homeport,
  areaOfOperation,
  beaconLocation,
}: Vessel): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">About the vessel</h2>

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

const VesselCommunicationsSection: FunctionComponent<CacheEntry> = ({
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
}: VesselCommunications): JSX.Element => {
  let vhfRadioText = "";
  if (vhfRadio == VesselCommunication.VHF_RADIO) vhfRadioText += "YES";

  let vesselMMSINumberText: ReactNode = "";
  if (fixedVhfRadio == VesselCommunication.FIXED_VHF_RADIO) {
    vesselMMSINumberText = (
      <GovUKList>
        <li>YES</li>
      </GovUKList>
    );
  }

  let portableMMSIText: ReactNode = "";
  if (portableVhfRadio == VesselCommunication.PORTABLE_VHF_RADIO) {
    portableMMSIText = (
      <GovUKList>
        <li>YES</li>
      </GovUKList>
    );
  }

  let satelliteTelephoneText: ReactNode = "";
  if (satelliteTelephone == VesselCommunication.SATELLITE_TELEPHONE) {
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
      <h2 className="govuk-heading-m">Vessel communications</h2>

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

const MoreDetailsSection: FunctionComponent<CacheEntry> = ({
  moreDetails,
}: Vessel): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">More about the use</h2>

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

const BeaconOwnerSection: FunctionComponent<CacheEntry> = ({
  beaconOwnerFullName,
  beaconOwnerTelephoneNumber,
  beaconOwnerAlternativeTelephoneNumber,
  beaconOwnerEmail,
}: Owner): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">About the beacon owner</h2>

    <SummaryList>
      <SummaryListItem
        labelText="Name"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {beaconOwnerFullName}
      </SummaryListItem>
      <SummaryListItem
        labelText="Telephone number"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {beaconOwnerTelephoneNumber}
      </SummaryListItem>
      <SummaryListItem
        labelText="Additional telephone number"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {beaconOwnerAlternativeTelephoneNumber}
      </SummaryListItem>
      <SummaryListItem
        labelText="Email address"
        href="/register-a-beacon/about-beacon-owner"
        actionText="Change"
      >
        {beaconOwnerEmail}
      </SummaryListItem>
    </SummaryList>
  </>
);

const BeaconOwnerAddressSection: FunctionComponent<CacheEntry> = ({
  beaconOwnerAddressLine1,
  beaconOwnerAddressLine2,
  beaconOwnerTownOrCity,
  beaconOwnerCounty,
  beaconOwnerPostcode,
}: Owner): JSX.Element => {
  const addressText: ReactNode = (
    <GovUKList>
      <li>{beaconOwnerAddressLine1}</li>
      <li>{beaconOwnerAddressLine2}</li>
      <li>{beaconOwnerTownOrCity}</li>
      {beaconOwnerCounty ? <li>{beaconOwnerCounty}</li> : ""}
      <li>{beaconOwnerPostcode}</li>
    </GovUKList>
  );

  return (
    <>
      <h2 className="govuk-heading-m">Beacon owner address</h2>

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

const BeaconOwnerEmergencyContact1Section: FunctionComponent<CacheEntry> = ({
  emergencyContact1FullName,
  emergencyContact1TelephoneNumber,
  emergencyContact1AlternativeTelephoneNumber,
}: EmergencyContacts): JSX.Element => {
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
      <h2 className="govuk-heading-m">Emergency contact 1</h2>

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

const BeaconOwnerEmergencyContact2Section: FunctionComponent<CacheEntry> = ({
  emergencyContact2FullName,
  emergencyContact2TelephoneNumber,
  emergencyContact2AlternativeTelephoneNumber,
}: EmergencyContacts): JSX.Element => {
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
      <h2 className="govuk-heading-m">Emergency contact 2</h2>

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

const BeaconOwnerEmergencyContact3Section: FunctionComponent<CacheEntry> = ({
  emergencyContact3FullName,
  emergencyContact3TelephoneNumber,
  emergencyContact3AlternativeTelephoneNumber,
}: EmergencyContacts): JSX.Element => {
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
      <h2 className="govuk-heading-m">Emergency contact 3</h2>

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
    <h2 className="govuk-heading-m">Now send in your application</h2>

    <GovUKBody>
      By submitting this registration you are confirming that, to the best of
      your knowledge, the details you are providing are correct.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    const formData: CacheEntry = getCache(context.req.cookies);
    // TODO: State persistence stuff to go her

    return {
      props: { formData },
    };
  }
);

export default CheckYourAnswersPage;
