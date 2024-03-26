import { ILegacyOwner, ILegacyUse } from "entities/ILegacyBeacon";
import { INote } from "entities/INote";
import * as _ from "lodash";
import { FieldValueTypes } from "../components/dataPanel/FieldValue";
import { IEmergencyContact } from "../entities/IEmergencyContact";
import { IOwner } from "../entities/IOwner";
import { Activities, IUse } from "../entities/IUse";

export enum WritingStyle {
  KeyValueSeparator = ":",
}

export enum Placeholders {
  NoData = "N/A",
  UnspecifiedError = "An error occurred",
  UnrecognizedBeaconType = "Unrecognized beacon type",
}

export const formatUses = (uses: IUse[]): string =>
  uses.reduce((formattedUses, use, index, uses) => {
    if (index === uses.length - 1) return formattedUses + formatUse(use);
    return formattedUses + formatUse(use) + ", ";
  }, "");

export const formatUse = (use: IUse): string => {
  const formattedActivity =
    use.activity === Activities.Other
      ? titleCase(use.otherActivity || "")
      : titleCase(use.activity);
  const formattedPurpose = use.purpose ? ` (${titleCase(use.purpose)})` : "";
  return formattedActivity + formattedPurpose;
};

export const formatLegacyUses = (uses: ILegacyUse[]): string =>
  uses.reduce((formattedUses, use, index, uses) => {
    if (index === uses.length - 1) return formattedUses + formatLegacyUse(use);
    return formattedUses + formatLegacyUse(use) + ", ";
  }, "");

export const formatLegacyUse = (use: ILegacyUse): string => {
  return use.useType
    ? `${titleCase(use.useType)}${
        use.vesselType ? " (" + use.vesselType + ")" : ""
      }`
    : "";
};

export const titleCase = (text: string): string => {
  return text
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => (word[0] || "").toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatOwners = (owners: IOwner[]): string => {
  if (owners.length === 1) {
    return owners[0].fullName;
  }

  return owners.map((owner) => owner.fullName).join(", ");
};

export const formatBoolean = (boolean: string): string => {
  if (!boolean) {
    return "";
  }
  return boolean === "true" ? "YES" : "NO";
};

export const formatLegacyOwners = (...owners: ILegacyOwner[]): string =>
  (owners || []).map((owner) => owner.ownerName).join(", ");

export const formatEmergencyContacts = (
  emergencyContacts: IEmergencyContact[]
): string => `${emergencyContacts.length} listed`;

export const formatFieldValue = (
  value: string | number | undefined | null,
  valueType?: FieldValueTypes
): JSX.Element => {
  if (typeof value === "number") return <b>{value.toString()}</b>;
  if (value) return <b>{value.toLocaleUpperCase()}</b>;
  if (valueType === FieldValueTypes.MULTILINE) return <></>;

  return <i>{Placeholders.NoData}</i>;
};

const fieldNameReplacements: Record<string, string> = {
  fixedVhfRadioValue: "MMSI",
};

function lookupFieldName(fieldName: string): string {
  return fieldNameReplacements.hasOwnProperty(fieldName)
    ? fieldNameReplacements[fieldName]
    : fieldName;
}

export function formatForClipboardWithNotes(
  beacon: Record<any, any>,
  notes: INote[]
): string {
  const text = formatForClipboard(beacon);

  if (!notes) {
    return text;
  }

  return text + formatForClipboard(parseNotesData(notes));
}

export function parseNotesData(notes: INote[]): Record<string, any> {
  return {
    notes: notes.map((note) => ({
      typeOfNote: note.type,
      note: note.text,
      notedBy: note.fullName,
      notedByEmailAddress: note.email,
      date: note.createdDate,
    })),
  };
}

export function formatForClipboard(entity: Record<any, any>): string {
  const isArrayWithData = (value: any): boolean =>
    Array.isArray(value) && value.length > 0;

  const isKeyValueObject = (value: any): boolean =>
    value != null &&
    value.constructor.name === "Object" &&
    Object.entries(value).length > 0;

  return Object.entries(entity)
    .map(([key, value]) => {
      key = lookupFieldName(key);

      if (isArrayWithData(value)) {
        return (
          `\n=====${key.toUpperCase()}=====\n` +
          value.map((element: Record<any, any>, index: number) => {
            return (
              `\n-----${key.toUpperCase()} (${index + 1})-----\n` +
              formatForClipboard(element)
            );
          })
        );
      } else if (isKeyValueObject(value)) {
        return `\n=====${_.startCase(
          key
        ).toUpperCase()}=====\n${formatForClipboard(value)}`;
      } else if (typeof value === "boolean") {
        return `${_.startCase(key)}:    ${value ? "Yes" : "No"}\n`;
      } else if (!_.isNumber(value) && _.isEmpty(value)) {
        return `${_.startCase(key)}:    N/A\n`;
      } else {
        return `${_.startCase(key)}:    ${value}\n`;
      }
    })
    .join("");
}
