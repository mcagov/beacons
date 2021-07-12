import React, { FunctionComponent } from "react";
import { BeaconUse } from "../../lib/registration/types";
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

  return (
    <>
      <SectionHeading>
        {sentenceCase(useRankString(index + 1))} use:{" "}
        {makeEnumValueUserFriendly(use.environment)} {" - "}
        {makeEnumValueUserFriendly(use.activity)} (
        {makeEnumValueUserFriendly(use.purpose)})
        <a className="govuk-link" href={href}>
          Change
          <span className="govuk-visually-hidden">Change</span>
        </a>
        <a
          className="govuk-link"
          href={
            // TODO: Update delete link.  See https://trello.com/c/nuEwKc21
            "https://www.google.com/search?q=how+to+implement+an+are+you+sure+page+without+clientside+javascript&source=hp&ei=AxfsYMWDBISo8gLOx4CQBQ&iflsig=AINFCbYAAAAAYOwlE3g2vYGGn-I__b3GXlj5tmuK6Vpt&oq=how+to+implement+an+are+you+sure+page+without+clientside+javascript&gs_lcp=Cgdnd3Mtd2l6EAM6CAgAELEDEIMBOggILhCxAxCDAToLCC4QsQMQxwEQowI6DgguELEDEIMBEMcBEKMCOgUIABCxAzoNCAAQsQMQgwEQRhD7AToCCAA6BAgAEAM6AgguOgYIABAWEB46BAgAEA06BggAEA0QHjoICCEQFhAdEB46BAghEBU6BQghEKABOgcIIRAKEKABOgQIIRAKUOUIWNlCYMhDaAJwAHgCgAG8AogB1kCSAQk0My4xNC45LjKYAQCgAQGqAQdnd3Mtd2l6&sclient=gws-wiz&ved=0ahUKEwiFkYqRp93xAhUElFwKHc4jAFIQ4dUDCAk&uact=5"
          }
        >
          Delete
          <span className="govuk-visually-hidden">Delete</span>
        </a>
      </SectionHeading>

      <AboutThisUse use={use} />
      <Communications use={use} />
      <MoreDetailsSubSection use={use} />
    </>
  );
};

const AboutThisUse: FunctionComponent<{ use: BeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => (
  <>
    <SummaryList>
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
    </SummaryList>
  </>
);

const Communications: FunctionComponent<{ use: BeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => {
  return (
    <>
      <SummaryList>
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
      </SummaryList>
    </>
  );
};

const MoreDetailsSubSection: FunctionComponent<{ use: BeaconUse }> = ({
  use,
}: {
  use: BeaconUse;
}): JSX.Element => (
  <SummaryList>
    <SummaryListItem labelText="More details">
      <BeaconUseDataRowItem value={use.moreDetails} />
    </SummaryListItem>
  </SummaryList>
);

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
