import React, { FunctionComponent } from "react";
import { BeaconUse } from "../../entities/BeaconUse";
import { DraftBeaconUse } from "../../entities/DraftBeaconUse";
import { ordinal, prettyUseName, sentenceCase } from "../../lib/writingStyle";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { AnchorLink, SectionHeading, WarningLink } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface BeaconUseSectionProps {
  index: number;
  use: DraftBeaconUse;
  changeUri?: string;
  deleteUri?: string;
}

export const AdditionalBeaconUseSummary: FunctionComponent<BeaconUseSectionProps> =
  ({
    index,
    use,
    changeUri,
    deleteUri,
  }: BeaconUseSectionProps): JSX.Element => {
    const useRank = sentenceCase(ordinal(index + 1)) + " use";

    return (
      <>
        <div
          className="govuk-!-margin-bottom-4 govuk-summary-list"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <SectionHeading classes="govuk-!-margin-0">
            {useRank + ": " + prettyUseName(use)}
          </SectionHeading>

          <div>
            {changeUri && (
              <AnchorLink
                href={changeUri}
                description={useRank}
                classes={`govuk-link--no-visited-state ${
                  deleteUri ? "govuk-!-margin-right-4" : ""
                }`}
              >
                Change
              </AnchorLink>
            )}
            {deleteUri && (
              <WarningLink href={deleteUri} description={useRank}>
                Delete
              </WarningLink>
            )}
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

const AboutThisUse: FunctionComponent<{ use: DraftBeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => (
  <SummaryListItem labelText="About this use">
    {use.vesselName && <DataRowItem label="Name" value={use.vesselName} />}
    {use.maxCapacity && (
      <DataRowItem label="Max persons onboard" value={use.maxCapacity} />
    )}
    {use.beaconLocation && (
      <DataRowItem label="Beacon position" value={use.beaconLocation} />
    )}
    {use.homeport && <DataRowItem label="Homeport" value={use.homeport} />}
    {use.areaOfOperation && (
      <DataRowItem label="Area of operation" value={use.areaOfOperation} />
    )}
    {use.portLetterNumber && (
      <DataRowItem label="Port letter number" value={use.portLetterNumber} />
    )}
    {use.imoNumber && <DataRowItem label="IMO number" value={use.imoNumber} />}
    {use.ssrNumber && (
      <DataRowItem label="Small Ships Register number" value={use.ssrNumber} />
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
    {use.aircraftManufacturer && (
      <DataRowItem
        label="Manufacture and model: "
        value={use.aircraftManufacturer}
      />
    )}
    {use.principalAirport && (
      <DataRowItem label="Principal airport" value={use.principalAirport} />
    )}
    {use.secondaryAirport && (
      <DataRowItem label="Secondary airport" value={use.secondaryAirport} />
    )}
    {use.registrationMark && (
      <DataRowItem label="Registration mark" value={use.registrationMark} />
    )}
    {use.hexAddress && (
      <DataRowItem label="24-bit HEX" value={use.hexAddress} />
    )}
    {use.cnOrMsnNumber && (
      <DataRowItem label="CORE/Serial number" value={use.cnOrMsnNumber} />
    )}
    {use.dongle === "true" && (
      <DataRowItem label="Is this a dongle?" value="Yes" />
    )}
    {use.beaconPosition && (
      <DataRowItem label="Beacon position" value={use.beaconPosition} />
    )}

    {use.driving === "true" && (
      <DataRowItem value="This beacon is used while driving" />
    )}

    {use.cycling === "true" && (
      <DataRowItem value="This beacon is used while cycling" />
    )}

    {use.climbingMountaineering === "true" && (
      <DataRowItem value="This beacon is used while climbing and/or mountaineering" />
    )}

    {use.skiing === "true" && (
      <DataRowItem value="This beacon is used while skiing" />
    )}

    {use.walkingHiking === "true" && (
      <DataRowItem value="This beacon is used while walking and/or hiking" />
    )}

    {use.workingRemotely === "true" && (
      <>
        <DataRowItem value="This beacon is used while working remotely" />
        {use.workingRemotelyLocation && (
          <DataRowItem
            label="Working remotely location"
            value={use.workingRemotelyLocation}
          />
        )}

        {use.workingRemotelyPeopleCount && (
          <DataRowItem
            label="Number of people working remotely"
            value={use.workingRemotelyPeopleCount}
          />
        )}
      </>
    )}

    {use.windfarm === "true" && (
      <>
        <DataRowItem value="This beacon is used at a windfarm or windfarms" />
        {use.windfarmLocation && (
          <DataRowItem
            label="Windfarm location:"
            value={use.windfarmLocation}
          />
        )}
        {use.windfarmPeopleCount && (
          <DataRowItem
            label="Number of people usually at the windfarm or windfarms:"
            value={use.windfarmPeopleCount}
          />
        )}
      </>
    )}

    {use.otherActivityText && (
      <>
        <DataRowItem label="Other activity" value={use.otherActivityText} />
        {use.otherActivityLocation && (
          <DataRowItem
            label="Other activity location"
            value={use.otherActivityLocation}
          />
        )}
        {use.otherActivityPeopleCount && (
          <DataRowItem
            label="Number of people present during other activity"
            value={use.otherActivityPeopleCount}
          />
        )}
      </>
    )}
  </SummaryListItem>
);

const Communications: FunctionComponent<{ use: DraftBeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => {
  return (
    <SummaryListItem labelText="Communications">
      {use.callSign && <DataRowItem label="Callsign" value={use.callSign} />}
      {use.fixedVhfRadio === "true" && (
        <>
          Fixed VHF/DSC radio
          <br />
          {use.fixedVhfRadioInput && (
            <DataRowItem label="MMSI number" value={use.fixedVhfRadioInput} />
          )}
        </>
      )}
      {use.vhfRadio === "true" && (
        <>
          VHF Radio
          <br />
        </>
      )}
      {use.portableVhfRadio === "true" && (
        <>
          Portable VHF/DSC radio
          <br />
          {use.portableVhfRadioInput && (
            <DataRowItem
              label="MMSI number"
              value={use.portableVhfRadioInput}
            />
          )}
        </>
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
  );
};

const MoreDetailsSubSection: FunctionComponent<{ use: DraftBeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => (
  <SummaryListItem labelText="More details">
    <DataRowItem value={use.moreDetails} />
  </SummaryListItem>
);
