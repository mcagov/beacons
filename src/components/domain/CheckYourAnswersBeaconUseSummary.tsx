import React, { FunctionComponent } from "react";
import { DraftBeaconUse } from "../../entities/DraftBeaconUse";
import { Environment } from "../../lib/deprecatedRegistration/types";
import { CreateRegistrationPageURLs } from "../../lib/urls";
import {
  makeEnumValueUserFriendly,
  ordinal,
  sentenceCase,
} from "../../lib/writingStyle";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconUseSummaryProps {
  index: number;
  use: DraftBeaconUse;
  href?: string;
}

export const CheckYourAnswersBeaconUseSummary: FunctionComponent<CheckYourAnswersBeaconUseSummaryProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSummaryProps): JSX.Element => {
    const href = `${CreateRegistrationPageURLs.environment}?useId=${index}`;
    let aboutTheSection = <></>;
    let commsSection = <></>;
    switch (use.environment) {
      case Environment.MARITIME:
        aboutTheSection = <AboutTheVesselSubSection index={index} use={use} />;
        commsSection = (
          <CommunicationsSubSection
            index={index}
            use={use}
            href={CreateRegistrationPageURLs.vesselCommunications}
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
            href={CreateRegistrationPageURLs.aircraftCommunications}
          />
        );
        break;
      case Environment.LAND:
        commsSection = (
          <CommunicationsSubSection
            index={index}
            use={use}
            href={CreateRegistrationPageURLs.landCommunications}
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
            <DataRowItem value={makeEnumValueUserFriendly(use.environment)} />
            {use.purpose && (
              <DataRowItem value={makeEnumValueUserFriendly(use.purpose)} />
            )}
            <DataRowItem value={makeEnumValueUserFriendly(use.activity)} />
          </SummaryListItem>
        </SummaryList>
        {aboutTheSection}
        {commsSection}
        <MoreDetailsSubSection index={index} use={use} />
      </>
    );
  };

const AboutTheVesselSubSection: FunctionComponent<CheckYourAnswersBeaconUseSummaryProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSummaryProps): JSX.Element => {
    const href = `${CreateRegistrationPageURLs.aboutTheVessel}?useId=${index}`;
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="About the vessel, rig or windfarm"
            actions={[{ text: "Change", href: href }]}
          >
            {use.vesselName && (
              <DataRowItem label="Name" value={use.vesselName} />
            )}
            <DataRowItem label="Max persons onboard" value={use.maxCapacity} />
            {use.beaconLocation && (
              <DataRowItem label="Beacon position" value={use.beaconLocation} />
            )}
            {use.homeport && (
              <DataRowItem label="Homeport" value={use.homeport} />
            )}
            {use.areaOfOperation && (
              <DataRowItem
                label="Area of operation"
                value={use.areaOfOperation}
              />
            )}
            {use.portLetterNumber && (
              <DataRowItem
                label="Port letter number"
                value={use.portLetterNumber}
              />
            )}
            {use.imoNumber && (
              <DataRowItem label="IMO number" value={use.imoNumber} />
            )}
            {use.ssrNumber && (
              <DataRowItem
                label="Small Ships Register number"
                value={use.ssrNumber}
              />
            )}
            {use.rssNumber && (
              <DataRowItem
                label=" Registry of Shipping and Seamen (RSS) number"
                value={use.rssNumber}
              />
            )}
            {use.officialNumber && (
              <DataRowItem label="Official number" value={use.officialNumber} />
            )}
            {use.rigPlatformLocation && (
              <DataRowItem
                label="Windfarm, rig or platform location"
                value={use.rigPlatformLocation}
              />
            )}
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };

const AboutTheAircraftSubSection: FunctionComponent<CheckYourAnswersBeaconUseSummaryProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSummaryProps): JSX.Element => {
    const href = `${CreateRegistrationPageURLs.aboutTheAircraft}?useId=${index}`;

    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="About the aircraft"
            actions={[{ text: "Change", href: href }]}
          >
            <DataRowItem label="Max persons onboard" value={use.maxCapacity} />
            <DataRowItem
              label="Manufacture and model: "
              value={use.aircraftManufacturer}
            />
            <DataRowItem
              label="Principal airport"
              value={use.principalAirport}
            />
            <DataRowItem
              label="Secondary airport"
              value={use.secondaryAirport}
            />
            <DataRowItem
              label="Registration mark"
              value={use.registrationMark}
            />
            <DataRowItem label="24-bit HEX" value={use.hexAddress} />
            <DataRowItem label="CORE/Serial number" value={use.cnOrMsnNumber} />
            {use.dongle && (
              <DataRowItem label="Is this a dongle?" value="Yes" />
            )}
            <DataRowItem label="Beacon position" value={use.beaconPosition} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };

const CommunicationsSubSection: FunctionComponent<CheckYourAnswersBeaconUseSummaryProps> =
  ({
    index,
    use,
    href,
  }: CheckYourAnswersBeaconUseSummaryProps): JSX.Element => {
    href = `${href}?useId=${index}`;

    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="Communications"
            actions={[{ text: "Change", href: href }]}
          >
            {use.environment === Environment.MARITIME && (
              <DataRowItem label="Callsign" value={use.callSign} />
            )}
            {use.fixedVhfRadio === "true" && (
              <>
                Fixed VHF/DSC
                <br />
              </>
            )}
            {use.fixedVhfRadio === "true" && use.fixedVhfRadioInput && (
              <DataRowItem label="MMSI" value={use.fixedVhfRadioInput} />
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
              <DataRowItem
                label="Portable MMSI"
                value={use.portableVhfRadioInput}
              />
            )}
            {use.mobileTelephone === "true" && (
              <DataRowItem
                label="Mobile telephone (1)"
                value={use.mobileTelephoneInput1}
              />
            )}
            {use.mobileTelephone === "true" && (
              <DataRowItem
                label="Mobile telephone (2)"
                value={use.mobileTelephoneInput2}
              />
            )}
            {use.satelliteTelephone === "true" && (
              <DataRowItem
                label="Satellite telephone"
                value={use.satelliteTelephoneInput}
              />
            )}
            {use.otherCommunication === "true" && (
              <DataRowItem
                label="Other communication"
                value={use.otherCommunicationInput}
              />
            )}
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };

const MoreDetailsSubSection: FunctionComponent<CheckYourAnswersBeaconUseSummaryProps> =
  ({ index, use }: CheckYourAnswersBeaconUseSummaryProps): JSX.Element => {
    const href = `${CreateRegistrationPageURLs.moreDetails}?useId=${index}`;
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="More details"
            actions={[{ text: "Change", href: href }]}
          >
            <DataRowItem value={use.moreDetails} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
