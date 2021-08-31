import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface SummarySectionProps extends DraftRegistration {
  changeUrl: string;
}

export const BeaconDetailsSection: FunctionComponent<SummarySectionProps> = ({
  manufacturer,
  model,
  hexId,
  changeUrl,
}: SummarySectionProps): JSX.Element => (
  <>
    <SectionHeading>About the beacon being registered</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Beacon information"
        actions={[{ text: "Change", href: changeUrl }]}
      >
        <DataRowItem label="Manufacturer" value={manufacturer} />
        <DataRowItem label="Model" value={model} />
        <DataRowItem label="Hex ID/UIN" value={hexId} />
      </SummaryListItem>
    </SummaryList>
  </>
);

export const BeaconInformationSection: FunctionComponent<SummarySectionProps> =
  ({
    manufacturerSerialNumber,
    chkCode,
    batteryExpiryDateMonth,
    batteryExpiryDateYear,
    lastServicedDateMonth,
    lastServicedDateYear,
    changeUrl,
  }: SummarySectionProps): JSX.Element => (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="Additional beacon information"
          actions={[{ text: "Change", href: changeUrl }]}
        >
          <DataRowItem label="Serial number" value={manufacturerSerialNumber} />
          <DataRowItem label="CHK (checksum) code" value={chkCode} />
          <DataRowItem
            label="Battery expiry"
            value={
              batteryExpiryDateMonth
                ? batteryExpiryDateMonth + ", " + batteryExpiryDateYear
                : batteryExpiryDateYear
            }
          />
          <DataRowItem
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

export const BeaconOwnerSection: FunctionComponent<SummarySectionProps> = ({
  ownerFullName,
  ownerTelephoneNumber,
  ownerAlternativeTelephoneNumber,
  ownerEmail,
  changeUrl,
}: SummarySectionProps): JSX.Element => (
  <>
    <SectionHeading>About the beacon owner</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Owner details"
        actions={[{ text: "Change", href: changeUrl }]}
      >
        <DataRowItem value={ownerFullName} />
        <DataRowItem value={ownerTelephoneNumber} />
        <DataRowItem value={ownerAlternativeTelephoneNumber} />
        <DataRowItem value={ownerEmail} />
      </SummaryListItem>
    </SummaryList>
  </>
);

export const BeaconOwnerAddressSection: FunctionComponent<SummarySectionProps> =
  ({
    ownerAddressLine1,
    ownerAddressLine2,
    ownerTownOrCity,
    ownerCounty,
    ownerPostcode,
    changeUrl,
  }: SummarySectionProps): JSX.Element => {
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="Address"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={ownerAddressLine1} />
            <DataRowItem value={ownerAddressLine2} />
            <DataRowItem value={ownerTownOrCity} />
            {ownerCounty && <DataRowItem value={ownerCounty} />}
            <DataRowItem value={ownerPostcode} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };

export const BeaconEmergencyContactsSection: FunctionComponent<SummarySectionProps> =
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
    changeUrl,
  }: SummarySectionProps): JSX.Element => {
    return (
      <>
        <SectionHeading>Emergency contacts</SectionHeading>

        <SummaryList>
          <SummaryListItem
            labelText="Contact 1"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={emergencyContact1FullName} />
            <DataRowItem value={emergencyContact1TelephoneNumber} />
            <DataRowItem value={emergencyContact1AlternativeTelephoneNumber} />
          </SummaryListItem>
          <SummaryListItem
            labelText="Contact 2"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={emergencyContact2FullName} />
            <DataRowItem value={emergencyContact2TelephoneNumber} />
            <DataRowItem value={emergencyContact2AlternativeTelephoneNumber} />
          </SummaryListItem>
          <SummaryListItem
            labelText="Contact 3"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={emergencyContact3FullName} />
            <DataRowItem value={emergencyContact3TelephoneNumber} />
            <DataRowItem value={emergencyContact3AlternativeTelephoneNumber} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
