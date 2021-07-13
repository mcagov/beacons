import React, { FunctionComponent } from "react";
import { BeaconUse } from "../../lib/registration/types";
import { prettyUseName } from "../../lib/utils";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { AnchorLink, SectionHeading, WarningLink } from "../Typography";

interface BeaconUseSectionProps {
  index: number;
  use: BeaconUse;
  changeUri: string;
  deleteUri: string;
}

export const BeaconUseSection: FunctionComponent<BeaconUseSectionProps> = ({
  index,
  use,
  changeUri,
  deleteUri,
}: BeaconUseSectionProps): JSX.Element => {
  return (
    <>
      <div
        className="govuk-!-margin-bottom-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <SectionHeading classes="govuk-!-margin-0">
          {prettyUseName(use, index)}
        </SectionHeading>

        <div>
          <AnchorLink
            href={changeUri}
            classes="govuk-link--no-visited-state govuk-!-margin-right-4"
          >
            Change
          </AnchorLink>
          <WarningLink href={deleteUri}>Delete</WarningLink>
        </div>
      </div>

      <SummaryList>
        <AboutThisUse use={use} />
        <Communications use={use} />
        <MoreDetailsSubSection use={use} />
      </SummaryList>
    </>
  );
};

const AboutThisUse: FunctionComponent<{ use: BeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => (
  <SummaryListItem labelText="About this use">
    {use.vesselName && (
      <BeaconUseDataRowItem label="Name" value={use.vesselName} />
    )}
    {use.maxCapacity && (
      <BeaconUseDataRowItem
        label="Max persons onboard"
        value={use.maxCapacity}
      />
    )}
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
    {use.aircraftManufacturer && (
      <BeaconUseDataRowItem
        label="Manufacture and model: "
        value={use.aircraftManufacturer}
      />
    )}
    {use.principalAirport && (
      <BeaconUseDataRowItem
        label="Principal airport"
        value={use.principalAirport}
      />
    )}
    {use.secondaryAirport && (
      <BeaconUseDataRowItem
        label="Secondary airport"
        value={use.secondaryAirport}
      />
    )}
    {use.registrationMark && (
      <BeaconUseDataRowItem
        label="Registration mark"
        value={use.registrationMark}
      />
    )}
    {use.hexAddress && (
      <BeaconUseDataRowItem label="24-bit HEX" value={use.hexAddress} />
    )}
    {use.cnOrMsnNumber && (
      <BeaconUseDataRowItem
        label="CORE/Serial number"
        value={use.cnOrMsnNumber}
      />
    )}
    {use.dongle.includes("true") && (
      <BeaconUseDataRowItem label="Is this a dongle?" value="Yes" />
    )}
    {use.beaconPosition && (
      <BeaconUseDataRowItem
        label="Beacon position"
        value={use.beaconPosition}
      />
    )}

    {use.driving.includes("true") && (
      <BeaconUseDataRowItem value="This beacon is used while driving" />
    )}

    {use.cycling.includes("true") && (
      <BeaconUseDataRowItem value="This beacon is used while cycling" />
    )}

    {use.climbingMountaineering.includes("true") && (
      <BeaconUseDataRowItem value="This beacon is used while climbing and/or mountaineering" />
    )}

    {use.skiing.includes("true") && (
      <BeaconUseDataRowItem value="This beacon is used while skiing" />
    )}

    {use.walkingHiking.includes("true") && (
      <BeaconUseDataRowItem value="This beacon is used while walking and/or hiking" />
    )}

    {use.workingRemotely.includes("true") && (
      <>
        <BeaconUseDataRowItem value="This beacon is used while working remotely" />
        <BeaconUseDataRowItem
          label="Working remotely location"
          value={use.workingRemotelyLocation}
        />
        <BeaconUseDataRowItem
          label="Number of people working remotely"
          value={use.workingRemotelyPeopleCount}
        />
      </>
    )}

    {use.windfarm.includes("true") && (
      <>
        <BeaconUseDataRowItem value="This beacon is used at a windfarm or windfarms" />
        <BeaconUseDataRowItem
          label="Windfarm location:"
          value={use.windfarmLocation}
        />
        <BeaconUseDataRowItem
          label="Number of people usually at the windfarm or windfarms:"
          value={use.windfarmPeopleCount}
        />
      </>
    )}

    {use.otherActivityText && (
      <>
        <BeaconUseDataRowItem
          label="Other activity"
          value={use.otherActivityText}
        />
        <BeaconUseDataRowItem
          label="Other activity location"
          value={use.otherActivityLocation}
        />
        <BeaconUseDataRowItem
          label="Number of people present during other activity"
          value={use.otherActivityPeopleCount}
        />
      </>
    )}
  </SummaryListItem>
);

const Communications: FunctionComponent<{ use: BeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => {
  return (
    <SummaryListItem labelText="Communications">
      {use.callSign && (
        <BeaconUseDataRowItem label="Callsign" value={use.callSign} />
      )}
      {use.fixedVhfRadio.includes("true") && (
        <>
          Fixed VHF/DSC radio
          <br />
          {use.fixedVhfRadioInput && (
            <BeaconUseDataRowItem
              label="MMSI number"
              value={use.fixedVhfRadioInput}
            />
          )}
        </>
      )}
      {use.vhfRadio.includes("true") && (
        <>
          VHF Radio
          <br />
        </>
      )}
      {use.portableVhfRadio.includes("true") && (
        <>
          Portable VHF/DSC radio
          <br />
          {use.portableVhfRadioInput && (
            <BeaconUseDataRowItem
              label="MMSI number"
              value={use.portableVhfRadioInput}
            />
          )}
        </>
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
  );
};

const MoreDetailsSubSection: FunctionComponent<{ use: BeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => (
  <SummaryListItem labelText="More details">
    <BeaconUseDataRowItem value={use.moreDetails} />
  </SummaryListItem>
);

const BeaconUseDataRowItem: FunctionComponent<{
  label?: string;
  value?: string;
}> = ({ label, value }: { label?: string; value?: string }): JSX.Element => (
  <>
    {label ? label + ": " : ""}
    {value ? value : ""}
    <br />
  </>
);
