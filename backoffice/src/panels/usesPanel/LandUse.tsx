import {
  IField,
  PanelViewingState,
} from "components/dataPanel/PanelViewingState";
import { Activities, IUse } from "entities/IUse";
import React, { FunctionComponent } from "react";

interface LandSummaryProps {
  use: IUse;
}

export const LandUse: FunctionComponent<LandSummaryProps> = ({
  use,
}: LandSummaryProps) => {
  const fields = getLandFields(use);

  return <PanelViewingState fields={fields} />;
};

const getLandFields = (use: IUse): IField[] => {
  return [
    ...getLandSummaryFields(use),
    ...getLandCommunicationsFields(use),
    { key: "More details", value: use?.moreDetails },
  ];
};

const getLandSummaryFields = (use: IUse): IField[] => {
  const fields = [];

  if (use.activity === Activities.WorkingRemotely) {
    fields.push(
      {
        key: "Where",
        value: use?.workingRemotelyLocation,
      },
      {
        key: "Typical number of people with you",
        value: `${use.workingRemotelyPeopleCount || ""}`,
      }
    );
  }

  if (use.activity === Activities.Windfarm) {
    fields.push(
      {
        key: "Where",
        value: use?.windfarmLocation,
      },
      {
        key: "Typical number of people with you",
        value: `${use.windfarmPeopleCount || ""}`,
      }
    );
  }

  if (use.activity === Activities.Other) {
    fields.push(
      {
        key: "Other activity description",
        value: use?.otherActivity,
      },
      { key: "Where", value: use?.otherActivityLocation },
      {
        key: "Typical number of people with you",
        value: `${use.otherActivityPeopleCount || ""}`,
      }
    );
  }

  return fields;
};

const getLandCommunicationsFields = (use: IUse): IField[] => {
  const fields = [];
  let typeOfCommunicationIndex = 1;

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
