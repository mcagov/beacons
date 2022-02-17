import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconEmergencyContactsSummaryProps {
  registration: DraftRegistration;
  changeUrl: string;
}
export const CheckYourAnswersBeaconEmergencyContactsSummary: FunctionComponent<CheckYourAnswersBeaconEmergencyContactsSummaryProps> =
  ({
    registration,
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
            <DataRowItem value={registration.emergencyContact1FullName} />
            <DataRowItem
              value={registration.emergencyContact1TelephoneNumber}
            />
            <DataRowItem
              value={registration.emergencyContact1AlternativeTelephoneNumber}
            />
          </SummaryListItem>
          <SummaryListItem
            labelText="Contact 2"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={registration.emergencyContact2FullName} />
            <DataRowItem
              value={registration.emergencyContact2TelephoneNumber}
            />
            <DataRowItem
              value={registration.emergencyContact2AlternativeTelephoneNumber}
            />
          </SummaryListItem>
          <SummaryListItem
            labelText="Contact 3"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={registration.emergencyContact3FullName} />
            <DataRowItem
              value={registration.emergencyContact3TelephoneNumber}
            />
            <DataRowItem
              value={registration.emergencyContact3AlternativeTelephoneNumber}
            />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
