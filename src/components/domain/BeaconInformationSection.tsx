import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { PageURLs } from "../../lib/urls";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { DataRowItem } from "./DataRowItem";

export const BeaconInformationSection: FunctionComponent<DraftRegistration> = ({
  manufacturerSerialNumber,
  chkCode,
  batteryExpiryDateMonth,
  batteryExpiryDateYear,
  lastServicedDateMonth,
  lastServicedDateYear,
}: DraftRegistration): JSX.Element => (
  <>
    <SummaryList>
      <SummaryListItem
        labelText="Additional beacon information"
        actions={[{ text: "Change", href: PageURLs.beaconInformation }]}
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
