import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconInformationSummaryProps
  extends DraftRegistration {
  changeUrl: string;
}

export const CheckYourAnswersBeaconInformationSummary: FunctionComponent<CheckYourAnswersBeaconInformationSummaryProps> =
  ({
    manufacturerSerialNumber,
    chkCode,
    batteryExpiryDateMonth,
    batteryExpiryDateYear,
    lastServicedDateMonth,
    lastServicedDateYear,
    changeUrl,
  }: CheckYourAnswersBeaconInformationSummaryProps): JSX.Element => (
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
