import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { formatMonth } from "../../lib/writingStyle";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconInformationSummaryProps {
  registration: DraftRegistration;
  changeUrl: string;
}

export const CheckYourAnswersBeaconInformationSummary: FunctionComponent<CheckYourAnswersBeaconInformationSummaryProps> =
  ({
    registration,
    changeUrl,
  }: CheckYourAnswersBeaconInformationSummaryProps): JSX.Element => (
    <>
      <SummaryList>
        <SummaryListItem
          labelText="Additional beacon information"
          actions={[{ text: "Change", href: changeUrl }]}
        >
          <DataRowItem
            label="Serial number"
            value={registration.manufacturerSerialNumber}
          />
          <DataRowItem
            label="CHK (checksum) code"
            value={registration.chkCode}
          />
          <DataRowItem label="CSTA / TAC code" value={registration.csta} />
          <DataRowItem
            label="Battery expiry"
            value={
              registration.batteryExpiryDateMonth
                ? formatMonth(
                    `${registration.batteryExpiryDateYear}-${registration.batteryExpiryDateMonth}`
                  )
                : registration.batteryExpiryDateYear
            }
          />
          <DataRowItem
            label="Beacon service date"
            value={
              registration.lastServicedDateMonth
                ? formatMonth(
                    `${registration.lastServicedDateYear}-${registration.lastServicedDateMonth}`
                  )
                : registration.lastServicedDateYear
            }
          />
        </SummaryListItem>
      </SummaryList>
    </>
  );
