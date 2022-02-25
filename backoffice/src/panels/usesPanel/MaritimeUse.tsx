import {
  IField,
  PanelViewingState,
} from "components/dataPanel/PanelViewingState";
import { IUse } from "entities/IUse";
import { FunctionComponent } from "react";

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

const getVesselCommunicationsFields = (use: IUse): IField[] => {
  const fields = [];
  fields.push({
    key: "Call sign",
    value: use?.callSign,
  });

  let typeOfCommunicationIndex = 1;

  if (use.vhfRadio) {
    fields.push({
      key: `Communication type ${typeOfCommunicationIndex}`,
      value: "vhf radio",
    });
    typeOfCommunicationIndex++;
  }

  if (use.fixedVhfRadio) {
    fields.push(
      {
        key: `Communication type ${typeOfCommunicationIndex}`,
        value: "fixed vhf/dsc",
      },
      { key: "MMSI", value: use?.fixedVhfRadioValue }
    );
    typeOfCommunicationIndex++;
  }

  if (use.portableVhfRadio) {
    fields.push(
      {
        key: `Communication type ${typeOfCommunicationIndex}`,
        value: "portable vhf/dsc",
      },
      { key: "Portable MMSI", value: use?.portableVhfRadioValue }
    );
    typeOfCommunicationIndex++;
  }

  if (use.satelliteTelephone) {
    fields.push(
      {
        key: `Communication type ${typeOfCommunicationIndex}`,
        value: "satellite telephone",
      },
      {
        key: "Phone number",
        value: use?.satelliteTelephoneValue,
      }
    );
    typeOfCommunicationIndex++;
  }

  if (use.mobileTelephone) {
    fields.push(
      {
        key: `Communication type ${typeOfCommunicationIndex}`,
        value: "mobile phone",
      },
      {
        key: "Number",
        value: [use?.mobileTelephone1, use?.mobileTelephone2],
      }
    );
    typeOfCommunicationIndex++;
  }

  if (use.otherCommunication) {
    fields.push(
      {
        key: `Communication type ${typeOfCommunicationIndex}`,
        value: "Other",
      },
      {
        key: "Details",
        value: use?.otherCommunicationValue,
      }
    );
    typeOfCommunicationIndex++;
  }

  return fields;
};
