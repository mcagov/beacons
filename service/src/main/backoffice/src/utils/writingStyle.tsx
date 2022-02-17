import { ILegacyOwner, ILegacyUse } from "entities/ILegacyBeacon";
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

export const formatOwners = (owners: IOwner[]): string =>
  owners.map((owner) => owner.fullName).join(", ");

export const formatSvdr = (svdr: string): string => {
  if (!svdr) {
    return "";
  }
  return svdr === "true" ? "YES" : "NO";
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
