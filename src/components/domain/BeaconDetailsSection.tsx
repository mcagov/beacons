import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { PageURLs } from "../../lib/urls";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

export const BeaconDetailsSection: FunctionComponent<DraftRegistration> = ({
  manufacturer,
  model,
  hexId,
}: DraftRegistration): JSX.Element => (
  <>
    <SectionHeading>About the beacon being registered</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Beacon information"
        actions={[{ text: "Change", href: PageURLs.checkBeaconDetails }]}
      >
        <DataRowItem label="Manufacturer" value={manufacturer} />
        <DataRowItem label="Model" value={model} />
        <DataRowItem label="Hex ID/UIN" value={hexId} />
      </SummaryListItem>
    </SummaryList>
  </>
);
