import { IField } from "./IField";
import { IUse } from "entities/IUse";

export const deepFreeze = <T extends Record<string, any>>(
  object: T
): Readonly<T> => {
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};

export const getVesselCommunicationsFields = (use: IUse): IField[] => {
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
