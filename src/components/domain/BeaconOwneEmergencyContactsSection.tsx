import React, { FunctionComponent } from "react";
import { PageURLs } from "../../lib/urls";
import { FormSubmission } from "../../presenters/formSubmission";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

export const BeaconOwnerEmergencyContactsSection: FunctionComponent<FormSubmission> =
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
            <DataRowItem value={emergencyContact1FullName} />
            <DataRowItem value={emergencyContact1TelephoneNumber} />
            <DataRowItem value={emergencyContact1AlternativeTelephoneNumber} />
          </SummaryListItem>
          <SummaryListItem
            labelText="Contact 2"
            actions={[{ text: "Change", href: PageURLs.emergencyContact }]}
          >
            <DataRowItem value={emergencyContact2FullName} />
            <DataRowItem value={emergencyContact2TelephoneNumber} />
            <DataRowItem value={emergencyContact2AlternativeTelephoneNumber} />
          </SummaryListItem>
          <SummaryListItem
            labelText="Contact 3"
            actions={[{ text: "Change", href: PageURLs.emergencyContact }]}
          >
            <DataRowItem value={emergencyContact3FullName} />
            <DataRowItem value={emergencyContact3TelephoneNumber} />
            <DataRowItem value={emergencyContact3AlternativeTelephoneNumber} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
