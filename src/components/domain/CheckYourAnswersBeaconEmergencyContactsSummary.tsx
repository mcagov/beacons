import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconEmergencyContactsSummaryProps
  extends DraftRegistration {
  changeUrl: string;
}
export const CheckYourAnswersBeaconEmergencyContactsSummary: FunctionComponent<CheckYourAnswersBeaconEmergencyContactsSummaryProps> =
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
  }: CheckYourAnswersBeaconEmergencyContactsSummaryProps): JSX.Element => {
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
