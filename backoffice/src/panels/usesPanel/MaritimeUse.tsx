import {
  IField,
  PanelViewingState,
} from "components/dataPanel/PanelViewingState";
import { IUse } from "entities/IUse";
import { FunctionComponent } from "react";
import { getVesselCommunicationsFields } from "utils";

interface MaritimeSummaryProps {
  use: IUse;
}

export const MaritimeUse: FunctionComponent<MaritimeSummaryProps> = ({
  use,
}: MaritimeSummaryProps): JSX.Element => {
  const fields = getMaritimeFields(use);

  return <PanelViewingState fields={fields} />;
};

const getMaritimeFields = (use: IUse): IField[] => {
  return [
    ...getVesselSummaryFields(use),
    ...getVesselCommunicationsFields(use),
    {
      key: "More details",
      value: use?.moreDetails,
    },
  ];
};

const getVesselSummaryFields = (use: IUse): IField[] => [
  { key: "Max persons onboard", value: `${use.maxCapacity || ""}` },
  { key: "Vessel name", value: use?.vesselName },
  { key: "Beacon position", value: use?.beaconLocation },
  { key: "Port Letter and Number (PLN)", value: use?.portLetterNumber },
  { key: "Homeport", value: use?.homeport },
  { key: "Area of operation", value: use?.areaOfOperation },
  { key: "IMO number", value: use?.imoNumber },
  { key: "UK Small Ships Register (SSR) number", value: use?.ssrNumber },
  {
    key: "Registry of Shipping and Seamen (RSS) number",
    value: use?.rssNumber,
  },
  {
    key: "Vessel official number",
    value: use?.officialNumber,
  },
  {
    key: "Windfarm or rig platform location",
    value: use?.rigPlatformLocation,
  },
];
