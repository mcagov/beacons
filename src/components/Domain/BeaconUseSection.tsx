import React, { FunctionComponent } from "react";
import { BeaconUse, Environment } from "../../lib/registration/types";
import { PageURLs } from "../../lib/urls";
import {
  makeEnumValueUserFriendly,
  sentenceCase,
  useRankString,
} from "../../lib/utils";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";

interface BeaconUseSectionProps {
  index: number;
  use: BeaconUse;
  href?: string;
}

export const BeaconUseSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
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
      aboutTheSection = <AboutTheAircraftSubSection index={index} use={use} />;
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
        {sentenceCase(useRankString(index + 1))} use:{" "}
        {makeEnumValueUserFriendly(use.environment)} {"- "}
        {makeEnumValueUserFriendly(use.activity)} (
        {makeEnumValueUserFriendly(use.purpose)})
        <a className="govuk-link" href={href}>
          Change
          <span className="govuk-visually-hidden">Change</span>
        </a>
        <a className="govuk-link" href={href}>
          Delete
          <span className="govuk-visually-hidden">Delete</span>
        </a>
      </SectionHeading>

      {aboutTheSection}
      {commsSection}
      <MoreDetailsSubSection index={index} use={use} />
    </>
  );
};

const AboutTheVesselSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.aboutTheVessel}?useIndex=${index}`;
  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="About the vessel, rig or windfarm">
          {use.vesselName && (
            <BeaconUseDataRowItem label="Name" value={use.vesselName} />
          )}
          <BeaconUseDataRowItem
            label="Max persons onboard"
            value={use.maxCapacity}
          />
          {use.beaconLocation && (
            <BeaconUseDataRowItem
              label="Beacon position"
              value={use.beaconLocation}
            />
          )}
          {use.homeport && (
            <BeaconUseDataRowItem label="Homeport" value={use.homeport} />
          )}
          {use.areaOfOperation && (
            <BeaconUseDataRowItem
              label="Area of operation"
              value={use.areaOfOperation}
            />
          )}
          {use.portLetterNumber && (
            <BeaconUseDataRowItem
              label="Port letter number"
              value={use.portLetterNumber}
            />
          )}
          {use.imoNumber && (
            <BeaconUseDataRowItem label="IMO number" value={use.imoNumber} />
          )}
          {use.ssrNumber && (
            <BeaconUseDataRowItem
              label="Small Ships Register number"
              value={use.ssrNumber}
            />
          )}
          {use.rssNumber && (
            <BeaconUseDataRowItem
              label=" Registry of Shipping and Seamen (RSS) number"
              value={use.rssNumber}
            />
          )}
          {use.officialNumber && (
            <BeaconUseDataRowItem
              label="Official number"
              value={use.officialNumber}
            />
          )}
          {use.rigPlatformLocation && (
            <BeaconUseDataRowItem
              label="Windfarm, rig or platform location"
              value={use.rigPlatformLocation}
            />
          )}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const AboutTheAircraftSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.aboutTheAircraft}?useIndex=${index}`;

  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="About the aircraft">
          <BeaconUseDataRowItem
            label="Max persons onboard"
            value={use.maxCapacity}
          />
          <BeaconUseDataRowItem
            label="Manufacture and model: "
            value={use.aircraftManufacturer}
          />
          <BeaconUseDataRowItem
            label="Principal airport"
            value={use.principalAirport}
          />
          <BeaconUseDataRowItem
            label="Secondary airport"
            value={use.secondaryAirport}
          />
          <BeaconUseDataRowItem
            label="Registration mark"
            value={use.registrationMark}
          />
          <BeaconUseDataRowItem label="24-bit HEX" value={use.hexAddress} />
          <BeaconUseDataRowItem
            label="CORE/Serial number"
            value={use.cnOrMsnNumber}
          />
          {use.dongle && (
            <BeaconUseDataRowItem label="Is this a dongle?" value="Yes" />
          )}
          <BeaconUseDataRowItem
            label="Beacon position"
            value={use.beaconPosition}
          />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const CommunicationsSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
  href,
}: BeaconUseSectionProps): JSX.Element => {
  href = `${href}?useIndex=${index}`;

  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="Communications">
          {use.environment === Environment.MARITIME && (
            <BeaconUseDataRowItem label="Callsign" value={use.callSign} />
          )}
          {use.fixedVhfRadio.includes("true") && (
            <>
              Fixed VHF/DSC
              <br />
            </>
          )}
          {use.fixedVhfRadio.includes("true") && use.fixedVhfRadioInput && (
            <BeaconUseDataRowItem label="MMSI" value={use.fixedVhfRadioInput} />
          )}
          {use.vhfRadio.includes("true") && (
            <>
              VHF Radio
              <br />
            </>
          )}
          {use.portableVhfRadio.includes("true") && (
            <>
              Portable VHF/DSC
              <br />
            </>
          )}
          {use.portableVhfRadio.includes("true") &&
            use.portableVhfRadioInput && (
              <BeaconUseDataRowItem
                label="Portable MMSI"
                value={use.portableVhfRadioInput}
              />
            )}
          {use.mobileTelephone.includes("true") && (
            <BeaconUseDataRowItem
              label="Mobile telephone (1)"
              value={use.mobileTelephoneInput1}
            />
          )}
          {use.mobileTelephone.includes("true") && (
            <BeaconUseDataRowItem
              label="Mobile telephone (2)"
              value={use.mobileTelephoneInput2}
            />
          )}
          {use.satelliteTelephone.includes("true") && (
            <BeaconUseDataRowItem
              label="Satellite telephone"
              value={use.satelliteTelephoneInput}
            />
          )}
          {use.otherCommunication.includes("true") && (
            <BeaconUseDataRowItem
              label="Other communication"
              value={use.otherCommunicationInput}
            />
          )}
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

const MoreDetailsSubSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
}: BeaconUseSectionProps): JSX.Element => {
  const href = `${PageURLs.moreDetails}?useIndex=${index}`;
  return (
    <>
      <SummaryList>
        <SummaryListItem labelText="More details">
          <BeaconUseDataRowItem value={use.moreDetails} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
};

interface CheckYourAnswersDataRowItemProps {
  label?: string;
  value?: string;
}

const BeaconUseDataRowItem: FunctionComponent<CheckYourAnswersDataRowItemProps> =
  ({ label, value }: CheckYourAnswersDataRowItemProps): JSX.Element => (
    <>
      {label ? label + ": " : ""}
      {value ? value : ""}
      <br />
    </>
  );
